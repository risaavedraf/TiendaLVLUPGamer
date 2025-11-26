// Archivo: Project/src/pages/RegistroPage.tsx

import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

function RegistroPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  // Campos básicos
  const [username, setUsername] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Cálculo fuerza contraseña
  const passwordScore = useMemo(() => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;
    return score; // 0..5
  }, [password]);
  const passwordStrengthLabel = ["Muy débil","Débil","Media","Buena","Fuerte","Excelente"][passwordScore];

  // --- Lógica de Envío ---
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    // Validaciones de registro.js
    if (password !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    if (!acceptTerms) {
      setError("Debe aceptar los términos y condiciones.");
      return;
    }
    
  if (!username || !firstName || !lastName || !email || !password) {
      setError("Complete los campos requeridos.");
      return;
    }

    try {
  const msg = await register({ username, nombre: firstName, apellido: lastName, correo: email, contrasena: password });
  setSuccess(true);
  // Opcional: log para depuración
  console.log(msg);
      // Mostrar mensaje de éxito breve antes de navegar
      setTimeout(() => navigate('/login'), 1200);
    } catch (err: any) {
      setError(err.message || 'Error al registrar.');
    }
  };


  return (
    <section id="register-section" className="registro-gradient py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-6">
            <div className="registro-card shadow-lg border-0 rounded-4 p-4 p-md-5">
              <div className="text-center mb-4">
                <h2 className="fw-bold mb-2 text-uppercase">Registro de Usuario</h2>
                <p className="text-muted">Crea tu cuenta rápidamente</p>
              </div>
              <form onSubmit={handleSubmit} className="registro-form">
                {error && <div className="alert alert-danger" role="alert">{error}</div>}
                {success && <div className="alert alert-success" role="alert">Usuario registrado correctamente</div>}
                <div className="row g-3">
                  <div className="col-md-6 mb-3 form-floating">
                    <input type="text" id="firstName" className="form-control" placeholder="Nombre" required value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                    <label htmlFor="firstName">Nombre</label>
                  </div>
                  <div className="col-md-6 mb-3 form-floating">
                    <input type="text" id="lastName" className="form-control" placeholder="Apellido" required value={lastName} onChange={(e) => setLastName(e.target.value)} />
                    <label htmlFor="lastName">Apellido</label>
                  </div>
                  <div className="col-12 mb-3 form-floating">
                    <input type="text" id="username" className="form-control" placeholder="Username" required value={username} onChange={(e) => setUsername(e.target.value)} />
                    <label htmlFor="username">Username</label>
                  </div>
                  <div className="col-12 mb-3 form-floating">
                    <input type="email" id="email" className="form-control" placeholder="Correo Electrónico" required value={email} onChange={(e) => setEmail(e.target.value)} />
                    <label htmlFor="email">Correo Electrónico</label>
                  </div>
                  <div className="col-md-6 mb-3 form-floating">
                    <input type="password" id="password" className="form-control" placeholder="Contraseña" required value={password} onChange={(e) => setPassword(e.target.value)} />
                    <label htmlFor="password">Contraseña</label>
                    <div className="mt-2 password-strength">
                      <div className="progress" style={{ height: '6px' }}>
                        <div className={"progress-bar bg-" + (passwordScore >= 4 ? 'success' : passwordScore >= 3 ? 'info' : passwordScore >= 2 ? 'warning' : 'danger')} role="progressbar" style={{ width: ((passwordScore / 5) * 100) + "%" }}></div>
                      </div>
                      <small className="text-muted">Fortaleza: {passwordStrengthLabel}</small>
                    </div>
                  </div>
                  <div className="col-md-6 mb-3 form-floating">
                    <input type="password" id="confirmPassword" className="form-control" placeholder="Confirmar Contraseña" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                    <label htmlFor="confirmPassword">Confirmar Contraseña</label>
                  </div>
                </div>
                <div className="form-check d-flex justify-content-center mt-3">
                  <input className="form-check-input me-2" type="checkbox" id="termsCheck" required checked={acceptTerms} onChange={(e) => setAcceptTerms(e.target.checked)} />
                  <label className="form-check-label" htmlFor="termsCheck">
                    Acepto los <a href="#" className="fw-bold text-decoration-none">términos y condiciones</a>
                  </label>
                </div>
                <div className="d-grid mt-4">
                  <button type="submit" className="btn btn-primary btn-lg registro-btn">Registrar</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default RegistroPage;