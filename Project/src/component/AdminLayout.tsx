// Archivo: Project/src/components/AdminLayout.tsx

import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "../style/admin.css"; // Importaremos los estilos del admin aquí

function AdminLayout() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Estado para el sidebar

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className={`admin-body ${isSidebarOpen ? "" : "sidebar-closed"}`}>
      {" "}
      {/* Clases para CSS */}
      {/* Sidebar */}
      <div className={`sidebar ${isSidebarOpen ? "open" : ""}`} id="sidebar">
        <button className="close-btn d-lg-none" onClick={toggleSidebar}>
          ×
        </button>{" "}
        {/* Botón cerrar en móvil */}
        <h2>Admin Panel</h2>
        {/* Usamos NavLink para que el link activo se resalte */}
        <NavLink
          to="/admin/dashboard"
          className="nav-link"
          onClick={!isSidebarOpen ? toggleSidebar : undefined}
        >
          📊 Dashboard
        </NavLink>
        <NavLink
          to="/admin/usuarios"
          className="nav-link"
          onClick={!isSidebarOpen ? toggleSidebar : undefined}
        >
          👥 Usuarios
        </NavLink>
        <NavLink
          to="/admin/productos"
          className="nav-link"
          onClick={!isSidebarOpen ? toggleSidebar : undefined}
        >
          📦 Productos
        </NavLink>
        <NavLink
          to="/admin/ordenes"
          className="nav-link"
          onClick={!isSidebarOpen ? toggleSidebar : undefined}
        >
          📦 Órdenes
        </NavLink>
        <NavLink
          to="/admin/settings"
          className="nav-link"
          onClick={!isSidebarOpen ? toggleSidebar : undefined}
        >
          ⚙️ Configuración
        </NavLink>
      </div>
      {/* Main Content */}
      <div className="main-admin">
        <div className="header-admin d-flex align-items-center justify-content-between">
          <div className="d-flex align-items-center gap-2">
            {/* Botón menú para móvil/tablet (tres líneas) */}
            <span className="menu-btn d-lg-none" onClick={toggleSidebar}>
              ☰
            </span>
            <h3 className="m-0">
              Bienvenido, {currentUser?.nombre || "Admin"}
            </h3>
          </div>

          <div className="d-flex align-items-center gap-2">
            {/* Volver al menú principal */}
            <button
              type="button"
              className="btn btn-outline-primary btn-sm"
              onClick={() => navigate("/")}
            >
              Volver al menú
            </button>

            <button
              className="logout btn btn-outline-danger btn-sm"
              onClick={handleLogout}
            >
              Cerrar sesión
            </button>
          </div>
        </div>

        <div className="content-admin">
          {/* Aquí se renderizarán las páginas de admin (Dashboard, Usuarios, etc.) */}
          <Outlet />
        </div>
      </div>
    </div>
  );
}

export default AdminLayout;
