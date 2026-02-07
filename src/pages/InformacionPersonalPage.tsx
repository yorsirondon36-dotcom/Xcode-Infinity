import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function InformacionPersonalPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-950 pb-24">
      <div className="bg-purple-800 px-6 py-6 shadow-sm flex items-center gap-4">
        <button onClick={() => navigate('/mi-perfil')} className="text-yellow-400 hover:text-yellow-500">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-white">Información Personal</h1>
      </div>

      <div className="p-6">
        <div className="bg-purple-800 rounded-xl p-6 shadow-md border border-purple-700">
          <h2 className="text-xl font-bold text-yellow-400 mb-4">Tu Información Personal</h2>
          <p className="text-purple-200 text-base leading-relaxed">
            En esta sección podrás visualizar y gestionar tu información personal. Aquí se muestra toda tu información de cuenta.
          </p>
        </div>
      </div>

      <div className="fixed bottom-6 left-6 right-6">
        <button
          onClick={() => navigate('/mi-perfil')}
          className="w-full py-4 rounded-xl font-bold text-lg bg-yellow-400 text-purple-900 hover:bg-yellow-500 shadow-lg transition-all duration-200"
        >
          Volver
        </button>
      </div>
    </div>
  );
}

export default InformacionPersonalPage;
