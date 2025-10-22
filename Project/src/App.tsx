import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './component/Layout';
import HomePage from './pages/HomePage';
import ProductosPage from './pages/ProductosPage';
import NosotrosPage from './pages/NosotrosPage';
import BlogPage from './pages/BlogPage';
import LoginPage from './pages/LoginPage';
import RegistroPage from './pages/RegistroPage';
import CarritoPage from './pages/CarritoPage';
import DetalleProductoPage from './pages/DetalleProductoPage';
import ProtectedRoute from './component/ProtectedRoute'; // 1. Importar
import AdminLayout from './component/AdminLayout';
import AdminDashboardPage from './pages/admin/AdminDashboardPage';
import AdminUsuariosPage from './pages/admin/AdminUsuariosPage';
import AdminProductosPage from './pages/admin/AdminProductosPage';
import AdminOrdenesPage from './pages/admin/AdminOrdenesPage';
// (Aquí puedes importar más páginas a medida que las crees)
import './App.css';

//const AdminOrdenesPage = () => <div><h2>📦 Gestión Órdenes</h2><p>Tabla...</p></div>;
const AdminSettingsPage = () => <div><h2>⚙️ Configuración</h2><p>Ajustes...</p></div>;

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* 'index' (o index={true}) es la ruta por defecto para "/" */}
        <Route index element={<HomePage />} />
        
        {/* Rutas para el resto de nuestras páginas */}
        <Route path="productos/:productId" element={<DetalleProductoPage />}/>
        <Route path="productos" element={<ProductosPage />} />
        <Route path="nosotros" element={<NosotrosPage />} />
        <Route path="blog" element={<BlogPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="registro" element={<RegistroPage />} />
        <Route path="carrito" element={<CarritoPage />} />
        
        {/* Puedes añadir una ruta para "Not Found" (404) aquí más tarde */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Route>
      <Route 
        path="/admin" 
        element={
          // 4. Usamos ProtectedRoute. Solo permite Admins.
          <ProtectedRoute allowedRoles={['Admin']} /> 
        }
      >
        {/* 5. Todas las rutas dentro usan AdminLayout */}
        <Route element={<AdminLayout />}> 
          {/* Ruta por defecto para /admin -> dashboard */}
          <Route path="dashboard" element={<AdminDashboardPage />} /> 
          <Route path="usuarios" element={<AdminUsuariosPage />} />
          <Route path="productos" element={<AdminProductosPage />} />
          <Route path="ordenes" element={<AdminOrdenesPage />} />
          <Route path="settings" element={<AdminSettingsPage />} />
          
          {/* Redirección: si alguien va a /admin (sin nada más), lo mandamos a /admin/dashboard */}
          <Route index element={<Navigate to="/admin/dashboard" replace />} /> 
        </Route>
      </Route>

      {/* Ruta para Not Found (Opcional) */}
      {/* <Route path="*" element={<div><h1>404 Not Found</h1></div>} /> */}
    </Routes>
  );
}

export default App;