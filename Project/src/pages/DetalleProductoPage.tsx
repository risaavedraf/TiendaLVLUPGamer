// Archivo: Project/src/pages/DetalleProductoPage.tsx

import { useParams, useNavigate } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import * as productApi from "../api/productApi";
import type { ProductoResponse } from "../api/productApi";
import { useCart } from "../contexts/CartContext";

// Helper para formatear precios en CLP
const formatCLP = (precio: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(precio);
};
//import ProductList from '../components/ProductList'; // Para productos relacionados
// ProductCard not used in this page
import ReviewList from "../component/ReviewList";
import ReviewForm from "../component/ReviewForm";

// Local Error Boundary to avoid full white screen when a child throws
class LocalErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean; error?: any }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false, error: undefined };
  }
  static getDerivedStateFromError(error: any) {
    return { hasError: true, error };
  }
  componentDidCatch(error: any, info: any) {
    console.error("ErrorBoundary caught:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="container py-5">
          <div className="alert alert-danger text-center">
            <h4>Ha ocurrido un error al cargar este producto.</h4>
            <pre
              style={{ textAlign: "left", maxHeight: 200, overflow: "auto" }}
            >
              {String(this.state.error)}
            </pre>
            <div className="mt-3">
              <button
                className="btn btn-primary me-2"
                onClick={() => window.location.reload()}
              >
                Recargar
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => (window.location.href = "/productos")}
              >
                Ir a Productos
              </button>
            </div>
          </div>
        </div>
      );
    }
    return this.props.children as any;
  }
}

function DetalleProductoPage() {
  // IMPORTANTE: Todos los hooks deben estar ANTES de cualquier return condicional
  // 1. Obtener el parámetro ':productId' de la URL
  const { productId } = useParams<{ productId: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { currentUser } = useAuth(); // Mover aquí desde abajo
  const [cantidad, setCantidad] = useState(1);

  // 2. Estado para guardar el producto encontrado
  const [producto, setProducto] = useState<ProductoResponse | null>(null);
  const [productosRelacionados, setProductosRelacionados] = useState<ProductoResponse[]>([]);
  // Estado para la imagen principal seleccionada (para la galería)
  const [mainImageSrc, setMainImageSrc] = useState<string>("");
  // Estado para controlar el editor de reseñas y forzar recarga de la lista
  const [openReviewEditor, setOpenReviewEditor] = useState(false);
  const [reviewRefresh, setReviewRefresh] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  // 3. Efecto para buscar el producto cuando el productId cambie
  useEffect(() => {
    const loadProducto = async () => {
      try {
        setIsLoading(true);
        const id = parseInt(productId || "0", 10);
        const foundProduct = await productApi.getProductoById(id);
        setProducto(foundProduct);
        setMainImageSrc(foundProduct.imagenes && foundProduct.imagenes.length > 0 ? foundProduct.imagenes[0].url : "/Img/elementor-placeholder-image.png");
        setCantidad(foundProduct.stock && foundProduct.stock > 0 ? 1 : 0);
        
        // Cargar productos relacionados
        const todosProductos = await productApi.getProductos(0, 100);
        const relacionados = todosProductos.content
          .filter(p => p.categoria.id === foundProduct.categoria.id && p.id !== foundProduct.id)
          .slice(0, 4);
        setProductosRelacionados(relacionados);
      } catch (error) {
        console.error('Error al cargar producto:', error);
        setProducto(null);
      } finally {
        setIsLoading(false);
      }
    };
    loadProducto();
  }, [productId]);

  // 4. Mostrar loading
  if (isLoading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Cargando...</span>
        </div>
      </div>
    );
  }

  // Si el producto no se encuentra, mostrar un mensaje
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

  // Calcular descuento basado en el usuario actual
  const discountPercent =
    currentUser &&
    currentUser.email &&
    (currentUser.email.endsWith("@duocuc.cl") ||
      currentUser.email.endsWith("@profesor.duoc.cl"))
      ? 0.1
      : 0;
  const displayedPrice = producto.precio * (1 - discountPercent);

  // 5. (Los productos relacionados se calculan directamente donde se usan)

  // --- Renderizado del componente (JSX de DetalleProducto.html migrado) ---
  return (
    <LocalErrorBoundary>
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
                src={mainImageSrc || (producto.imagenes && producto.imagenes.length > 0 ? producto.imagenes[0].url : "/Img/elementor-placeholder-image.png")}
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
                  {discountPercent > 0 ? (
                    <>
                      <span
                        style={{
                          textDecoration: "line-through",
                          color: "#888",
                          fontSize: "0.9rem",
                          marginRight: 8,
                        }}
                      >
                        {formatCLP(producto.precio)}
                      </span>
                      <span>{formatCLP(displayedPrice)}</span>
                    </>
                  ) : (
                    <>{formatCLP(producto.precio)}</>
                  )}
                </span>
              </div>

              {/* Indicador de stock */}
              <div className="mb-3">
                {producto.stock > 0 ? (
                  <div className="d-flex align-items-center">
                    <i className="bi bi-box-seam text-success me-2" style={{ fontSize: "1.5rem" }}></i>
                    <div>
                      <div className="fw-bold text-success">Disponible en stock</div>
                      <small className="text-muted">{producto.stock} {producto.stock === 1 ? 'unidad disponible' : 'unidades disponibles'}</small>
                    </div>
                  </div>
                ) : (
                  <div className="d-flex align-items-center">
                    <i className="bi bi-x-circle text-danger me-2" style={{ fontSize: "1.5rem" }}></i>
                    <div className="fw-bold text-danger">Producto agotado</div>
                  </div>
                )}
              </div>

              {/* Badge para pocas unidades: mostrar si stock entre 1 y 4 */}
              {typeof producto.stock === "number" &&
                producto.stock > 0 &&
                producto.stock < 5 && (
                  <div className="mb-3">
                    <span className="badge bg-warning text-dark">
                      ⚠️ ¡Pocas unidades! Solo quedan {producto.stock}
                    </span>
                  </div>
                )}

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
                        setCantidad(
                          producto.stock && producto.stock > 0 ? 1 : 0
                        );
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
            {productosRelacionados.map((p) => (
                  <div key={p.id} className="col">
                  <div className="card h-100 shadow-sm">
                    <img
                      src={p.imagenes && p.imagenes.length > 0 ? p.imagenes[0].url : "/Img/elementor-placeholder-image.png"}
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
                        {formatCLP(p.precio)}
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
    </LocalErrorBoundary>
  );
}

export default DetalleProductoPage;
