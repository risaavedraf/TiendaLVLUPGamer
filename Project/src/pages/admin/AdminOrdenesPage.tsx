// Archivo: Project/src/pages/admin/AdminOrdenesPage.tsx

import { useState } from 'react';
import { ordersArray as initialOrders } from '../../data/orders';
import type { Order } from '../../data/orders'; // Datos iniciales y tipo

function AdminOrdenesPage() {
  // 1. Estado para la lista de órdenes
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  
  // 2. Estado para modo eliminar
  const [deleteMode, setDeleteMode] = useState(false);

  // --- Funciones de Gestión ---

  const toggleDeleteMode = () => {
    setDeleteMode(!deleteMode);
  };

  const deleteOrder = (id: number) => {
    if (window.confirm(`¿Estás seguro de eliminar la orden con ID ${id}?`)) {
      setOrders(currentOrders => currentOrders.filter(order => order.id !== id));
      // Llamada a API aquí en un caso real
    }
  };

  // --- Renderizado ---
  return (
    <div id="orders" className="section"> {/* ID por si el CSS lo usa */}
      <h2>📦 Gestión de Órdenes</h2>
      <div className="table-container">
        
        {/* Acciones - Solo botón Eliminar por ahora */}
        <div className="actions mb-3">
          {/* <button className="add-btn me-2" disabled> ➕ Añadir Orden (No implementado) </button> */}
          <button 
            className={`delete-btn ${deleteMode ? 'btn-danger' : ''}`}
            onClick={toggleDeleteMode}
          >
            🗑️ {deleteMode ? 'Cancelar Eliminación' : 'Activar Eliminación'}
          </button>
        </div>

        {/* Tabla de Órdenes */}
        <table id="orders-table" className="table table-striped table-hover">
          <thead>
            <tr>
              <th>ID</th>
              <th>Usuario</th>
              <th>Fecha</th>
              <th>Total</th>
              {/* <th>Envío</th> */} {/* Columna de envío omitida por ahora */}
              <th>Detalles</th>
              {deleteMode && <th>Acción</th>}
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.usuario}</td>
                <td>{order.fecha}</td>
                {/* Formateamos el total */}
                <td>${order.total.toLocaleString('es-CL')}</td> 
                {/* <td>{order.envio ? `${order.envio.comuna}, ${order.envio.region}` : 'N/A'}</td> */}
                
                {/* Formateamos los detalles (similar a renderOrders) */}
                <td>
                  {order.detalles.map((d, index) => (
                    <div key={index}>
                      {d.producto} (x{d.cantidad})
                    </div>
                  ))}
                </td>
                
                {deleteMode && (
                  <td>
                    <button 
                      className="btn btn-danger btn-sm delete-x"
                      onClick={() => deleteOrder(order.id)}
                      title={`Eliminar orden ${order.id}`}
                    >
                      ❌
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p>No hay órdenes para mostrar.</p>}
      </div>
    </div>
  );
}

export default AdminOrdenesPage;