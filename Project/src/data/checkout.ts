import type { Order, OrderDetail } from "./orders";

export type Address = {
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

export type Card = {
  id: string;
  cardholder: string;
  last4: string;
  expiry: string;
};

export type PaymentStatus = "idle" | "processing" | "success" | "failure";

// Función para cargar direcciones guardadas
export const loadSavedAddresses = (userKey: string): Address[] => {
  try {
    return JSON.parse(localStorage.getItem(`direcciones_${userKey}`) || "[]");
  } catch {
    return [];
  }
};

// Función para guardar direcciones
export const saveAddresses = (addresses: Address[], userKey: string) => {
  localStorage.setItem(`direcciones_${userKey}`, JSON.stringify(addresses));
};

// Función para cargar tarjetas guardadas
export const loadSavedCards = (userKey: string): Card[] => {
  try {
    return JSON.parse(localStorage.getItem(`tarjetas_${userKey}`) || "[]");
  } catch {
    return [];
  }
};

// Función para guardar tarjetas
export const saveCards = (cards: Card[], userKey: string) => {
  localStorage.setItem(`tarjetas_${userKey}`, JSON.stringify(cards));
};

// Función para procesar el pago
export const processPayment = async (
  cart: Array<{ nombre: string; cantidad: number; precio: number }>,
  currentUser: { id: string | number; nombre: string; apellido: string; email: string } | null,
  selectedAddress: Address
): Promise<{ success: boolean; orderId: number }> => {
  // Simular procesamiento de pago
  await new Promise(resolve => setTimeout(resolve, 900));
  const success = Math.random() < 0.85;

  // Cargar órdenes existentes
  let storedOrders: Order[] = [];
  try {
    storedOrders = JSON.parse(localStorage.getItem("ordenes") || "[]");
  } catch {
    storedOrders = [];
  }

  // Crear nueva orden
  const maxId = storedOrders.reduce((m, o) => Math.max(m, o.id), 0);
  const newId = maxId + 1 || 1;

  const detalles: OrderDetail[] = cart.map((it) => ({
    producto: it.nombre,
    cantidad: it.cantidad,
    precioUnitario: it.precio,
  }));

  const newOrder: Order = {
    id: newId,
    usuario: currentUser
      ? `${currentUser.nombre} ${currentUser.apellido}`
      : selectedAddress.nombre || selectedAddress.correo,
    fecha: new Date().toISOString().slice(0, 10),
    total: parseFloat(cart.reduce((s, it) => s + it.precio * it.cantidad, 0).toFixed(2)),
    detalles,
  };

  if (success) {
    const updated = [newOrder, ...storedOrders];
    localStorage.setItem("ordenes", JSON.stringify(updated));
  }

  return { success, orderId: newOrder.id };
};