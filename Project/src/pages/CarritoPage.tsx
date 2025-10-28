// Archivo: Project/src/pages/CarritoPage.tsx
// (Versión corregida del error de tipos)

import { useState } from "react";
import { useCart } from "../contexts/CartContext";
import { useAuth } from "../contexts/AuthContext";

// 1. Definimos el tipo para el VALOR del objeto de códigos
type DescuentoInfo = {
  tipo: "porcentaje" | "fijo";
  valor: number;
};

// 2. Definimos el tipo para el OBJETO de códigos
// Le dice a TypeScript: "Es un objeto donde las claves son strings
// y los valores son del tipo DescuentoInfo"
type CodigosDescuento = {
  [key: string]: DescuentoInfo;
};

// 3. Aplicamos ese tipo a nuestra constante
const codigosDescuento: CodigosDescuento = {
  DESCUENTO50: { tipo: "porcentaje", valor: 50 },
  "5OFF": { tipo: "fijo", valor: 5 },
};

// 4. Este tipo (que ya tenías) sigue igual
type DescuentoAplicado = {
  codigo: string;
  tipo: "porcentaje" | "fijo";
  valor: number;
};

function CarritoPage() {
  const { getCartDetails, modifyQuantity, removeFromCart, clearCart } =
    useCart();

  const cartDetails = getCartDetails();
  const { currentUser } = useAuth();
  const discountPercent =
    currentUser &&
    currentUser.email &&
    (currentUser.email.endsWith("@duocuc.cl") ||
      currentUser.email.endsWith("@profesor.duoc.cl"))
      ? 0.1
      : 0;

  const [inputCode, setInputCode] = useState("");
  const [appliedDiscount, setAppliedDiscount] =
    useState<DescuentoAplicado | null>(null);

  const subtotal = cartDetails.reduce((sum, item) => {
    const effectivePrice = item.precio * (1 - discountPercent);
    return sum + effectivePrice * item.cantidad;
  }, 0);

  let montoDescuento = 0;
  if (appliedDiscount) {
    if (appliedDiscount.tipo === "porcentaje") {
      montoDescuento = (subtotal * appliedDiscount.valor) / 100;
    } else {
      montoDescuento = appliedDiscount.valor;
    }
  }
  const totalFinal = subtotal - montoDescuento;

  const handleApplyDiscount = () => {
    const codigoKey = inputCode.trim().toUpperCase(); // No necesitamos 'as keyof...'

    // 5. TypeScript ahora sabe que codigosDescuento[codigoKey] es DescuentoInfo
    if (codigosDescuento[codigoKey]) {
      // 6. ¡Esta línea ahora es válida!
      // TypeScript sabe que codigosDescuento[codigoKey].tipo es 'porcentaje' | 'fijo'
      setAppliedDiscount({
        codigo: codigoKey,
        ...codigosDescuento[codigoKey],
      });
      alert(`¡Código "${codigoKey}" aplicado!`);
    } else {
      setAppliedDiscount(null);
      alert("El código de descuento no es válido.");
    }
    setInputCode("");
  };

  const handleClearCart = () => {
    if (confirm("¿Estás seguro de que quieres vaciar el carrito?")) {
      clearCart();
      setAppliedDiscount(null);
    }
  };

  return (
    <div className="container my-5">
      <h1 className="mb-4">Mi Carrito</h1>
      <div className="row">
        {/* Columna de ítems */}
        <div className="col-md-8">
          {cartDetails.length === 0 ? (
            <div className="alert alert-info">El carrito está vacío.</div>
          ) : (
            <div id="carrito-contenedor">
              {cartDetails.map((item) => (
                <div key={item.id} className="card mb-3 shadow-sm">
                  {/* ... (el JSX interno de la tarjeta del carrito no cambia) ... */}
                  <div className="card-body">
                    <div className="row align-items-center">
                      <div className="col-md-2 text-center">
                        <img
                          src={item.img}
                          className="img-fluid rounded"
                          alt={item.nombre}
                          style={{
                            maxHeight: "100px",
                            width: "100px",
                            objectFit: "contain",
                          }}
                        />
                      </div>
                      <div className="col-md-5">
                        <h5 className="mb-0">{item.nombre}</h5>
                        <p className="text-muted mb-1 small">
                          {item.descripcion
                            ? item.descripcion.substring(0, 70) + "..."
                            : "Sin descripción"}
                        </p>
                        <button
                          className="btn btn-sm btn-outline-danger mt-1"
                          onClick={() => removeFromCart(item.id)}
                        >
                          Eliminar
                        </button>
                      </div>
                      <div className="col-md-3 text-center d-flex align-items-center justify-content-center">
                        <div
                          className="input-group input-group-sm"
                          style={{ width: "120px" }}
                        >
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => modifyQuantity(item.id, -1)}
                          >
                            -
                          </button>
                          <input
                            type="text"
                            className="form-control text-center"
                            value={item.cantidad}
                            readOnly
                          />
                          <button
                            className="btn btn-outline-secondary"
                            type="button"
                            onClick={() => modifyQuantity(item.id, 1)}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div className="col-md-2 text-end">
                        <h5 className="mb-0">
                          $
                          {(
                            item.precio *
                            (1 - discountPercent) *
                            item.cantidad
                          ).toFixed(2)}
                        </h5>
                        {discountPercent > 0 && (
                          <div className="small text-muted">
                            (incluye {discountPercent * 100}% descuento)
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Columna de Resumen */}
        {cartDetails.length > 0 && (
          <div className="col-md-4">
            <div className="card">
              {/* ... (el JSX interno del resumen del carrito no cambia) ... */}
              <div className="card-body">
                <h5 className="card-title">Resumen del Pedido</h5>
                <ul className="list-group list-group-flush">
                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    Subtotal
                    <span>${subtotal.toFixed(2)}</span>
                  </li>

                  {appliedDiscount && (
                    <li className="list-group-item d-flex justify-content-between align-items-center text-danger">
                      Descuento ({appliedDiscount.codigo})
                      <span>-${montoDescuento.toFixed(2)}</span>
                    </li>
                  )}

                  <li className="list-group-item d-flex justify-content-between align-items-center">
                    <strong>Total</strong>
                    <strong>
                      <span>${totalFinal.toFixed(2)}</span>
                    </strong>
                  </li>
                </ul>

                <div className="mt-3">
                  <div className="input-group">
                    <input
                      type="text"
                      id="input-descuento"
                      className="form-control"
                      placeholder="Código de descuento"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                    />
                    <button
                      id="btn-aplicar-descuento"
                      className="btn btn-secondary"
                      type="button"
                      onClick={handleApplyDiscount}
                    >
                      Aplicar
                    </button>
                  </div>
                </div>

                <div className="d-grid gap-2 mt-3">
                  <button className="btn btn-primary" type="button">
                    Proceder al Pago
                  </button>
                  <button
                    id="btn-vaciar-carrito"
                    className="btn btn-danger"
                    type="button"
                    onClick={handleClearCart}
                  >
                    Vaciar Carrito
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default CarritoPage;
