// Archivo: Project/src/pages/DetalleProductoPage.tsx

import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { productosArray } from "../data/products";
import type { Product } from "../data/products";
import { useCart } from "../contexts/CartContext";
//import ProductList from '../components/ProductList'; // Para productos relacionados
import ProductCard from "../component/ProductCard";
import ReviewList from "../component/ReviewList";
import ReviewForm from "../component/ReviewForm";

function DetalleProductoPage() {
  // 1. Obtener el parámetro ':productId' de la URL
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [cantidad, setCantidad] = useState(1);

  // 2. Estado para guardar el producto encontrado
  const [producto, setProducto] = useState<Product | null>(null);
  // Estado para la imagen principal seleccionada (para la galería)
  const [mainImageSrc, setMainImageSrc] = useState<string>("");
  // Estado para controlar el editor de reseñas y forzar recarga de la lista
  const [openReviewEditor, setOpenReviewEditor] = useState(false);
  const [reviewRefresh, setReviewRefresh] = useState(0);

  // 3. Efecto para buscar el producto cuando el productId cambie
  useEffect(() => {
    const id = parseInt(productId || "0", 10); // Convertir a número
    const foundProduct = productosArray.find((p) => p.id === id);
    if (foundProduct) {
      setProducto(foundProduct);
      setMainImageSrc(foundProduct.img); // Imagen inicial
      // Inicializar cantidad según stock: si no hay stock -> 0, si hay -> 1
      setCantidad(foundProduct.stock && foundProduct.stock > 0 ? 1 : 0);
    } else {
      setProducto(null); // Producto no encontrado
      setMainImageSrc("");
    }
  }, [productId]); // Se ejecuta cada vez que el 'productId' de la URL cambia

  // 4. Si el producto no se encuentra, mostrar un mensaje
  if (!producto) {
    return (
      <div className="container py-5">
        <div className="alert alert-warning text-center">
          <h3>Producto no encontrado</h3>
          <button
            className="btn btn-primary mt-3"
            onClick={() => navigate("/productos")}
          >
            Volver a Productos
          </button>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    // Añadir la cantidad solicitada en una sola llamada (el contexto comprobará stock)
    addToCart(producto, cantidad);
  };

  // 5. (Los productos relacionados se calculan directamente donde se usan)

  // --- Renderizado del componente (JSX de DetalleProducto.html migrado) ---
  return (
    <div className="container py-5">
      <button
        className="btn btn-outline-secondary mb-4"
        onClick={() => navigate(-1)}
      >
        ← Volver
      </button>

      <div className="row">
        <div className="col-md-6 mb-4">
          <div className="bg-white rounded-3 shadow-sm p-4">
            <img
              src={mainImageSrc || producto.img}
              alt={producto.nombre}
              className="img-fluid"
              style={{
                maxHeight: "500px",
                width: "100%",
                objectFit: "contain",
              }}
            />
          </div>
        </div>

        <div className="col-md-6">
          <div className="bg-white rounded-3 shadow-sm p-4">
            <span className="badge bg-secondary mb-3">
              {producto.categoria.nombre}
            </span>
            <h1 className="h2 mb-3">{producto.nombre}</h1>

            <div className="mb-4">
              <span className="h3 text-primary fw-bold">
                ${producto.precio.toFixed(2)}
              </span>
            </div>

            <div className="mb-4">
              <h5 className="fw-bold">Descripción</h5>
              <p className="text-muted">{producto.descripcion}</p>
            </div>

            <div className="mb-4">
              <label htmlFor="cantidad" className="form-label fw-bold">
                Cantidad
              </label>
              <div className="input-group" style={{ maxWidth: "150px" }}>
                <button
                  className="btn btn-outline-secondary"
                  onClick={() => setCantidad((prev) => Math.max(1, prev - 1))}
                  disabled={producto.stock === 0 || cantidad <= 1}
                >
                  -
                </button>
                <input
                  type="number"
                  id="cantidad"
                  className="form-control text-center"
                  value={cantidad}
                  onChange={(e) => {
                    const parsed = parseInt(e.target.value || "", 10);
                    if (isNaN(parsed)) {
                      setCantidad(producto.stock && producto.stock > 0 ? 1 : 0);
                      return;
                    }
                    // Si no hay stock, mantener 0
                    if (producto.stock === 0) {
                      setCantidad(0);
                      return;
                    }
                    // Clamp entre 1 y stock disponible
                    setCantidad(
                      Math.max(1, Math.min(producto.stock || 1, parsed))
                    );
                  }}
                  min={producto.stock === 0 ? 0 : 1}
                  max={producto.stock}
                  disabled={producto.stock === 0}
                />
                <button
                  className="btn btn-outline-secondary"
                  onClick={() =>
                    setCantidad((prev) =>
                      Math.min(producto.stock || prev + 1, prev + 1)
                    )
                  }
                  disabled={
                    producto.stock === 0 || cantidad >= (producto.stock || 0)
                  }
                >
                  +
                </button>
              </div>
            </div>

            <div className="d-grid gap-2">
              <button
                className={`btn btn-lg ${
                  producto.stock === 0 ? "btn-secondary" : "btn-primary"
                }`}
                onClick={handleAddToCart}
                disabled={producto.stock === 0}
                aria-disabled={producto.stock === 0}
              >
                {producto.stock === 0 ? "Agotado" : "🛒 Añadir al Carrito"}
              </button>
              <button
                className="btn btn-outline-secondary"
                onClick={() => navigate("/productos")}
              >
                Seguir Comprando
              </button>
            </div>

            <div className="mt-4 pt-4 border-top">
              <h6 className="fw-bold mb-3">Información del Producto</h6>
              <ul className="list-unstyled">
                <li className="mb-2">
                  <i className="bi bi-check-circle text-success me-2"></i>
                  Envío gratuito en compras superiores a $100
                </li>
                <li className="mb-2">
                  <i className="bi bi-shield-check text-success me-2"></i>
                  Garantía de 1 año
                </li>
                <li className="mb-2">
                  <i className="bi bi-box-seam text-success me-2"></i>
                  Producto original
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-5">
        <h3 className="mb-4">Productos Relacionados</h3>
        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4">
          {productosArray
            .filter(
              (p) =>
                p.categoria.nombre === producto.categoria.nombre &&
                p.id !== producto.id
            )
            .slice(0, 4)
            .map((p) => (
              <div key={p.id} className="col">
                <div className="card h-100 shadow-sm">
                  <img
                    src={p.img}
                    className="card-img-top"
                    alt={p.nombre}
                    style={{
                      height: "200px",
                      objectFit: "contain",
                      padding: "1rem",
                      cursor: "pointer",
                    }}
                    onClick={() => navigate(`/producto/${p.id}`)}
                  />
                  <div className="card-body">
                    <h6 className="card-title">{p.nombre}</h6>
                    <p className="text-primary fw-bold">
                      ${p.precio.toFixed(2)}
                    </p>
                    <button
                      className="btn btn-sm btn-primary w-100"
                      onClick={() => navigate(`/producto/${p.id}`)}
                    >
                      Ver Detalles
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Reseñas: se muestran debajo de los productos relacionados */}
      <div className="mt-5">
        <ReviewList
          productId={producto.id}
          refreshVersion={reviewRefresh}
          onEditClick={() => setOpenReviewEditor(true)}
        />
        <ReviewForm
          productId={producto.id}
          open={openReviewEditor}
          onClose={() => setOpenReviewEditor(false)}
          onSubmitted={() => {
            setOpenReviewEditor(false);
            setReviewRefresh((v) => v + 1);
          }}
        />
      </div>
    </div>
  );
}

export default DetalleProductoPage;
