// Archivo: Project/src/components/ProductCard.tsx
// (Versión final y corregida)

import { Link } from 'react-router-dom';
import type { Product } from '../data/products';     // Importamos el tipo de Producto
import { useCart } from '../contexts/CartContext'; // Importamos el hook del carrito

// 1. Aquí está la definición del tipo que faltaba
export type ProductCardProps = {
  producto: Product;
};

// 2. Usamos el tipo "ProductCardProps" para las props de la función
function ProductCard({ producto }: ProductCardProps) {
  
  // 3. Obtenemos la función addToCart de nuestro contexto
  const { addToCart } = useCart();

  return (
    <div className="col">
      <div className="card h-100 shadow-sm">
        <Link to={`/productos/${producto.id}`}>
          <img src={producto.img} className="card-img-top" alt={producto.nombre} />
        </Link>
        <div className="card-body d-flex flex-column">
          <p className="text-center flex-grow-1">
            <Link to={`/productos/${producto.id}`}>{producto.nombre}</Link>
          </p>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <small>{producto.categoria.nombre}</small>
            <small>${producto.precio}</small>
          </div>
          
          <div className="d-grid">
            <button 
              className="btn btn-primary" 
              // 4. Llamamos a la función del contexto en el clic
              onClick={() => addToCart(producto)} 
            >
              Añadir al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;