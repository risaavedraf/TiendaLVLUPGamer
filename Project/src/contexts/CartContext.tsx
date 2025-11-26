import { createContext, useState, useContext, useEffect } from "react";
import { useAuth } from "./AuthContext";
import type { ReactNode } from "react";
import * as cartApi from "../api/cartApi";
import type { ProductoResponse } from "../api/productApi";
import { getProductImage, fixImageUrl } from "../utils/imageUtils";

// Tipos adaptados para compatibilidad
export type Product = {
  id: number;
  nombre: string;
  descripcion: string;
  precio: number;
  stock: number;
  img?: string;
  categoria?: { id: number; nombre: string };
};

export type CartItem = {
  id: number; // ID del item en el carrito
  productId: number; // ID del producto
  cantidad: number;
  producto?: Product;
  precioUnitario?: number;
  subtotal?: number;
};

type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product, qty?: number) => void;
  lastAddedItemName: string | null;
  clearLastAddedItem: () => void;
  modifyQuantity: (productId: number, change: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  getItemCount: () => number;
  getCartDetails: () => (Product & CartItem)[];
  refreshCart: () => Promise<void>;
  isLoading: boolean;
  total: number;
};

const CartContext = createContext<CartContextType | undefined>(undefined);

// Helper para convertir ProductoResponse a Product
const mapProductoToProduct = (producto: ProductoResponse): Product => ({
  id: producto.id,
  nombre: producto.nombre,
  descripcion: producto.descripcion,
  precio: producto.precio,
  stock: producto.stock,
  // Usar getProductImage para obtener la URL correcta
  img: getProductImage(producto),
  categoria: producto.categoria,
});

// Helper para convertir CarritoItemResponse a CartItem
const mapCarritoItemToCartItem = (item: any): CartItem => {
  // El backend devuelve un formato simplificado, necesitamos adaptarlo
  if (item.producto) {
    // Formato completo (nuevo)
    return {
      id: item.id,
      productId: item.producto.id,
      cantidad: item.cantidad,
      producto: mapProductoToProduct(item.producto),
      precioUnitario: item.precioUnitario,
      subtotal: item.subtotal,
    };
  } else {
    // Formato simplificado del backend actual
    return {
      id: item.productoId,
      productId: item.productoId,
      cantidad: item.cantidad,
      producto: {
        id: item.productoId,
        nombre: item.nombreProducto,
        descripcion: '',
        precio: item.precioUnitario,
        stock: 999, // No sabemos el stock real
        // Usar fixImageUrl para sanitizar la URL
        img: fixImageUrl(item.imagenUrl),
        categoria: undefined,
      },
      precioUnitario: item.precioUnitario,
      subtotal: item.subtotal,
    };
  }
};

export function CartProvider({ children }: { children: ReactNode }) {
  const { currentUser } = useAuth();
  const storageKey = currentUser ? `carrito_${currentUser.id}` : 'carrito_guest';

  // Estado local del carrito (sincronizado con localStorage para offline y por usuario)
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    try {
      const storedCart = localStorage.getItem(storageKey);
      return storedCart ? JSON.parse(storedCart) : [];
    } catch { return []; }
  });

  const [lastAddedItemName, setLastAddedItemName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [total, setTotal] = useState(0);

  // Sincronizar con localStorage usando clave por usuario
  useEffect(() => {
    try { localStorage.setItem(storageKey, JSON.stringify(cartItems)); } catch { /* ignore */ }
  }, [cartItems, storageKey]);

  // Cargar carrito desde la API al montar (si el usuario está logueado)
  useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    const justLoggedOut = localStorage.getItem('just_logged_out');
    if (justLoggedOut) {
      // limpieza carrito guest tras logout anterior
      try { localStorage.removeItem('carrito_guest'); } catch { /* ignore */ }
      localStorage.removeItem('just_logged_out');
      setCartItems([]);
      setTotal(0);
    } else if (token && currentUser) {
      refreshCart();
    }
  }, [currentUser]);

  // Función para refrescar el carrito desde la API
  const refreshCart = async () => {
    try {
      setIsLoading(true);
      const carritoResponse = await cartApi.getCarrito();

      // Mapear items (ahora maneja ambos formatos)
      const items = carritoResponse.items.map(mapCarritoItemToCartItem);

      setCartItems(items);
      setTotal(carritoResponse.total);
    } catch (error: any) {
      console.error('Error al cargar carrito:', error);
      // Si hay error 404 o el carrito no existe, simplemente inicializar vacío
      if (error.response?.status === 404) {
        setCartItems([]);
        setTotal(0);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // ---- FUNCIONES ----

  // Lógica de 'agregarAlCarrito'
  const addToCart = async (product: Product, qty: number = 1) => {
    try {
      setIsLoading(true);

      // Si el usuario está logueado, usar la API
      const token = localStorage.getItem('jwt_token');
      if (token) {
        const response = await cartApi.addItemCarrito({
          productoId: product.id,
          cantidad: qty,
        });
        const items = response.items.map(mapCarritoItemToCartItem);
        setCartItems(items);
        setTotal(response.total);
      } else {
        // Modo offline: usar lógica local
        setCartItems((prevItems) => {
          const itemExistente = prevItems.find((item) => item.producto?.id === product.id);
          const existingQty = itemExistente ? itemExistente.cantidad : 0;

          if (existingQty + qty > product.stock) {
            window.alert("No hay suficiente stock disponible.");
            return prevItems;
          }

          if (itemExistente) {
            return prevItems.map((item) =>
              item.producto?.id === product.id
                ? { ...item, cantidad: item.cantidad + qty }
                : item
            );
          } else {
            return [...prevItems, { id: Date.now(), productId: product.id, cantidad: qty, producto: product }];
          }
        });
      }

      setLastAddedItemName(product.nombre);
    } catch (error: any) {
      console.error('Error al agregar al carrito:', error);
      window.alert(error.response?.data?.mensaje || 'Error al agregar al carrito');
    } finally {
      setIsLoading(false);
    }
  };

  const clearLastAddedItem = () => {
    setLastAddedItemName(null);
  };

  const modifyQuantity = async (productId: number, change: number) => {
    try {
      const token = localStorage.getItem('jwt_token');
      const item = cartItems.find((i) => i.productId === productId);

      if (!item) return;

      const newQuantity = item.cantidad + change;

      if (newQuantity < 1) {
        await removeFromCart(productId);
        return;
      }

      if (token) {
        // CORRECCIÓN: El backend espera productoId, no el ID del item del carrito
        const response = await cartApi.updateItemCarrito(item.productId, newQuantity);
        const items = response.items.map(mapCarritoItemToCartItem);
        setCartItems(items);
        setTotal(response.total);
      } else {
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.productId === productId ? { ...item, cantidad: newQuantity } : item
          )
        );
      }
    } catch (error: any) {
      console.error('Error al modificar cantidad:', error);
      window.alert(error.response?.data?.mensaje || 'Error al modificar cantidad');
    }
  };

  const removeFromCart = async (productId: number) => {
    try {
      const token = localStorage.getItem('jwt_token');
      const item = cartItems.find((i) => i.productId === productId);

      if (!item) return;

      if (token) {
        // CORRECCIÓN: El backend espera productoId
        const response = await cartApi.removeItemCarrito(item.productId);
        const items = response.items.map(mapCarritoItemToCartItem);
        setCartItems(items);
        setTotal(response.total);
      } else {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.productId !== productId)
        );
      }
    } catch (error: any) {
      console.error('Error al eliminar del carrito:', error);
    }
  };

  const clearCart = async () => {
    try {
      const token = localStorage.getItem('jwt_token');

      if (token) {
        await cartApi.clearCarrito();
      }

      setCartItems([]);
      setTotal(0);
    } catch (error) {
      console.error('Error al vaciar carrito:', error);
    }
  };

  const getItemCount = () => {
    return cartItems.reduce((sum, item) => sum + item.cantidad, 0);
  };

  // Función helper para obtener detalles completos del carrito
  const getCartDetails = () => {
    return cartItems.map((item) => ({
      ...item.producto!,
      ...item,
    }));
  };

  // 6. Actualizar el valor del contexto
  const value = {
    cartItems,
    addToCart,
    lastAddedItemName,
    clearLastAddedItem,
    modifyQuantity,
    removeFromCart,
    clearCart,
    getItemCount,
    getCartDetails,
    refreshCart,
    isLoading,
    total,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// 6. Creamos un "Hook" personalizado para usar el contexto fácilmente
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart debe ser usado dentro de un CartProvider");
  }
  return context;
}
