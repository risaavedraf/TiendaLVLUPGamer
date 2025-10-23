// Archivo: Project/src/components/ProductCard.tsx
// (Versión final y corregida)

import type { Product } from '../data/products';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';

interface ProductCardProps {
  producto: Product;
}

function ProductCard({ producto }: ProductCardProps) {
  const { addToCart } = useCart();

  return (
    <div className="col">
      <div className="card h-100 shadow-sm border-0 product-card">
        <Link to={`/producto/${producto.id}`} className="text-decoration-none">
          <img 
            src={producto.img} 
            className="card-img-top"
            alt={producto.nombre}
            loading="lazy"
            style={{ height: '250px', objectFit: 'contain', padding: '1rem' }}
          />
        </Link>
        <div className="card-body d-flex flex-column">
          <div className="mb-2">
            <span className="badge bg-secondary text-white small">
              {producto.categoria.nombre}
            </span>
          </div>
          <h5 className="card-title text-truncate" title={producto.nombre}>
            <Link 
              to={`/producto/${producto.id}`} 
              className="text-decoration-none text-dark"
            >
              {producto.nombre}
            </Link>
          </h5>
          <p className="card-text text-muted small flex-grow-1" 
             style={{ 
               overflow: 'hidden',
               textOverflow: 'ellipsis',
               display: '-webkit-box',
               WebkitLineClamp: 2,
               WebkitBoxOrient: 'vertical'
             }}>
            {producto.descripcion}
          </p>
          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="h5 mb-0 fw-bold text-primary">
                ${producto.precio.toFixed(2)}
              </span>
            </div>
            <button
              className="btn btn-primary w-100"
              onClick={() => addToCart(producto)}
            >
              🛒 Añadir al Carrito
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;