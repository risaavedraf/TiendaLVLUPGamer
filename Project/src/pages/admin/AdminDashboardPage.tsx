// Archivo: Project/src/pages/admin/AdminDashboardPage.tsx

import { useMemo } from 'react'; // Hook para optimizar cálculos
import { usersArray } from '../../data/users'; // Importar usuarios
import { productosArray } from '../../data/products'; // Importar productos
import { ordersArray } from '../../data/orders'; // Importar órdenes

function AdminDashboardPage() {

  // Usamos useMemo para calcular las métricas solo cuando los datos cambien
  // (Aunque en este caso, los datos son estáticos por ahora)
  const metrics = useMemo(() => {
    // Lógica de updateDashboard de administrador.js
    
    // Total Usuarios (Considera también los de localStorage si es necesario)
    // Por ahora, solo los de usersArray para simplificar
    const totalUsers = usersArray.length; 
    
    // Total Productos
    const totalProducts = productosArray.length;
    
    // Stock Total
    const totalStock = productosArray.reduce(
      // Añadimos '|| 0' por si 'stock' no está definido en algún producto
      (sum, p) => sum + (Number(p.stock) || 0), 
      0
    );
    
    // Valor Inventario
    const totalValue = productosArray.reduce(
      (sum, p) => sum + (Number(p.precio) || 0) * (Number(p.stock) || 0),
      0
    );
    
    // Total Órdenes
    const totalOrders = ordersArray.length;

    return {
      totalUsers,
      totalProducts,
      totalStock,
      totalValue,
      totalOrders,
    };
  }, []); // El array vacío [] significa que solo se calcula una vez al montar

  // --- Renderizado del componente (JSX de Administrador.html) ---
  return (
    <div id="dashboard" className="section"> {/* Mantenemos la estructura por si el CSS la usa */}
      <h2>📊 Panel de métricas</h2>
      <div className="cards"> {/* Clase del CSS del admin */}
        <div className="card">
          <h3>Total Usuarios</h3>
          {/* Mostramos los datos calculados */}
          <p id="total-users">{metrics.totalUsers}</p> 
        </div>
        <div className="card">
          <h3>Total Productos</h3>
          <p id="total-products">{metrics.totalProducts}</p>
        </div>
        <div className="card">
          <h3>Stock Total</h3>
          <p id="total-stock">{metrics.totalStock}</p>
        </div>
        <div className="card">
          <h3>Valor Inventario</h3>
          {/* Usamos toLocaleString para formatear el número como moneda */}
          <p id="total-value">${metrics.totalValue.toLocaleString('es-CL')}</p> 
        </div>
        <div className="card">
          <h3>Cantidad de Pedidos</h3>
          <p id="total-orders">{metrics.totalOrders}</p>
        </div>
      </div>
    </div>
  );
}

export default AdminDashboardPage;