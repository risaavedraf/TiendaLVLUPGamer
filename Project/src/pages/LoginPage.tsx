// Archivo: Project/src/pages/LoginPage.tsx

import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext'; // 1. Importar nuestro hook de autenticación

function LoginPage() {
  // 2. Estados locales para los campos del formulario
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // 3. Estado para manejar errores de login
  const [error, setError] = useState<string | null>(null);
  
  // 4. Importar la función 'login' del contexto
  const { login } = useAuth();
  
  // 5. Hook para redirigir al usuario
  const navigate = useNavigate();

  // 6. Función para manejar el envío del formulario
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault(); // Prevenir recarga de página
    setError(null); // Limpiar errores previos

    try {
      // 7. Llamar a la función 'login' de nuestro contexto
      const user = await login(email, password);
      
      // 8. Redirigir según el rol (lógica de administrador.js)
      if (user.rol.toLowerCase() === 'admin') {
        // (Necesitaremos crear esta ruta /admin después)
        navigate('/admin'); 
      } else {
        navigate('/'); // Redirigir al Home
      }
      
    } catch (err: any) {
      // 9. Si el login falla (promesa rechazada), mostrar el error
      setError(err.message || "Error al iniciar sesión");
    }
  };

  return (
    <section id="login-section">
      <div className="container my-5">
        <div className="row d-flex justify-content-center">
            <div className="col-12 col-md-8 col-lg-6">
                <div className="card bg-white text-dark rounded-3 border shadow-lg">
                    <div className="card-body p-5">
                        <div className="text-center">
                            <h2 className="fw-bold mb-2 text-uppercase">
                                Inicio de Sesión
                            </h2>
                            <p className="text-secondary mb-5">
                                Por favor, ingrese su correo y contraseña
                            </p>
                        </div>
                        
                        {/* 10. Usamos 'onSubmit' en el <form> */}
                        <form onSubmit={handleSubmit}>
                            
                            {/* 11. Mostramos el error si existe */}
                            {error && (
                              <div className="alert alert-danger" role="alert">
                                {error}
                              </div>
                            )}

                            <div className="mb-3">
                                {/* 'for' se convierte en 'htmlFor' */}
                                <label htmlFor="typeEmailX" className="form-label">Correo Electrónico</label>
                                <input 
                                  type="email" 
                                  id="typeEmailX" 
                                  className="form-control" 
                                  required
                                  value={email} // Vinculado al estado
                                  onChange={(e) => setEmail(e.target.value)} // Actualiza el estado
                                />
                            </div>
                            <div className="mb-3">
                                <label htmlFor="typePasswordX" className="form-label">Contraseña</label>
                                <input 
                                  type="password" 
                                  id="typePasswordX" 
                                  className="form-control" 
                                  required
                                  value={password} // Vinculado al estado
                                  onChange={(e) => setPassword(e.target.value)} // Actualiza el estado
                                />
                            </div>
                            <div className="d-grid mt-4">
                                {/* 12. El botón ahora es tipo 'submit' */}
                                <button id="btnLogin" className="btn btn-primary btn-lg" type="submit">
                                    Iniciar Sesión
                                </button>
                            </div>
                        </form>
                        <div className="text-center mt-4">
                            <p className="mb-0">
                                ¿No tiene una cuenta?
                                {/* 13. Usamos <Link> de react-router-dom */}
                                <Link to="/registro" className="fw-bold text-decoration-none">
                                  Regístrate!
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
      </div>
    </section>
  );
}

export default LoginPage;