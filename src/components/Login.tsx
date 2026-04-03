import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { iniciarSesionConTelefono } from '../lib/auth';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
  const [telefono, setTelefono] = useState('');
  const [contrasena, setContrasena] = useState('');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setCargando(true);

    try {
      await iniciarSesionConTelefono(telefono, contrasena);
      navigate('/dashboard');
    } catch (err) {
      const mensaje =
        err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(mensaje);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Iniciar Sesión</h1>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="telefono">Teléfono</label>
            <input
              id="telefono"
              type="tel"
              value={telefono}
              onChange={(e) => setTelefono(e.target.value)}
              placeholder="Ingresa tu teléfono"
              disabled={cargando}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="contrasena">Contraseña</label>
            <input
              id="contrasena"
              type="password"
              value={contrasena}
              onChange={(e) => setContrasena(e.target.value)}
              placeholder="Ingresa tu contraseña"
              disabled={cargando}
              required
            />
          </div>

          <button type="submit" disabled={cargando} className="submit-btn">
            {cargando ? 'Iniciando sesión...' : 'Iniciar Sesión'}
          </button>
        </form>

        <div className="footer">
          <p>
            ¿No tienes cuenta?{' '}
            <a href="/signup" className="link">
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
