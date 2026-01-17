import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, AlertCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface LocationState {
  amount: number;
  paymentMethod?: string;
}

function PaymentQRPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const state = location.state as LocationState;

  const [orderNumber, setOrderNumber] = useState('');
  const [referenceCode, setReferenceCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const amount = state?.amount || 60000;

  useEffect(() => {
    const generateOrderNumber = () => {
      const timestamp = Date.now();
      const random = Math.floor(Math.random() * 10000);
      const order = `ORD${timestamp}${random}`;
      setOrderNumber(order);
    };
    generateOrderNumber();
  }, []);

  const handleSubmit = async () => {
    if (!referenceCode.trim()) {
      setError('Por favor ingrese una referencia');
      return;
    }

    if (!user) {
      setError('Usuario no autenticado');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const { error: insertError } = await supabase
        .from('transactions')
        .insert({
          user_id: user.id,
          order_number: orderNumber,
          amount: amount,
          reference_code: referenceCode,
          payment_method: 'nequi',
          status: 'pending'
        });

      if (insertError) throw insertError;

      navigate('/confirmacion', {
        state: {
          orderNumber,
          amount,
          referenceCode
        }
      });
    } catch (err) {
      console.error('Error:', err);
      setError('Error al procesar la recarga. Intenta nuevamente.');
    } finally {
      setIsLoading(false);
    }
  };

  const isSubmitDisabled = !referenceCode.trim() || isLoading;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-950 pb-24">
      {/* Header */}
      <div className="bg-purple-800 px-6 py-4 shadow-sm flex items-center gap-4 border-b border-purple-700">
        <button
          onClick={() => navigate('/recargas')}
          className="text-yellow-400 hover:text-yellow-300"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-yellow-400">Instrucción para recarga</h1>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6 max-w-md mx-auto">
        {/* Instructions */}
        <div className="space-y-4">
          <h2 className="text-center text-lg font-semibold text-yellow-400">
            Pasos para tu recarga
          </h2>
          <ol className="space-y-3 text-purple-100">
            <li className="flex gap-3">
              <span className="font-bold flex-shrink-0 text-yellow-400">1.</span>
              <span>Abre tu aplicación Nequi en tu celular</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold flex-shrink-0 text-yellow-400">2.</span>
              <span>Escanea el código QR a continuación e introduce el importe indicado</span>
            </li>
            <li className="flex gap-3">
              <span className="font-bold flex-shrink-0 text-yellow-400">3.</span>
              <span>Una vez completada la transferencia, ingresa la referencia exacta del voucher abajo</span>
            </li>
          </ol>
        </div>

        {/* Note */}
        <div className="flex gap-2 p-4 bg-red-500/20 rounded-lg border border-red-500">
          <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-300 font-semibold">
            Nota: Asegúrese de rellenar correctamente la 'referencia' del voucher, de lo contrario el dinero no llegará a tiempo.
          </p>
        </div>

        {/* Purple Card */}
        <div className="bg-purple-800 rounded-2xl p-6 shadow-md space-y-6 border border-purple-700">
          {/* Order Number */}
          <div>
            <label className="text-sm text-purple-300">Número de orden:</label>
            <p className="text-lg font-bold text-yellow-400 mt-1">{orderNumber}</p>
          </div>

          {/* Amount */}
          <div className="border-t border-purple-700 pt-4">
            <p className="text-3xl font-bold text-yellow-400">
              COP {amount.toLocaleString('es-CO')}
            </p>
          </div>

          {/* QR Code */}
          <div className="flex justify-center py-4">
            <img
              src="/whatsapp_image_2026-01-16_at_9.53.33_pm.jpeg"
              alt="QR Code"
              className="w-48 h-48 object-contain"
            />
          </div>

          {/* Reference Input */}
          <div>
            <label className="block text-sm font-semibold mb-2">
              <span className="text-red-400">*</span>
              <span className="text-purple-100 ml-1">Referencia:</span>
            </label>
            <input
              type="text"
              placeholder="Por favor ingrese una referencia"
              value={referenceCode}
              onChange={(e) => {
                setReferenceCode(e.target.value);
                setError('');
              }}
              className="w-full px-4 py-3 border-2 border-purple-600 rounded-lg bg-purple-900 text-white focus:outline-none focus:border-yellow-400 placeholder-purple-400"
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-red-500/20 border border-red-500 rounded-lg">
              <p className="text-sm text-red-300">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            onClick={handleSubmit}
            disabled={isSubmitDisabled}
            className={`w-full py-4 rounded-lg font-bold text-lg transition-all duration-200 ${
              isSubmitDisabled
                ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                : 'bg-yellow-400 text-purple-900 hover:bg-yellow-500 shadow-lg'
            }`}
          >
            {isLoading ? 'Procesando...' : 'Entregar'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default PaymentQRPage;
