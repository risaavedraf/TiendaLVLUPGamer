import { useEffect, useState } from "react";
import { regionesYComunas } from "../data/locations";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import * as orderApi from "../api/orderApi";
import type { DireccionRequest } from "../api/orderApi";
import type { Address } from "../data/checkout";
import { loadSavedAddresses, saveAddresses } from "../data/checkout";

// Helper para formatear precios en CLP
const formatCLP = (precio: number) => {
  return new Intl.NumberFormat('es-CL', {
    style: 'currency',
    currency: 'CLP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(precio);
};

function CheckoutPage() {
  const { getCartDetails, clearCart } = useCart();
  const cart = getCartDetails();
  const subtotal = cart.reduce((s, it) => s + it.precio * it.cantidad, 0);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const userKey = currentUser ? `user_${currentUser.id}` : "guest";

  const [addresses, setAddresses] = useState<Address[]>(() => loadSavedAddresses(userKey));
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

  // Cargar direcciones del backend si el usuario está logueado
  useEffect(() => {
    if (currentUser) {
      orderApi.getMisDirecciones()
        .then(apiAddresses => {
          // Mapear direcciones del backend al formato Address local si es necesario
          // Asumimos que la respuesta del backend es compatible o la adaptamos
          const mappedAddresses: Address[] = apiAddresses.map(addr => ({
            id: String(addr.id),
            nombre: currentUser.nombre || "", // El backend no devuelve nombre/apellido en la dirección, usamos el del usuario
            apellido: currentUser.apellido || "",
            correo: currentUser.email || "",
            calle: addr.calle,
            depto: addr.numero, // Mapeamos numero a depto o viceversa según convención
            region: addr.region,
            comuna: addr.comuna,
            instrucciones: addr.indicaciones
          }));
          setAddresses(mappedAddresses);
          if (mappedAddresses.length > 0 && !selectedAddressId) {
            setSelectedAddressId(mappedAddresses[0].id);
          }
        })
        .catch(err => console.error("Error al cargar direcciones:", err));
    } else {
      // Si es guest, cargar de localStorage (aunque el usuario dijo que no se usa card, direcciones guest podrían ser útiles)
      setAddresses(loadSavedAddresses(userKey));
    }
  }, [currentUser, userKey]);

  const handleAddAddress = async () => {
    // Primero validamos que todos los campos requeridos estén completos
    if (!newAddr.calle || !newAddr.region || !newAddr.comuna) {
      alert("Por favor completa todos los campos obligatorios de la dirección");
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
        sessionStorage.setItem('pendingAddress', JSON.stringify(newAddr));
        navigate("/login");
      }
      return;
    }

    try {
      // Guardar en el backend
      const nuevaDireccionReq: DireccionRequest = {
        calle: newAddr.calle,
        numero: newAddr.depto || "S/N",
        comuna: newAddr.comuna,
        ciudad: newAddr.comuna,
        region: newAddr.region,
        indicaciones: newAddr.instrucciones,
      };

      const savedAddress = await orderApi.createDireccion(nuevaDireccionReq);

      const newAddressLocal: Address = {
        id: String(savedAddress.id),
        nombre: currentUser.nombre || "",
        apellido: currentUser.apellido || "",
        correo: currentUser.email || "",
        calle: savedAddress.calle,
        depto: savedAddress.numero,
        region: savedAddress.region,
        comuna: savedAddress.comuna,
        instrucciones: savedAddress.indicaciones
      };

      const next = [newAddressLocal, ...addresses];
      setAddresses(next);
      setSelectedAddressId(newAddressLocal.id);

      // Mostramos mensaje de éxito
      alert("¡Dirección guardada exitosamente!");

      // Limpiamos el formulario
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
    } catch (error) {
      console.error("Error al guardar dirección:", error);
      alert("Error al guardar la dirección. Inténtalo nuevamente.");
    }
  };

  const [paymentStatus, setPaymentStatus] = useState<"idle" | "processing" | "success" | "failure">("idle");
  const [orderNumber, setOrderNumber] = useState<string | null>(null);

  const handlePay = async () => {
    // 1. Validar autenticación (Requisito del backend)
    if (!currentUser) {
      alert("Debes iniciar sesión para realizar un pedido.");
      navigate("/login");
      return;
    }

    // 2. Validar selección de dirección
    const hasSelectedAddress = selectedAddressId && addresses.find(a => a.id === selectedAddressId);
    const hasNewAddress = newAddr.nombre && newAddr.apellido && newAddr.correo &&
      newAddr.calle && newAddr.region && newAddr.comuna;

    if (!hasSelectedAddress && !hasNewAddress) {
      alert("Debes seleccionar una dirección guardada o completar todos los campos de la nueva dirección");
      return;
    }

    try {
      setPaymentStatus("processing");

      let finalAddressId: number;

      // 4. Obtener ID de dirección
      if (hasSelectedAddress) {
        // Usar dirección existente
        finalAddressId = Number(selectedAddressId);
      } else {
        // Crear nueva dirección primero
        const nuevaDireccionReq: DireccionRequest = {
          calle: newAddr.calle || "",
          numero: newAddr.depto || "S/N",
          comuna: newAddr.comuna || "",
          ciudad: newAddr.comuna || "", // Asumimos ciudad = comuna por simplicidad
          region: newAddr.region || "",
          indicaciones: newAddr.instrucciones,
        };

        const savedAddress = await orderApi.createDireccion(nuevaDireccionReq);
        finalAddressId = savedAddress.id;

        // Actualizar lista local
        const newAddressList = [savedAddress, ...addresses];
        // @ts-ignore
        updateAddresses(newAddressList);
        setSelectedAddressId(String(savedAddress.id));
      }

      // 5. Realizar Checkout con el ID de la dirección
      const payload = {
        items: cart.map(item => ({
          productId: item.productId,
          quantity: item.cantidad,
        })),
        direccionId: finalAddressId,
      };

      const pedido = await orderApi.createPedido(payload);

      setOrderNumber(String(pedido.id));
      setPaymentStatus("success");
      clearCart();

      alert(`¡Pedido realizado con éxito! Número de pedido: ${pedido.numeroPedido}`);
    } catch (error: any) {
      console.error('Error al procesar pago:', error);
      setPaymentStatus("failure");
      const msg = error.response?.data?.mensaje || error.response?.data?.message || 'Error al procesar el pago';
      alert(`Error: ${msg}`);
    }
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
              Para guardar direcciones para futuras compras, necesitas{" "}
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

        </div>

        <div className="col-md-5">
          <div className="card border-0 bg-light">
            <div className="card-body">
              <h5 className="card-title mb-4">Resumen ({cart.length} {cart.length === 1 ? 'producto' : 'productos'})</h5>

              <div className="border-bottom pb-3">
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal</span>
                  <span>{formatCLP(subtotal)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Envío</span>
                  <span className="text-success">Gratis</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>IVA incluido</span>
                  <span>{formatCLP(subtotal * 0.19)}</span>
                </div>
              </div>

              <div className="d-flex justify-content-between align-items-center py-3">
                <span className="h5 mb-0">TOTAL</span>
                <span className="h5 mb-0">{formatCLP(subtotal)}</span>
              </div>

              <div className="mt-4">
                <button
                  className={`btn w-100 ${paymentStatus === 'failure'
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
                      <td>{formatCLP(it.precio)}</td>
                      <td>{formatCLP(it.precio * it.cantidad)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div >
  );
}

export default CheckoutPage;
