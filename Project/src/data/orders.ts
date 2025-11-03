// Archivo: Project/src/data/orders.ts

// 1. Definimos los tipos para las órdenes
export type OrderDetail = {
  producto: string;
  cantidad: number;
  precioUnitario: number;
};

// (Opcional: podrías añadir campos de envío si los necesitas después)
// export type ShippingInfo = {
//   direccion: string;
//   comuna: string;
//   region: string;
// };

export type Order = {
  id: number;
  usuario: string;
  fecha: string; // formato YYYY-MM-DD
  total: number;
  detalles: OrderDetail[];
  // envio?: ShippingInfo; 
};

// 2. Exportamos el array de órdenes de administrador.js
export const ordersArray: Order[] = [
  {
    id: 1,
    usuario: "Ricardo",
    fecha: "2025-09-09", // Asegúrate de que este formato sea consistente si añades más
    total: 89.98,
    detalles: [
      {
        producto: "Teclado Gamer Redragon",
        cantidad: 1,
        precioUnitario: 49.99,
      },
      { producto: "Mouse Gamer Logitech", cantidad: 1, precioUnitario: 39.99 },
    ],
    // (Ejemplo si tuvieras datos de envío)
    // envio: {
    //   direccion: "Calle Falsa 123",
    //   comuna: "Providencia",
    //   region: "Región Metropolitana de Santiago"
    // }
  },
  // ... (Puedes añadir más órdenes de ejemplo aquí si quieres)
];