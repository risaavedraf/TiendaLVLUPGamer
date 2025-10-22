// Archivo: Project/src/pages/RegistroPage.tsx

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { regionesYComunas } from '../data/locations';
import type { Comuna } from '../data/locations'; // 1. Importar data de locaciones

function RegistroPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  // --- Estados para el Formulario ---
  // (Un estado por cada campo)
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [confirmEmail, setConfirmEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [street, setStreet] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [zipCode, setZipCode] = useState('');
  
  // Estados para los desplegables
  const [selectedRegion, setSelectedRegion] = useState('');
  const [availableComunas, setAvailableComunas] = useState<Comuna[]>([]);
  const [selectedComuna, setSelectedComuna] = useState('');
  const [availableCiudades, setAvailableCiudades] = useState<string[]>([]);
  const [selectedCiudad, setSelectedCiudad] = useState('');
  
  const [areaCode, setAreaCode] = useState('+56');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [termsCheck, setTermsCheck] = useState(false);
  
  const [error, setError] = useState<string | null>(null);

  // --- Lógica de Desplegables (useEffect) ---

  // Efecto para actualizar Comunas cuando cambia la Región
  useEffect(() => {
    if (selectedRegion) {
      const regionData = regionesYComunas.find(r => r.region === selectedRegion);
      setAvailableComunas(regionData ? regionData.comunas : []);
      setSelectedComuna('');
      setAvailableCiudades([]);
      setSelectedCiudad('');
    } else {
      setAvailableComunas([]);
      setSelectedComuna('');
      setAvailableCiudades([]);
      setSelectedCiudad('');
    }
  }, [selectedRegion]); // Se ejecuta cada vez que 'selectedRegion' cambia

  // Efecto para actualizar Ciudades cuando cambia la Comuna
  useEffect(() => {
    if (selectedComuna) {
      const comunaData = availableComunas.find(c => c.nombre === selectedComuna);
      setAvailableCiudades(comunaData ? [comunaData.ciudad] : []);
      setSelectedCiudad(comunaData ? comunaData.ciudad : '');
    } else {
      setAvailableCiudades([]);
      setSelectedCiudad('');
    }
  }, [selectedComuna, availableComunas]); // Se ejecuta cuando 'selectedComuna' cambia

  // --- Lógica de Envío ---
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    // Validaciones de registro.js
    if (email !== confirmEmail) {
      setError("Los correos no coinciden.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (!termsCheck) {
      setError("Debe aceptar los términos y condiciones.");
      return;
    }
    
    // (Añadimos validación de campos vacíos)
    if (!firstName || !lastName || !email || !password || !street || !selectedRegion || !selectedComuna || !phoneNumber) {
      setError("Por favor, complete todos los campos obligatorios.");
      return;
    }

    try {
      // Llamamos a la función register del contexto
      await register({
        nombre: firstName,
        apellido: lastName,
        correo: email,
        contrasena: password
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
                  <h2 className="fw-bold mb-2 text-uppercase">Registro de Usuario</h2>
                  <p className="text-secondary mb-5">Completa el formulario para crear una cuenta</p>
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
                    <div className="col-lg-6">
                      <h4 className="fw-bold mt-2 mb-4">Información de Usuario</h4>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="firstName" className="form-label">Nombre</label>
                          <input type="text" id="firstName" className="form-control" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label htmlFor="lastName" className="form-label">Apellido</label>
                          <input type="text" id="lastName" className="form-control" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
                        </div>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="email" className="form-label">Correo Electrónico</label>
                        <input type="email" id="email" className="form-control" required value={email} onChange={(e) => setEmail(e.target.value)} />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="confirmEmail" className="form-label">Confirmar Correo</label>
                        <input type="email" id="confirmEmail" className="form-control" required value={confirmEmail} onChange={(e) => setConfirmEmail(e.target.value)} />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="password" className="form-label">Contraseña</label>
                        <input type="password" id="password" className="form-control" required value={password} onChange={(e) => setPassword(e.target.value)} />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirmar Contraseña</label>
                        <input type="password" id="confirmPassword" className="form-control" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                      </div>
                    </div>

                    {/* Columna Derecha: Dirección de Envío */}
                    <div className="col-lg-6">
                      <h4 className="fw-bold mt-2 mb-4">Dirección de Envío</h4>
                      <div className="mb-3">
                        <label htmlFor="street" className="form-label">Calle y N°</label>
                        <input type="text" id="street" className="form-control" required value={street} onChange={(e) => setStreet(e.target.value)} />
                      </div>
                      <div className="mb-3">
                        <label htmlFor="additionalInfo" className="form-label">Información adicional</label>
                        <input type="text" id="additionalInfo" className="form-control" value={additionalInfo} onChange={(e) => setAdditionalInfo(e.target.value)} />
                      </div>
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label htmlFor="zipCode" className="form-label">Código Postal</label>
                          <input type="text" id="zipCode" className="form-control" required value={zipCode} onChange={(e) => setZipCode(e.target.value)} />
                        </div>
                        <div className="mb-3">
                          <label htmlFor="region" className="form-label">Región</label>
                          <select className="form-select" id="regionSelect" value={selectedRegion} onChange={(e) => setSelectedRegion(e.target.value)} required>
                            <option value="">Seleccione una Región</option>
                            {regionesYComunas.map(r => (
                              <option key={r.region} value={r.region}>{r.region}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="comuna" className="form-label">Comuna</label>
                        <select className="form-select" id="comunaSelect" value={selectedComuna} onChange={(e) => setSelectedComuna(e.target.value)} required>
                          <option value="">Seleccione una Comuna</option>
                          {availableComunas.map(c => (
                            <option key={c.nombre} value={c.nombre}>{c.nombre}</option>
                          ))}
                        </select>
                      </div>
                      <div className="mb-3">
                        <label htmlFor="ciudad" className="form-label">Ciudad</label>
                        <select className="form-select" id="ciudadSelect" value={selectedCiudad} onChange={(e) => setSelectedCiudad(e.target.value)} required>
                          <option value="">Seleccione una Ciudad</option>
                          {availableCiudades.map(ciudad => (
                            <option key={ciudad} value={ciudad}>{ciudad}</option>
                          ))}
                        </select>
                      </div>
                      <div className="row">
                        <div className="col-md-4 mb-3">
                          <label htmlFor="areaCode" className="form-label">Código de Área</label>
                          <input type="text" id="areaCode" className="form-control" value={areaCode} onChange={(e) => setAreaCode(e.target.value)} required />
                        </div>
                        <div className="col-md-8 mb-3">
                          <label htmlFor="phoneNumber" className="form-label">Número de Teléfono</label>
                          <input type="tel" id="phoneNumber" className="form-control" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} required />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="form-check d-flex justify-content-center mt-4">
                    <input className="form-check-input me-2" type="checkbox" id="termsCheck" required checked={termsCheck} onChange={(e) => setTermsCheck(e.target.checked)} />
                    <label className="form-check-label" htmlFor="termsCheck">
                      Acepto los <a href="#" className="fw-bold text-decoration-none">términos y condiciones</a> de la página
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