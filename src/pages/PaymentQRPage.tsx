import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, QrCode } from 'lucide-react';

interface LocationState {
  amount: number;
  paymentMethod: string;
}

function PaymentQRPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState;

  const amount = state?.amount || 0;
  const paymentMethod = state?.paymentMethod || 'Nequi';

  const getPaymentMethodLabel = (method: string): string => {
    const labels: Record<string, string> = {
      nequi: 'Nequi',
      bancolombia: 'Bancolombia'
    };
    return labels[method] || method;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-950 pb-24">
      {/* Header */}
      <div className="bg-purple-800 px-6 py-6 shadow-sm flex items-center gap-4">
        <button onClick={() => navigate('/recargas')} className="text-yellow-400 hover:text-yellow-500">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-white">Pago QR</h1>
      </div>

      {/* Content */}
      <div className="p-6 space-y-8 flex flex-col items-center">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-xl font-bold text-white">Página de Pagos en Construcción</h2>
        </div>

        {/* QR Code Area */}
        <div className="bg-purple-800 rounded-2xl p-8 shadow-lg max-w-sm w-full">
          <div className="flex items-center justify-center h-64 bg-purple-900 rounded-lg">
            <QrCode className="w-32 h-32 text-yellow-400" />
          </div>
        </div>

        {/* Payment Details */}
        <div className="bg-purple-800 rounded-xl p-6 shadow-sm max-w-sm w-full space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-300 mb-1 block">MÉTODO DE PAGO</label>
            <p className="text-lg font-bold text-white">{getPaymentMethodLabel(paymentMethod)}</p>
          </div>

          <div className="border-t border-purple-700 pt-4">
            <label className="text-xs font-bold text-gray-300 mb-1 block">MONTO A RECARGAR</label>
            <p className="text-3xl font-bold text-yellow-400">${amount.toLocaleString()} COP</p>
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-purple-800 border border-purple-700 rounded-xl p-4 max-w-sm w-full text-center">
          <p className="text-sm text-gray-200">
            Escanea este código con <span className="font-bold text-yellow-400">{getPaymentMethodLabel(paymentMethod)}</span> para recargar <span className="font-bold text-yellow-400">${amount.toLocaleString()} COP</span>.
          </p>
        </div>
      </div>

      {/* Confirm Button */}
      <div className="fixed bottom-6 left-6 right-6">
        <button className="w-full py-4 bg-yellow-400 text-purple-900 rounded-xl font-bold text-lg hover:bg-yellow-500 shadow-lg transition-all duration-200">
          Confirmar Pago
        </button>
      </div>
    </div>
  );
}

export default PaymentQRPage;
