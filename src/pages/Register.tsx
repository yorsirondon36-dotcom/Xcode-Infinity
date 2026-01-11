import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, Lock, Eye, EyeOff, Users } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Register() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    withdrawalPassword: '',
    referralCode: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showWithdrawalPassword, setShowWithdrawalPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const generatedCode = 'REF' + Math.random().toString(36).substr(2, 6).toUpperCase();
    setFormData(prev => ({
      ...prev,
      referralCode: generatedCode
    }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Las contraseñas no coinciden');
      return;
    }

    setLoading(true);
    try {
      await signUp(formData.email, formData.password, formData.phone, formData.name);
      navigate('/mi-perfil');
    } catch (err: any) {
      setError(err.message || 'Error al crear la cuenta');
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
              Crear Cuenta
            </h1>
            <p className="text-gray-300">
              Únete a Xcode-infinity y comienza a ganar
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-white text-sm font-medium mb-2">
                Nombre completo
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg bg-purple-800 border border-purple-600 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                placeholder="Tu nombre"
                required
              />
            </div>

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
              <label className="block text-white text-sm font-medium mb-2">
                Número de teléfono
              </label>
              <div className="flex gap-2">
                <div className="flex items-center px-4 py-3 rounded-lg bg-purple-800 border border-purple-600 text-white">
                  <Phone className="w-5 h-5 mr-2 flex-shrink-0" />
                  <span className="font-medium">+57</span>
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  className="flex-1 px-4 py-3 rounded-lg bg-purple-800 border border-purple-600 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                  placeholder="300 123 4567"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
                Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3 rounded-lg bg-purple-800 border border-purple-600 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                  placeholder="Mínimo 6 caracteres"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-white text-sm font-medium mb-2">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-purple-800 border border-purple-600 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                  placeholder="Repite tu contraseña"
                  required
                />
              </div>
            </div>

            <div>
              <label htmlFor="withdrawalPassword" className="block text-white text-sm font-medium mb-2">
                Clave de Retiro
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type={showWithdrawalPassword ? "text" : "password"}
                  id="withdrawalPassword"
                  name="withdrawalPassword"
                  value={formData.withdrawalPassword}
                  onChange={handleChange}
                  className="w-full pl-12 pr-12 py-3 rounded-lg bg-purple-800 border border-purple-600 text-white placeholder-gray-400 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20"
                  placeholder="Para seguridad en retiro"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowWithdrawalPassword(!showWithdrawalPassword)}
                  className="absolute right-4 top-3.5 text-gray-400 hover:text-white transition-colors"
                >
                  {showWithdrawalPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="referralCode" className="block text-white text-sm font-medium mb-2">
                Referido Automático
              </label>
              <div className="relative">
                <Users className="absolute left-4 top-3.5 w-5 h-5 text-gray-400 pointer-events-none" />
                <input
                  type="text"
                  id="referralCode"
                  name="referralCode"
                  value={formData.referralCode}
                  readOnly
                  className="w-full pl-12 pr-4 py-3 rounded-lg bg-purple-800 border border-purple-600 text-white placeholder-gray-400 focus:outline-none cursor-not-allowed opacity-75"
                  placeholder="Código de referido"
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 via-purple-600 to-purple-800 hover:from-purple-700 hover:via-purple-700 hover:to-purple-900 disabled:from-gray-600 disabled:via-gray-600 disabled:to-gray-700 text-white font-bold py-4 rounded-lg shadow-lg transition-all duration-200 mt-6 text-lg"
            >
              {loading ? 'Creando cuenta...' : 'Crear Cuenta'}
            </button>
          </form>

          <p className="text-center text-gray-300">
            ¿Ya tienes cuenta?{' '}
            <button
              onClick={() => navigate('/login')}
              className="text-yellow-400 hover:text-yellow-300 font-semibold"
            >
              Inicia sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;
