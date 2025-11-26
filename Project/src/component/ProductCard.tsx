import { getProductImage } from "../utils/imageUtils";
import type { ProductoResponse } from "../api/productApi";
import { Link } from "react-router-dom";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";
import { renderStockBadge } from "../utils/stock";
import { getAverageRating } from "../utils/reviews";

// Helper para formatear precios en CLP
const formatCLP = (precio: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(precio);
};

interface ProductCardProps {
  producto: ProductoResponse;
}

function ProductCard({ producto }: ProductCardProps) {
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const avg = getAverageRating(producto.id);

  // Adaptar ProductoResponse a Product para el carrito
  const productoParaCarrito = {
    id: producto.id,
    nombre: producto.nombre,
    descripcion: producto.descripcion,
    precio: producto.precio,
    stock: producto.stock,
    img: getProductImage(producto),
    categoria: producto.categoria,
  };

  const discountPercent =
    currentUser &&
      currentUser.email &&
      (currentUser.email.endsWith("@duocuc.cl") ||
        currentUser.email.endsWith("@profesor.duoc.cl"))
      ? 0.1
      : 0;
  const discountedPrice = producto.precio * (1 - discountPercent);

  function Stars({ value }: { value: number }) {
    // Show half stars for fractional averages. Fractions >=0.75 round up,
    // fractions between 0.25 and 0.75 show a half star.
    let fullCount = Math.floor(value);
    const frac = value - fullCount;
    let half = false;
    if (frac >= 0.75) {
      fullCount += 1;
    } else if (frac >= 0.25) {
      half = true;
    }

    return (
      <span aria-hidden>
        {Array.from({ length: 5 }).map((_, i) => {
          if (i < fullCount)
            return <i key={i} className="bi bi-star-fill text-warning" />;
          if (i === fullCount && half)
            return <i key={i} className="bi bi-star-half text-warning" />;
          return <i key={i} className="bi bi-star text-muted" />;
        })}
      </span>
    );
  }

  return (
    <div className="col">
      <div className="card h-100 shadow-sm border-0 product-card">
        <Link to={`/producto/${producto.id}`} className="text-decoration-none">
          <img
            src={getProductImage(producto)}
            className="card-img-top"
            alt={producto.nombre}
            loading="lazy"
            style={{ height: "250px", objectFit: "contain", padding: "1rem" }}
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
          <p
            className="card-text text-muted small flex-grow-1"
            style={{
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
            }}
          >
            {producto.descripcion}
          </p>
          <div className="mt-auto">
            <div className="d-flex justify-content-between align-items-center mb-2">
              <span className="h5 mb-0 fw-bold text-primary">
                {discountPercent > 0 ? (
                  <>
                    <span
                      style={{
                        textDecoration: "line-through",
                        color: "#888",
                        fontSize: "0.9rem",
                        marginRight: 6,
                      }}
                    >
                      {formatCLP(producto.precio)}
                    </span>
                    <span>{formatCLP(discountedPrice)}</span>
                  </>
                ) : (
                  <>{formatCLP(producto.precio)}</>
                )}
              </span>
              <div className="text-end small">
                {avg ? (
                  <div>
                    <Stars value={avg} />
                    <div className="text-muted">{avg} ⭐</div>
                  </div>
                ) : (
                  <div className="text-muted">Sin reseñas</div>
                )}
              </div>
            </div>

            {/* Mostrar stock disponible */}
            <div className="mb-2">
              {producto.stock > 0 ? (
                <small className="text-muted">
                  <i className="bi bi-box-seam me-1"></i>
                  Stock disponible: <strong>{producto.stock}</strong> {producto.stock === 1 ? 'unidad' : 'unidades'}
                </small>
              ) : (
                <small className="text-danger fw-bold">
                  <i className="bi bi-x-circle me-1"></i>
                  Sin stock
                </small>
              )}
            </div>

            {/* Badge de stock (si corresponde) */}
            <div className="mb-2">{renderStockBadge(producto.stock)}</div>

            {/* Botón deshabilitado si está agotado */}
            {producto.stock === 0 ? (
              <button
                className="btn btn-secondary w-100"
                disabled
                aria-disabled
              >
                Agotado
              </button>
            ) : (
              <button
                className="btn btn-primary w-100"
                onClick={() => addToCart(productoParaCarrito)}
              >
                🛒 Añadir al Carrito
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
