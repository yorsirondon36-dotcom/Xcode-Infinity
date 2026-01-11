import React from 'react';
import { useNavigate } from 'react-router-dom';
import { DollarSign, Users, TrendingUp } from 'lucide-react';

function Welcome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-950 flex flex-col items-center justify-center px-6 py-12">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center space-y-6">
          <h2 className="text-2xl font-semibold text-white tracking-wider">
            BIENVENIDOS
          </h2>

          <h1 className="text-5xl font-bold text-yellow-400">
            Xcode-infinity
          </h1>

          <p className="text-xl text-gray-200 font-medium">
            Invierte seguro y gana dinero
          </p>

          <p className="text-gray-300 leading-relaxed px-4">
            Únete a miles de colombianos que ya están generando ingresos invirtiendo en nuestra plataforma. Únete a nosotros y sé parte de nuestro gran equipo, no te pierdas esta oportunidad.
          </p>
        </div>

        <div className="flex justify-center gap-12 py-8">
          <div className="flex flex-col items-center space-y-2">
            <div className="bg-yellow-400 rounded-full p-4">
              <DollarSign className="w-8 h-8 text-purple-900" />
            </div>
            <p className="text-white text-sm font-medium">Gana Diario</p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="bg-yellow-400 rounded-full p-4">
              <Users className="w-8 h-8 text-purple-900" />
            </div>
            <p className="text-white text-sm font-medium">Invita Amigos</p>
          </div>

          <div className="flex flex-col items-center space-y-2">
            <div className="bg-yellow-400 rounded-full p-4">
              <TrendingUp className="w-8 h-8 text-purple-900" />
            </div>
            <p className="text-white text-sm font-medium">Sube de Nivel</p>
          </div>
        </div>

        <div className="space-y-4 pt-8">
          <button
            onClick={() => navigate('/registro')}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-white font-bold py-4 rounded-lg shadow-lg transition-colors duration-200"
          >
            Crear cuenta
          </button>

          <button
            onClick={() => navigate('/login')}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-lg shadow-lg transition-colors duration-200"
          >
            Iniciar sesión
          </button>
        </div>
      </div>
    </div>
  );
}

export default Welcome;
