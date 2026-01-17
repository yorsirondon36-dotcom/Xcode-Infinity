import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CheckCircle, Home } from 'lucide-react';

interface LocationState {
  orderNumber: string;
  amount: number;
  referenceCode: string;
}

function ConfirmationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const orderNumber = state?.orderNumber || '';
  const amount = state?.amount || 0;
  const referenceCode = state?.referenceCode || '';

  return (
    <div className="min-h-screen bg-[#E1F5FE] flex flex-col items-center justify-center px-6 py-12">
      <div className="max-w-md w-full space-y-8">
        {/* Success Icon */}
        <div className="flex justify-center">
          <div className="bg-lime-400 rounded-full p-4">
            <CheckCircle className="w-16 h-16 text-gray-900" />
          </div>
        </div>

        {/* Message */}
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold text-gray-800">¡Recarga Registrada!</h1>
          <p className="text-gray-600">
            Tu recarga ha sido registrada correctamente. Puedes hacer seguimiento de tu transacción abajo.
          </p>
        </div>

        {/* Transaction Details */}
        <div className="bg-white rounded-2xl p-6 space-y-4 shadow-md">
          <div className="border-b border-gray-200 pb-4">
            <label className="text-sm text-gray-600">Número de orden:</label>
            <p className="text-lg font-bold text-gray-800 mt-1">{orderNumber}</p>
          </div>

          <div className="border-b border-gray-200 pb-4">
            <label className="text-sm text-gray-600">Monto:</label>
            <p className="text-2xl font-bold text-gray-800 mt-1">
              COP {amount.toLocaleString('es-CO')}
            </p>
          </div>

          <div>
            <label className="text-sm text-gray-600">Referencia:</label>
            <p className="text-lg font-bold text-gray-800 mt-1 break-words">{referenceCode}</p>
          </div>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            El dinero llegará a tu cuenta una vez que validemos la transacción. Este proceso puede tomar algunos minutos.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => navigate('/recargas')}
            className="w-full bg-lime-400 hover:bg-lime-500 text-gray-900 font-bold py-4 rounded-lg shadow-lg transition-all duration-200"
          >
            Ver mis recargas
          </button>

          <button
            onClick={() => navigate('/mi-perfil')}
            className="w-full flex items-center justify-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-4 rounded-lg transition-all duration-200"
          >
            <Home className="w-5 h-5" />
            Ir al inicio
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationPage;
