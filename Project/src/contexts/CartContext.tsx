// Archivo: Project/src/contexts/CartContext.tsx

import { createContext, useState, useContext, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Product } from '../data/products';
import { productosArray } from '../data/products'; // Importamos nuestro tipo de Producto

// 1. Definimos cómo se verá un ítem en el carrito
export type CartItem = {
  id: number;
  cantidad: number;
};

// 2. Definimos qué expondrá nuestro Contexto
type CartContextType = {
  cartItems: CartItem[];
  addToCart: (product: Product) => void;
  lastAddedItemName: string | null;
  clearLastAddedItem: () => void;
  
  // 2. NUEVAS FUNCIONES (de Carrito.js)
  modifyQuantity: (productId: number, change: number) => void;
  removeFromCart: (productId: number) => void;
  clearCart: () => void;
  
  // 3. NUEVA FUNCIÓN (para el header)
  getItemCount: () => number;

  // 4. NUEVA FUNCIÓN (para obtener detalles)
  getCartDetails: () => (Product & CartItem)[];
};

// 3. Creamos el Contexto
const CartContext = createContext<CartContextType | undefined>(undefined);

// 4. Creamos el "Proveedor" (El componente que tendrá la lógica)
export function CartProvider({ children }: { children: ReactNode }) {
  
  // ---- LÓGICA DE ESTADO ----
  
  // Estado para el carrito, inicializado desde localStorage
  const [cartItems, setCartItems] = useState<CartItem[]>(() => {
    const storedCart = localStorage.getItem('carrito'); //
    return storedCart ? JSON.parse(storedCart) : [];
  });

  // Estado para el Toast
  const [lastAddedItemName, setLastAddedItemName] = useState<string | null>(null);

  // Efecto para guardar en localStorage CADA VEZ que el carrito cambie
  useEffect(() => {
    localStorage.setItem('carrito', JSON.stringify(cartItems)); //
  }, [cartItems]);

  // ---- FUNCIONES ----

  // Lógica de 'agregarAlCarrito'
  const addToCart = (product: Product) => {
    setCartItems(prevItems => {
      const itemExistente = prevItems.find(item => item.id === product.id);
      
      if (itemExistente) {
        // Si existe, actualiza la cantidad
        return prevItems.map(item =>
          item.id === product.id ? { ...item, cantidad: item.cantidad + 1 } : item
        );
      } else {
        // Si no existe, añádelo
        return [...prevItems, { id: product.id, cantidad: 1 }];
      }
    });
    
    // Guardamos el nombre para el Toast
    setLastAddedItemName(product.nombre);
  };
  
  const clearLastAddedItem = () => {
    setLastAddedItemName(null);
  };

  const modifyQuantity = (productId: number, change: number) => {
    setCartItems(prevItems => {
      const itemEnCarrito = prevItems.find(item => item.id === productId);
      if (!itemEnCarrito) return prevItems;

      const newQuantity = itemEnCarrito.cantidad + change;

      if (newQuantity < 1) {
        // Eliminar si la cantidad es 0 o menos
        return prevItems.filter(item => item.id !== productId);
      } else {
        // Actualizar la cantidad
        return prevItems.map(item =>
          item.id === productId ? { ...item, cantidad: newQuantity } : item
        );
      }
    });
  };

  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const getItemCount = () => {
    return cartItems.reduce((sum, item) => sum + item.cantidad, 0);
  };
  
  // Función helper para obtener detalles completos del carrito
  const getCartDetails = () => {
    return cartItems.map(item => {
      const product = productosArray.find(p => p.id === item.id);
      // Combinamos el producto encontrado con la cantidad del carrito
      return { ...product!, ...item }; 
    }).filter(item => item.nombre); // Filtramos por si un producto no se encontró
  };

  // 6. Actualizar el valor del contexto
  const value = {
    cartItems,
    addToCart,
    lastAddedItemName,
    clearLastAddedItem,
    
    // Exponer las nuevas funciones
    modifyQuantity,
    removeFromCart,
    clearCart,
    getItemCount,
    getCartDetails
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
}

// 6. Creamos un "Hook" personalizado para usar el contexto fácilmente
export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart debe ser usado dentro de un CartProvider');
  }
  return context;
}