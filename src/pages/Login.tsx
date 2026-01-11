import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Login() {
  const navigate = useNavigate();
  const { signIn } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await signIn(formData.email, formData.password);
      navigate('/mi-perfil');
    } catch (err: any) {
      setError(err.message || 'Error al iniciar sesión');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-950 flex flex-col px-6 py-8">
      <button
        onClick={() => navigate('/')}
        className="self-start text-white hover:text-yellow-400 transition-colors mb-8"
      >
        <ArrowLeft className="w-6 h-6" />
      </button>

      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-yellow-400 mb-2">
              Iniciar Sesión
            </h1>
            <p className="text-gray-300">
              Bienvenido de vuelta a Xcode-infinity
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                Correo electrónico
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-purple-800 border border-purple-600 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                placeholder="correo@ejemplo.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
                Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 pr-12 rounded-lg bg-purple-800 border border-purple-600 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                  placeholder="Ingresa tu contraseña"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-yellow-400 transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <div className="flex justify-end">
              <button
                type="button"
                className="text-yellow-400 hover:text-yellow-300 text-sm font-medium"
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 via-purple-600 to-purple-800 hover:from-purple-700 hover:via-purple-700 hover:to-purple-900 disabled:from-gray-600 disabled:via-gray-600 disabled:to-gray-700 text-white font-bold py-4 rounded-lg shadow-lg transition-all duration-200 text-lg"
            >
              {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
            </button>
          </form>

          <p className="text-center text-gray-300">
            ¿No tienes cuenta?{' '}
            <button
              onClick={() => navigate('/registro')}
              className="text-yellow-400 hover:text-yellow-300 font-semibold"
            >
              Regístrate
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
