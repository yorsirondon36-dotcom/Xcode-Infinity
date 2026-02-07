import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function FormasDeGanarPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-950 pb-24">
      <div className="bg-purple-800 px-6 py-6 shadow-sm flex items-center gap-4 border-b border-purple-700">
        <button onClick={() => navigate('/mi-perfil')} className="text-yellow-400 hover:text-yellow-500 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-white">Formas de Ganar Dinero</h1>
      </div>

      <div className="flex-1 flex items-center justify-center p-4 h-[calc(100vh-180px)]">
        <img
          src="/whatsapp_image_2026-02-06_at_9.53.09_pm.jpeg"
          alt="Reglas de Ingresos de Inversión"
          className="w-11/12 h-auto rounded-xl shadow-lg object-cover"
        />
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

export default FormasDeGanarPage;
