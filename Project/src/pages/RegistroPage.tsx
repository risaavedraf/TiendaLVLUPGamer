// Archivo: Project/src/pages/RegistroPage.tsx

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
// Dirección de envío eliminada: ya no necesitamos locaciones aquí

function RegistroPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  // --- Estados para el Formulario ---
  // (Un estado por cada campo)
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");

  // Dirección de envío eliminada — solo guardamos datos básicos
  const [termsCheck, setTermsCheck] = useState(false);

  const [error, setError] = useState<string | null>(null);

  // --- Lógica de Desplegables (useEffect) ---

  // No hay efectos relacionados a ubicación ahora

  // --- Lógica de Envío ---
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    // Validaciones de registro.js
    if (!termsCheck) {
      setError("Debe aceptar los términos y condiciones.");
      return;
    }

    // (Añadimos validación de campos vacíos)
    if (!firstName || !lastName || !username || !email || !password) {
      setError("Por favor, complete todos los campos obligatorios.");
      return;
    }

    try {
      // Llamamos a la función register del contexto
      await register({
        nombre: firstName,
        apellido: lastName,
        username: username,
        correo: email,
        contrasena: password,
        fechaNacimiento: fechaNacimiento || undefined,
        // (La dirección y teléfono se guardarían en un perfil de usuario más complejo)
      });

      alert("Usuario registrado correctamente");
      navigate("/login"); // Redirigir al login
    } catch (err: any) {
      setError(err.message || "Error al registrar.");
    }
  };

  return (
    <section id="register-section">
      <div className="container-fluid my-5">
        <div className="row d-flex justify-content-center">
          <div className="col-12 col-md-10 col-lg-10">
            <div className="card bg-white text-dark rounded-3 border shadow-lg">
              <div className="card-body p-5">
                <div className="text-center">
                  <h2 className="fw-bold mb-2 text-uppercase">
                    Registro de Usuario
                  </h2>
                  <p className="text-secondary mb-5">
                    Completa el formulario para crear una cuenta
                  </p>
                </div>

                {/* --- Formulario Vinculado a React --- */}
                <form onSubmit={handleSubmit}>
                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  <div className="row g-3">
                    {/* Columna Izquierda: Información de Usuario */}
                    <div className="col-12 col-md-8 col-lg-6 mx-auto">
                      <h4 className="fw-bold mt-2 mb-4">
                        Información de Usuario
                      </h4>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="firstName" className="form-label">
                            Nombre
                          </label>
                          <input
                            type="text"
                            id="firstName"
                            className="form-control"
                            required
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="lastName" className="form-label">
                            Apellido
                          </label>
                          <input
                            type="text"
                            id="lastName"
                            className="form-control"
                            required
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                          />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="username" className="form-label">
                          Nombre de usuario
                        </label>
                        <input
                          type="text"
                          id="username"
                          className="form-control"
                          required
                          value={username}
                          onChange={(e) => setUsername(e.target.value)}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="fechaNacimiento" className="form-label">
                          Fecha de Nacimiento
                        </label>
                        <input
                          type="date"
                          id="fechaNacimiento"
                          className="form-control"
                          value={fechaNacimiento}
                          onChange={(e) => setFechaNacimiento(e.target.value)}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">
                          Correo Electrónico
                        </label>
                        <input
                          type="email"
                          id="email"
                          className="form-control"
                          required
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="password" className="form-label">
                          Contraseña
                        </label>
                        <input
                          type="password"
                          id="password"
                          className="form-control"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                        />
                      </div>
                    </div>

                    {/* Dirección de envío eliminada: formulario simplificado */}
                  </div>

                  <div className="form-check d-flex justify-content-center mt-4">
                    <input
                      className="form-check-input me-2"
                      type="checkbox"
                      id="termsCheck"
                      required
                      checked={termsCheck}
                      onChange={(e) => setTermsCheck(e.target.checked)}
                    />
                    <label className="form-check-label" htmlFor="termsCheck">
                      Acepto los{" "}
                      <a href="#" className="fw-bold text-decoration-none">
                        términos y condiciones
                      </a>{" "}
                      de la página
                    </label>
                  </div>
                  <div className="d-grid mt-4">
                    <button type="submit" className="btn btn-primary btn-lg">
                      Registrar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RegistroPage;
