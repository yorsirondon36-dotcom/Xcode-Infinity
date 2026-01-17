import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

function Recargas() {
  const navigate = useNavigate();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('nequi');

  const amounts = [120000, 300000, 600000, 1000000, 1500000];

  const handleSelectAmount = (amount: number) => {
    setSelectedAmount(amount);
  };

  const handleSubmit = () => {
    if (selectedAmount) {
      navigate('/pago-qr', {
        state: {
          amount: selectedAmount,
          paymentMethod: selectedPaymentMethod
        },
        replace: false
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-950 pb-24">
      {/* Header */}
      <div className="bg-purple-800 px-6 py-6 shadow-sm flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-yellow-400 hover:text-yellow-500">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-white">Recargar</h1>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        {/* Amount Grid */}
        <div>
          <h2 className="text-sm font-bold text-yellow-400 mb-4">SELECCIONA UN MONTO</h2>
          <div className="grid grid-cols-2 gap-3">
            {amounts.map((amount) => (
              <button
                key={amount}
                onClick={() => handleSelectAmount(amount)}
                className={`p-4 rounded-xl font-bold text-sm transition-all duration-200 ${
                  selectedAmount === amount
                    ? 'bg-yellow-400 text-purple-900 shadow-lg'
                    : 'bg-purple-800 text-white border-2 border-purple-700 hover:border-yellow-400'
                }`}
              >
                ${(amount / 1000).toFixed(0)}K
              </button>
            ))}
          </div>
        </div>

        {/* Amount Display */}
        <div className="bg-purple-800 rounded-xl p-4 shadow-sm">
          <label className="text-xs font-bold text-gray-300 mb-2 block">MONTO DEL DEPÓSITO</label>
          <div className="flex items-center justify-between">
            <span className={`text-2xl font-bold ${selectedAmount ? 'text-white' : 'text-gray-400'}`}>
              {selectedAmount ? `$${selectedAmount.toLocaleString()}` : 'Selecciona un monto'}
            </span>
            <span className="text-lg font-bold text-yellow-400">COP</span>
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-purple-800 rounded-xl p-4 shadow-sm">
          <label htmlFor="payment-method" className="text-xs font-bold text-gray-300 mb-2 block">
            MÉTODO DE PAGO
          </label>
          <select
            id="payment-method"
            value={selectedPaymentMethod}
            onChange={(e) => setSelectedPaymentMethod(e.target.value)}
            className="w-full px-4 py-3 border-2 border-purple-700 rounded-lg bg-purple-900 text-white font-medium focus:outline-none focus:border-yellow-400"
          >
            <option value="nequi">Nequi</option>
            <option value="bancolombia">Bancolombia</option>
          </select>
        </div>
      </div>

      {/* Submit Button */}
      <div className="fixed bottom-6 left-6 right-6">
        <button
          onClick={handleSubmit}
          disabled={!selectedAmount}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
            selectedAmount
              ? 'bg-yellow-400 text-purple-900 hover:bg-yellow-500 shadow-lg'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}

export default Recargas;
