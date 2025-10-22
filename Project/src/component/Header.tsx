// Archivo: Project/src/components/Header.tsx

import { useState } from 'react';

// NOTA: Más adelante, reemplazaremos 'useState' por un "Contexto" de autenticación 
// para que toda la app sepa quién está logueado. Por ahora, esto es para simular la lógica.
type User = {
  nombre: string;
}

function Header() {
  // Estado temporal para simular un usuario logueado
  // Cambia esto a null para ver la vista de "invitado"
  const [usuarioLogueado, setUsuarioLogueado] = useState<User | null>({ nombre: "Ricardo" });

  const cerrarSesion = () => {
    // En el futuro, esto limpiará el localStorage y el Contexto
    setUsuarioLogueado(null);
    console.log("Sesión cerrada");
  };

  return (
    <header className="p-0 text-bg-dark">
      <div className="container-fluid">
        <div className="d-flex flex-wrap align-items-center  justify-content-center justify-content-lg-start py-2">
          <div>
            <h2 className="me-3">
              {/* Las imágenes en /public se acceden desde la raíz.
                La etiqueta <img> debe cerrarse con "/>" 
              */}
              <img src="/Img/logo-Photoroom.png" alt="logo" className="logo" />
            </h2>
          </div>
          <ul
            className="nav col-12 col-lg-auto me-lg-auto mb-2 justify-content-center mb-md-0">
            {/* Los links HTML <a href="..."> serán reemplazados por 
              componentes <Link to="..."> de react-router-dom en el siguiente paso.
              Por ahora, los dejamos como <a> pero apuntando a las rutas raíz.
            */}
            <li><a href="/" className="nav-link px-2 text-secondary">Home</a></li>
            <li><a href="/productos" className="nav-link px-2 text-white">Productos</a></li>
            <li><a href="/nosotros" className="nav-link px-2 text-white">Nosotros</a></li>
            <li><a href="/blog" className="nav-link px-2 text-white">Blog</a></li>
            <li><a href="/nosotros#seccion-contacto-directo" className="nav-link px-2 text-white">Contacto</a></li>
          </ul>

          <div className="d-flex align-items-center">

            {/* Aquí reemplazamos la lógica de mostrar/ocultar de tu JS
              con una renderización condicional de React.
            */}
            {!usuarioLogueado ? (
              // Vista Invitado
              <div id="vista-invitado">
                <a href="/carrito" className="btn btn-outline-light me-2">
                  <i className="bi bi-cart4"></i>
                </a>
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
                  Bienvenido, {usuarioLogueado.nombre}
                </span>
                <a href="/carrito" className="btn btn-outline-light me-2">
                  <i className="bi bi-cart4"></i>
                </a>
                {/* El evento "onclick" de HTML se vuelve "onClick" en React
                  y llama directamente a nuestra función.
                */}
                <button type="button" className="btn btn-warning" onClick={cerrarSesion}>
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