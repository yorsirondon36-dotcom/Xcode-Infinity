import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function RegistroRecargas() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 pb-24">
      <div className="bg-white px-6 py-6 shadow-sm flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-blue-600 hover:text-blue-700">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Registro de Recargas</h1>
      </div>

      <div className="p-6 text-center text-gray-600">
        <p>Página de Registro de Recargas en construcción</p>
      </div>
    </div>
  );
}

export default RegistroRecargas;
