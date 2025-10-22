// Archivo: Project/src/components/Header.tsx
import { Link, useNavigate } from 'react-router-dom'; // 2. Importar 'useNavigate'
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
// NOTA: Más adelante, reemplazaremos 'useState' por un "Contexto" de autenticación 
// para que toda la app sepa quién está logueado. Por ahora, esto es para simular la lógica.
type User = {
  nombre: string;
}

function Header() {
  
  const { getItemCount } = useCart();
  const totalItems = getItemCount();

  // 4. Obtener el usuario y la función logout del AuthContext
  const { currentUser, logout } = useAuth();
  
  // 5. Usar 'useNavigate' para redirigir al usuario
  const navigate = useNavigate();

  // 6. Esta función ahora usa el contexto y redirige
  const handleCerrarSesion = () => {
    logout();
    navigate('/'); // Redirige al Home después de cerrar sesión
  };

  return (
    <header className="p-0 text-bg-dark">
      <div className="container-fluid">
        <div className="d-flex flex-wrap align-items-center  justify-content-center justify-content-lg-start py-2">
          <div>
            <h2 className="me-3">
              <img src="/Img/logo-Photoroom.png" alt="logo" className="logo" />
            </h2>
          </div>
          <ul
            className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            <li><a href="/" className="nav-link px-2 text-secondary">Home</a></li>
            <li><a href="/productos" className="nav-link px-2 text-white">Productos</a></li>
            <li><a href="/nosotros" className="nav-link px-2 text-white">Nosotros</a></li>
            <li><a href="/blog" className="nav-link px-2 text-white">Blog</a></li>
            <li><a href="/nosotros#seccion-contacto-directo" className="nav-link px-2 text-white">Contacto</a></li>
          </ul>

          <div className="d-flex align-items-center">
            {!currentUser ? (
            // Vista Invitado
            <div id="vista-invitado">
              {/* ... (enlaces de carrito, login, signup) ... */}
              <Link to="/carrito" className="btn btn-outline-light me-2 position-relative">
                <i className="bi bi-cart4"></i>
                {totalItems > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {totalItems}
                  </span>
                )}
              </Link>
                <a href="/login" className="btn btn-outline-light me-2">
                  Login
                </a>
                <a href="/registro" className="btn btn-warning">
                  Sign-up
                </a>
              </div>
            ) : (
              // Vista Usuario
              <div id="vista-usuario">
                <span className="text-white me-3" id="mensaje-bienvenida">
                  Bienvenido, {currentUser.nombre}
                </span>
                <Link to="/carrito" className="btn btn-outline-light me-2 position-relative">
                <i className="bi bi-cart4"></i>
                {totalItems > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {totalItems}
                    <span className="visually-hidden">items in cart</span>
                  </span>
                )}
              </Link>
                {/* El evento "onclick" de HTML se vuelve "onClick" en React
                  y llama directamente a nuestra función.
                */}
                <button type="button" className="btn btn-warning" onClick={handleCerrarSesion}>
                Cerrar Sesión
              </button>
              </div>
            )}
            
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;