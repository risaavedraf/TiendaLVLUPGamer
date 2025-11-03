// Archivo: Project/src/components/ProtectedRoute.tsx

import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

type ProtectedRouteProps = {
  allowedRoles: string[]; // Un array de roles permitidos
};

function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { currentUser } = useAuth();

  // 1. ¿Hay usuario logueado?
  if (!currentUser) {
    // No logueado -> redirige a /login
    // 'replace' evita que el usuario pueda volver atrás a la página protegida
    return <Navigate to="/login" replace />;
  }

  // 2. ¿El rol del usuario está permitido?
  if (!allowedRoles.includes(currentUser.rol)) {
    // Rol no permitido -> redirige al Home (o a una página de "Acceso Denegado")
    alert("Acceso denegado. No tienes permisos de administrador.");
    return <Navigate to="/" replace />;
  }

  // 3. Si todo está bien, renderiza el contenido de la ruta hija
  return <Outlet />;
}

export default ProtectedRoute;