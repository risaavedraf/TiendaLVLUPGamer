import { useEffect, useState } from "react";
import { regionesYComunas } from "../data/locations";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { Address, Card } from "../data/checkout";
import { loadSavedAddresses, saveAddresses, loadSavedCards, saveCards, processPayment } from "../data/checkout";

function CheckoutPage() {
  const { getCartDetails, clearCart } = useCart();
  const cart = getCartDetails();
  const subtotal = cart.reduce((s, it) => s + it.precio * it.cantidad, 0);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const userKey = currentUser ? `user_${currentUser.id}` : "guest";

  const [addresses, setAddresses] = useState<Address[]>(() => loadSavedAddresses(userKey));
  const [cards, setCards] = useState<Card[]>(() => loadSavedCards(userKey));
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(addresses[0]?.id ?? null);

  // New address form state
  const [newAddr, setNewAddr] = useState<Partial<Address>>({
    nombre: currentUser?.nombre || "",
    apellido: currentUser?.apellido || "",
    correo: currentUser?.email || "",
    calle: "",
    depto: "",
    region: "",
    comuna: "",
    instrucciones: "",
  });

  const [availableComunas, setAvailableComunas] = useState<string[]>([]);

  useEffect(() => {
    if (newAddr.region) {
      const r = regionesYComunas.find((x) => x.region === newAddr.region);
      setAvailableComunas(r ? r.comunas.map((c) => c.nombre) : []);
    } else setAvailableComunas([]);
  }, [newAddr.region]);

  function updateAddresses(list: Address[]) {
    setAddresses(list);
    saveAddresses(list, userKey);
  }

  function updateCards(list: Card[]) {
    setCards(list);
    saveCards(list, userKey);
  }

  const handleAddAddress = () => {
    // Primero validamos que todos los campos requeridos estén completos
    if (!newAddr.nombre || !newAddr.apellido || !newAddr.correo || 
        !newAddr.calle || !newAddr.region || !newAddr.comuna) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }

    // Validamos si el usuario está autenticado
    if (!currentUser) {
      const response = confirm(
        "Para guardar direcciones necesitas iniciar sesión.\n\n" +
        "• Tus datos se guardarán de forma segura\n" +
        "• Podrás usarlos en futuras compras\n\n" +
        "¿Deseas iniciar sesión ahora?"
      );
      
      if (response) {
        // Guardamos la dirección actual en sessionStorage para recuperarla después del login
        sessionStorage.setItem('pendingAddress', JSON.stringify(newAddr));
        navigate("/login");
      }
      return;
    }

    const id = String(Date.now());
    const a: Address = {
      id,
      nombre: newAddr.nombre || "",
      apellido: newAddr.apellido || "",
      correo: newAddr.correo || "",
      calle: newAddr.calle || "",
      depto: newAddr.depto || "",
      region: newAddr.region || "",
      comuna: newAddr.comuna || "",
      instrucciones: newAddr.instrucciones || "",
    };
    
    const next = [a, ...addresses];
    updateAddresses(next);
    setSelectedAddressId(a.id);
    
    // Mostramos mensaje de éxito
    alert("¡Dirección guardada exitosamente!");
    
    // Limpiamos el formulario manteniendo los datos del usuario
    setNewAddr({
      nombre: currentUser?.nombre || "",
      apellido: currentUser?.apellido || "",
      correo: currentUser?.email || "",
      calle: "",
      depto: "",
      region: "",
      comuna: "",
      instrucciones: "",
    });
  };

  // Simple card save (not secure, for demo only)
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState(currentUser?.nombre || "");
  const [cardExpiry, setCardExpiry] = useState("");
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "failure">("idle");
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const handleSaveCard = () => {
    if (!currentUser) {
      if (
        confirm(
          "Debes iniciar sesión para guardar una tarjeta. ¿Ir a iniciar sesión?"
        )
      ) {
        navigate("/login");
      }
      return;
    }
    const clean = cardNumber.replace(/\s+/g, "");
    const last4 = clean.slice(-4);
    const id = String(Date.now());
    const c: Card = { id, cardholder: cardName, last4, expiry: cardExpiry };
    const next = [c, ...cards];
    updateCards(next);
    setCardNumber("");
    setCardExpiry("");
  };

  const handlePay = () => {
    // Validar dirección: debe tener una seleccionada o todos los campos del formulario nuevo
    const hasSelectedAddress = selectedAddressId && addresses.find(a => a.id === selectedAddressId);
    const hasNewAddress = newAddr.nombre && newAddr.apellido && newAddr.correo && 
                         newAddr.calle && newAddr.region && newAddr.comuna;
    
    if (!hasSelectedAddress && !hasNewAddress) {
      alert("Debes seleccionar una dirección guardada o completar todos los campos de la nueva dirección");
      return;
    }

    // Validar tarjeta: debe tener una guardada o los campos del formulario completos
    const hasValidCard = cards.length > 0 || (cardNumber && cardName && cardExpiry);
    if (!hasValidCard) {
      alert("Debes seleccionar una tarjeta guardada o completar los datos de la nueva tarjeta");
      return;
    }

    // Usar la dirección seleccionada o los datos del formulario (sin guardar de nuevo)
    let addr;
    if (hasSelectedAddress) {
      addr = addresses.find((a) => a.id === selectedAddressId)!;
    } else {
      // Usar los datos del formulario directamente sin guardar
      addr = {
        id: String(Date.now()),
        nombre: newAddr.nombre || "",
        apellido: newAddr.apellido || "",
        correo: newAddr.correo || "",
        calle: newAddr.calle || "",
        depto: newAddr.depto || "",
        region: newAddr.region || "",
        comuna: newAddr.comuna || "",
        instrucciones: newAddr.instrucciones || "",
      };
    }

    // Empezar procesamiento visual
    setPaymentStatus("processing");

    // Procesar el pago
    processPayment(cart, currentUser ? {
      id: currentUser.id,
      nombre: currentUser.nombre || '',
      apellido: currentUser.apellido || '',
      email: currentUser.email || ''
    } : null, addr).then(({ success, orderId }) => {
      setOrderNumber(String(orderId));
      setPaymentStatus(success ? "success" : "failure");
      
      if (success) {
        // Limpiar carrito pero mantener confirmación en página
        clearCart();
      }
    });
  };

  return (
    <div className="container my-5">
      <h2>Información de despacho</h2>
      {paymentStatus === 'success' && (
        <div className="alert alert-success d-flex justify-content-between align-items-center">
          <div>
            <i className="bi bi-check-circle-fill text-success me-2" />
            <strong>Se ha realizado la compra. nro #{orderNumber}</strong>
          </div>
          <div className="text-muted">Código orden: ORDER{orderNumber}</div>
        </div>
      )}
      {paymentStatus === 'failure' && (
        <div className="alert alert-danger d-flex justify-content-between align-items-start">
          <div>
            <i className="bi bi-x-circle-fill text-danger me-2" />
            <strong>No se pudo realizar el pago. nro #{orderNumber}</strong>
            <div className="small">Detalle de comprar</div>
          </div>
          <div className="text-muted">&nbsp;</div>
        </div>
      )}
      {!currentUser && (
        <div className="alert alert-warning d-flex align-items-start">
          <i className="bi bi-info-circle-fill me-2 mt-1"></i>
          <div>
            <strong>Compra como invitado</strong>
            <p className="mb-0 mt-1">
              Para guardar direcciones y tarjetas para futuras compras, necesitas{" "}
              <a href="/login" className="alert-link">iniciar sesión</a>. 
              Aún puedes realizar tu compra como invitado, pero tus datos no se guardarán.
            </p>
          </div>
        </div>
      )}
      <div className="row">
        <div className="col-md-7">
          {addresses.length > 0 && (
            <div className="mb-3">
              <h5>Seleccionar dirección guardada</h5>
              {addresses.map((a) => (
                <div className="form-check" key={a.id}>
                  <input
                    className="form-check-input"
                    type="radio"
                    name="selectedAddress"
                    id={`addr-${a.id}`}
                    checked={selectedAddressId === a.id}
                    onChange={() => setSelectedAddressId(a.id)}
                  />
                  <label className="form-check-label" htmlFor={`addr-${a.id}`}>
                    {a.nombre} {a.apellido} — {a.calle}{" "}
                    {a.depto ? `, ${a.depto}` : ""} — {a.region} / {a.comuna}
                  </label>
                </div>
              ))}
            </div>
          )}

          <h5 className="mt-3">Agregar nueva dirección</h5>
          <div className="row g-3">
            <div className="col-md-6">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="nombreInput"
                  placeholder=" "
                  value={newAddr.nombre || ""}
                  onChange={(e) =>
                    setNewAddr((prev) => ({ ...prev, nombre: e.target.value }))
                  }
                  required
                />
                <label htmlFor="nombreInput">Nombre *</label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="apellidoInput"
                  placeholder=" "
                  value={newAddr.apellido || ""}
                  onChange={(e) =>
                    setNewAddr((prev) => ({ ...prev, apellido: e.target.value }))
                  }
                  required
                />
                <label htmlFor="apellidoInput">Apellido *</label>
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-floating">
                <input
                  type="email"
                  className="form-control"
                  id="correoInput"
                  placeholder=" "
                  value={newAddr.correo || ""}
                  onChange={(e) =>
                    setNewAddr((prev) => ({ ...prev, correo: e.target.value }))
                  }
                  required
                />
                <label htmlFor="correoInput">Correo electrónico *</label>
              </div>
            </div>
            <div className="col-md-8">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="calleInput"
                  placeholder=" "
                  value={newAddr.calle || ""}
                  onChange={(e) =>
                    setNewAddr((prev) => ({ ...prev, calle: e.target.value }))
                  }
                  required
                />
                <label htmlFor="calleInput">Dirección *</label>
              </div>
            </div>
            <div className="col-md-4">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="deptoInput"
                  placeholder=" "
                  value={newAddr.depto || ""}
                  onChange={(e) =>
                    setNewAddr((prev) => ({ ...prev, depto: e.target.value }))
                  }
                />
                <label htmlFor="deptoInput">Depto. (opcional)</label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-floating">
                <select
                  className="form-select"
                  id="regionSelect"
                  value={newAddr.region || ""}
                  onChange={(e) =>
                    setNewAddr((prev) => ({
                      ...prev,
                      region: e.target.value,
                      comuna: "",
                    }))
                  }
                  required
                >
                  <option value="">Seleccione...</option>
                  {regionesYComunas.map((r) => (
                    <option key={r.region} value={r.region}>
                      {r.region}
                    </option>
                  ))}
                </select>
                <label htmlFor="regionSelect">Región *</label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-floating">
                <select
                  className="form-select"
                  id="comunaSelect"
                  value={newAddr.comuna || ""}
                  onChange={(e) =>
                    setNewAddr((prev) => ({ ...prev, comuna: e.target.value }))
                  }
                  disabled={!newAddr.region}
                  required
                >
                  <option value="">Seleccione...</option>
                  {availableComunas.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                <label htmlFor="comunaSelect">Comuna *</label>
              </div>
            </div>
            <div className="col-md-12">
              <div className="form-floating">
                <textarea
                  className="form-control"
                  id="instruccionesInput"
                  placeholder=" "
                  style={{ height: "100px" }}
                  value={newAddr.instrucciones || ""}
                  onChange={(e) =>
                    setNewAddr((prev) => ({
                      ...prev,
                      instrucciones: e.target.value,
                    }))
                  }
                />
                <label htmlFor="instruccionesInput">Indicaciones de entrega (opcional)</label>
              </div>
            </div>
            <div className="col-md-12 mt-3">
              <button
                className="btn btn-outline-primary"
                onClick={handleAddAddress}
                disabled={!currentUser}
              >
                Guardar dirección
              </button>
            </div>
          </div>

          

          <hr className="my-4" />

          <h5>Información de Pago</h5>
          {cards.length > 0 && (
            <div className="mb-4">
              <h6 className="mb-3">Tarjetas guardadas</h6>
              {cards.map((c) => (
                <div key={c.id} className="form-check mb-2">
                  <input
                    className="form-check-input"
                    type="radio"
                    name="card"
                    id={`card-${c.id}`}
                  />
                  <label className="form-check-label" htmlFor={`card-${c.id}`}>
                    <i className="bi bi-credit-card me-2"></i>
                    Tarjeta terminada en {c.last4} (exp {c.expiry})
                  </label>
                </div>
              ))}
              <div className="border-bottom my-3"></div>
            </div>
          )}

          <h6 className="mb-3">Nueva tarjeta</h6>
          <div className="row g-3">
            <div className="col-md-6">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="cardNameInput"
                  placeholder=" "
                  value={cardName}
                  onChange={(e) => setCardName(e.target.value)}
                  required
                />
                <label htmlFor="cardNameInput">Nombre en la tarjeta *</label>
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="cardNumberInput"
                  placeholder=" "
                  value={cardNumber}
                  onChange={(e) => setCardNumber(e.target.value)}
                  pattern="[0-9]{16}"
                  maxLength={16}
                  required
                />
                <label htmlFor="cardNumberInput">Número de tarjeta *</label>
              </div>
              <div className="form-text">16 dígitos sin espacios</div>
            </div>
            <div className="col-md-6">
              <div className="form-floating">
                <input
                  type="text"
                  className="form-control"
                  id="cardExpiryInput"
                  placeholder=" "
                  value={cardExpiry}
                  onChange={(e) => setCardExpiry(e.target.value)}
                  pattern="(0[1-9]|1[0-2])\/([0-9]{2})"
                  maxLength={5}
                  required
                />
                <label htmlFor="cardExpiryInput">Fecha de expiración (MM/AA) *</label>
              </div>
            </div>
            <div className="col-md-6 d-flex align-items-center justify-content-end">
              <button
                className="btn btn-outline-primary w-100"
                onClick={handleSaveCard}
                disabled={!currentUser}
              >
                <i className="bi bi-save me-2"></i>
                Guardar tarjeta
              </button>
            </div>
          </div>
          
        </div>
        

        <div className="col-md-5">
          <div className="card border-0 bg-light">
            <div className="card-body">
              <h5 className="card-title mb-4">Resumen ({cart.length} {cart.length === 1 ? 'producto' : 'productos'})</h5>
              
              <div className="border-bottom pb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Envío</span>
                  <span className="text-success">Gratis</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>IVA incluido</span>
                  <span>${(subtotal * 0.19).toFixed(2)}</span>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center py-3">
                <span className="h5 mb-0">TOTAL</span>
                <span className="h5 mb-0">${subtotal.toFixed(2)}</span>
              </div>

              <div className="mt-4">
                <button
                  className={`btn w-100 ${
                    paymentStatus === 'failure'
                      ? 'btn-warning'
                      : paymentStatus === 'success'
                      ? 'btn-secondary'
                      : 'btn-primary'
                  } btn-lg mb-3`}
                  onClick={handlePay}
                  disabled={paymentStatus === 'processing' || paymentStatus === 'success'}
                >
                  {paymentStatus === 'processing'
                    ? <><i className="bi bi-hourglass-split me-2"></i>Procesando...</>
                    : paymentStatus === 'failure'
                    ? <><i className="bi bi-arrow-repeat me-2"></i>Volver a realizar el pago</>
                    : paymentStatus === 'success'
                    ? <><i className="bi bi-check-circle me-2"></i>Pago realizado</>
                    : 'Iniciar pago'}
                </button>
                
                <div className="d-grid gap-2">
                  <button
                    className="btn btn-outline-secondary"
                    onClick={() => navigate(-1)}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Volver al carrito
                  </button>
                </div>
              </div>

              
            </div>
          </div>
        </div>
        <div className="w-100 mt-4">
          <h5>Productos en tu carrito</h5>
          <div className="table-responsive">
            <table className="table  table-border w-100 mb-0">
              <thead>
                <tr>
                  <th style={{ width: 160 }}>Imagen</th>
                  <th>Producto</th>
                  <th>Cantidad</th>
                  <th>Precio unitario</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {cart.length === 0 ? (
                  <tr>
                    <td colSpan={5}>No hay productos en el carrito.</td>
                  </tr>
                ) : (
                  cart.map((it) => (
                    <tr key={it.id}>
                      <td className="align-middle">
                        <img
                          src={it.img}
                          alt={it.nombre}
                          style={{ width: 140, height: 140, objectFit: "contain" }}
                          className="img-thumbnail d-block mx-auto"
                        />
                      </td>
                      <td>{it.nombre}</td>
                      <td>{it.cantidad}</td>
                      <td>${it.precio.toFixed(2)}</td>
                      <td>${(it.precio * it.cantidad).toFixed(2)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
