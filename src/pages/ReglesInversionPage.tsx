import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function ReglesInversionPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-950 pb-24">
      <div className="bg-purple-800 px-6 py-6 shadow-sm flex items-center gap-4 border-b border-purple-700">
        <button
          onClick={() => navigate(-1)}
          className="text-yellow-400 hover:text-yellow-500 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-white">Reglas de Inversión</h1>
      </div>

      <div className="p-6 text-center text-purple-300">
        <p>Página vacía</p>
      </div>

      <div className="fixed bottom-6 left-6 right-6">
        <button
          onClick={() => navigate(-1)}
          className="w-full py-4 rounded-xl font-bold text-lg bg-yellow-400 text-purple-900 hover:bg-yellow-500 shadow-lg transition-all duration-200"
        >
          Volver
        </button>
      </div>
    </div>
  );
}

export default ReglesInversionPage;
