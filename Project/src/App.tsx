import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./component/Layout";
import HomePage from "./pages/HomePage";
import ProductosPage from "./pages/ProductosPage";
import NosotrosPage from "./pages/NosotrosPage";
import BlogPage from "./pages/BlogPage";
import LoginPage from "./pages/LoginPage";
import RegistroPage from "./pages/RegistroPage";
import CarritoPage from "./pages/CarritoPage";
import CheckoutPage from "./pages/CheckoutPage";
import DetalleProductoPage from "./pages/DetalleProductoPage";
import ProtectedRoute from "./component/ProtectedRoute";
import AdminLayout from "./component/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import AdminUsuariosPage from "./pages/admin/AdminUsuariosPage";
import AdminProductosPage from "./pages/admin/AdminProductosPage";
import AdminOrdenesPage from "./pages/admin/AdminOrdenesPage";
import "./App.css";

const AdminSettingsPage = () => (
  <div>
    <h2>⚙️ Configuración</h2>
    <p>Ajustes...</p>
  </div>
);

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<HomePage />} />

        {/* CAMBIO: producto/:id en lugar de productos/:productId */}
        <Route path="producto/:productId" element={<DetalleProductoPage />} />
        <Route path="productos" element={<ProductosPage />} />
        <Route path="nosotros" element={<NosotrosPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="registro" element={<RegistroPage />} />
        <Route path="carrito" element={<CarritoPage />} />
        <Route path="checkout" element={<CheckoutPage />} />
      </Route>

      <Route
        path="/admin"
        element={<ProtectedRoute allowedRoles={["ROLE_ADMIN"]} />}
      >
        <Route element={<AdminLayout />}>
          <Route path="dashboard" element={<AdminDashboardPage />} />
          <Route path="usuarios" element={<AdminUsuariosPage />} />
          <Route path="productos" element={<AdminProductosPage />} />
          <Route path="ordenes" element={<AdminOrdenesPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          <Route index element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
