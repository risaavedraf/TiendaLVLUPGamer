import { useEffect, useState } from "react";
import { regionesYComunas } from "../data/locations";
import { useCart } from "../contexts/CartContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import type { Order, OrderDetail } from "../data/orders";

type Address = {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  calle: string;
  depto?: string;
  region: string;
  comuna: string;
  instrucciones?: string;
};

type Card = {
  id: string;
  cardholder: string;
  last4: string;
  expiry: string;
};

function CheckoutPage() {
  const { getCartDetails, clearCart } = useCart();
  const cart = getCartDetails();
  const subtotal = cart.reduce((s, it) => s + it.precio * it.cantidad, 0);
  const navigate = useNavigate();
  const { currentUser } = useAuth();

  const userKey = currentUser ? `user_${currentUser.id}` : "guest";

  const [addresses, setAddresses] = useState<Address[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(`direcciones_${userKey}`) || "[]");
    } catch {
      return [];
    }
  });

  const [cards, setCards] = useState<Card[]>(() => {
    try {
      return JSON.parse(localStorage.getItem(`tarjetas_${userKey}`) || "[]");
    } catch {
      return [];
    }
  });

  // Note: legacy global migration removed to avoid copying other users' data.
  // If you need to migrate old guest data, do so with an explicit admin action.

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(
    addresses[0]?.id ?? null
  );

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

  function saveAddresses(list: Address[]) {
    setAddresses(list);
    localStorage.setItem(`direcciones_${userKey}`, JSON.stringify(list));
  }

  function saveCards(list: Card[]) {
    setCards(list);
    localStorage.setItem(`tarjetas_${userKey}`, JSON.stringify(list));
  }

  const handleAddAddress = () => {
    if (!currentUser) {
      if (
        confirm(
          "Debes iniciar sesión para guardar una dirección. ¿Ir a iniciar sesión?"
        )
      ) {
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
    saveAddresses(next);
    setSelectedAddressId(a.id);
    // clear form except user defaults
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
    saveCards(next);
    setCardNumber("");
    setCardExpiry("");
  };

  const handlePay = () => {
    if (!selectedAddressId) {
      alert("Selecciona o crea una dirección de despacho");
      return;
    }
    if (cards.length === 0) {
      alert("Agrega una tarjeta para procesar el pago");
      return;
    }

    const addr = addresses.find((a) => a.id === selectedAddressId)!;

    // Construir detalles de la orden
    const detalles: OrderDetail[] = cart.map((it) => ({
      producto: it.nombre,
      cantidad: it.cantidad,
      precioUnitario: it.precio,
    }));

    // Cargar órdenes almacenadas
    let storedOrders: Order[] = [];
    try {
      storedOrders = JSON.parse(localStorage.getItem("ordenes") || "[]");
    } catch {
      storedOrders = [];
    }

    const maxId = storedOrders.reduce((m, o) => Math.max(m, o.id), 0);
    const newId = maxId + 1 || 1;

    const newOrder: Order = {
      id: newId,
      usuario: currentUser
        ? `${currentUser.nombre} ${currentUser.apellido}`
        : addr.nombre || addr.correo,
      fecha: new Date().toISOString().slice(0, 10),
      total: parseFloat(subtotal.toFixed(2)),
      detalles,
    };

    const updated = [newOrder, ...storedOrders];
    localStorage.setItem("ordenes", JSON.stringify(updated));

    alert(
      `Pago realizado. Orden ID ${newOrder.id} creada. Enviando a: ${
        addr.calle
      }, ${addr.comuna} — Total: $${subtotal.toFixed(2)}`
    );

    // Limpiar carrito
    clearCart();
    navigate("/");
  };

  return (
    <div className="container my-5">
      <h2>Información de despacho</h2>
      {!currentUser && (
        <div className="alert alert-warning">
          Para guardar direcciones y tarjetas debes iniciar sesión.{" "}
          <a href="/login">Iniciar sesión</a>
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
          <div className="row g-2">
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Nombre"
                value={newAddr.nombre || ""}
                onChange={(e) =>
                  setNewAddr((prev) => ({ ...prev, nombre: e.target.value }))
                }
              />
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Apellido"
                value={newAddr.apellido || ""}
                onChange={(e) =>
                  setNewAddr((prev) => ({ ...prev, apellido: e.target.value }))
                }
              />
            </div>
            <div className="col-md-12 mt-2">
              <input
                className="form-control"
                placeholder="Correo"
                value={newAddr.correo || ""}
                onChange={(e) =>
                  setNewAddr((prev) => ({ ...prev, correo: e.target.value }))
                }
              />
            </div>
            <div className="col-md-8 mt-2">
              <input
                className="form-control"
                placeholder="Calle"
                value={newAddr.calle || ""}
                onChange={(e) =>
                  setNewAddr((prev) => ({ ...prev, calle: e.target.value }))
                }
              />
            </div>
            <div className="col-md-4 mt-2">
              <input
                className="form-control"
                placeholder="Departamento (opcional)"
                value={newAddr.depto || ""}
                onChange={(e) =>
                  setNewAddr((prev) => ({ ...prev, depto: e.target.value }))
                }
              />
            </div>
            <div className="col-md-6 mt-2">
              <select
                className="form-select"
                value={newAddr.region || ""}
                onChange={(e) =>
                  setNewAddr((prev) => ({
                    ...prev,
                    region: e.target.value,
                    comuna: "",
                  }))
                }
              >
                <option value="">Seleccione Región</option>
                {regionesYComunas.map((r) => (
                  <option key={r.region} value={r.region}>
                    {r.region}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-6 mt-2">
              <select
                className="form-select"
                value={newAddr.comuna || ""}
                onChange={(e) =>
                  setNewAddr((prev) => ({ ...prev, comuna: e.target.value }))
                }
                disabled={!newAddr.region}
              >
                <option value="">Seleccione Comuna</option>
                {availableComunas.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
            <div className="col-md-12 mt-2">
              <textarea
                className="form-control"
                placeholder="Indicaciones para la entrega (opcional)"
                value={newAddr.instrucciones || ""}
                onChange={(e) =>
                  setNewAddr((prev) => ({
                    ...prev,
                    instrucciones: e.target.value,
                  }))
                }
              />
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

          <h5>Pago</h5>
          <div className="mb-2">
            {cards.map((c) => (
              <div key={c.id} className="form-check">
                <input
                  className="form-check-input"
                  type="radio"
                  name="card"
                  id={`card-${c.id}`}
                />
                <label className="form-check-label" htmlFor={`card-${c.id}`}>
                  Tarjeta terminada en {c.last4} (exp {c.expiry})
                </label>
              </div>
            ))}
          </div>

          <div className="row g-2">
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Nombre en la tarjeta"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
              />
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Número de tarjeta"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
              />
            </div>
            <div className="col-md-6 mt-2">
              <input
                className="form-control"
                placeholder="MM/AA"
                value={cardExpiry}
                onChange={(e) => setCardExpiry(e.target.value)}
              />
            </div>
            <div className="col-md-6 mt-2 d-flex align-items-center">
              <button
                className="btn btn-outline-secondary"
                onClick={handleSaveCard}
                disabled={!currentUser}
              >
                Guardar tarjeta
              </button>
            </div>
          </div>
        </div>

        <div className="col-md-5">
          <div className="card p-3">
            <h5>Resumen</h5>
            <p>Items: {cart.length}</p>
            <p>Subtotal: ${subtotal.toFixed(2)}</p>
            <div className="d-grid mt-3">
              <button className="btn btn-success" onClick={handlePay}>
                Pagar ahora ${subtotal.toFixed(2)}
              </button>
              <button
                className="btn btn-link mt-2"
                onClick={() => navigate(-1)}
              >
                Volver
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;
