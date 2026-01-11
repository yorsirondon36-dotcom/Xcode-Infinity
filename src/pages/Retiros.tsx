import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

function Retiros() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('nequi');
  const [accountNumber, setAccountNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const amounts = [30000, 80000, 120000, 200000, 250000, 300000, 350000, 400000, 450000, 500000];

  const handleSelectAmount = (amount: number) => {
    setSelectedAmount(amount);
    setError('');
  };

  const handleSubmit = async () => {
    if (!selectedAmount || !accountNumber || !selectedPaymentMethod) {
      setError('Por favor completa todos los campos');
      return;
    }

    if (!user) {
      setError('Usuario no autenticado');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('balance')
        .eq('id', user.id)
        .maybeSingle();

      if (userError) throw userError;

      if (!userData || userData.balance < selectedAmount) {
        setError('Saldo insuficiente');
        setLoading(false);
        return;
      }

      const { error: withdrawError } = await supabase
        .from('withdrawals')
        .insert({
          user_id: user.id,
          amount: selectedAmount,
          method: selectedPaymentMethod === 'nequi' ? 'Nequi' : 'Bancolombia',
          account_number: accountNumber,
          status: 'pending'
        });

      if (withdrawError) throw withdrawError;

      const newBalance = userData.balance - selectedAmount;
      const { error: updateError } = await supabase
        .from('users')
        .update({ balance: newBalance })
        .eq('id', user.id);

      if (updateError) throw updateError;

      navigate('/registro-retiros');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al procesar solicitud');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-950 pb-24">
      <div className="bg-purple-800 px-6 py-6 shadow-sm flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-yellow-400 hover:text-yellow-500">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-white">Retirar</h1>
      </div>

      <div className="p-6 space-y-6">
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

        <div className="bg-purple-800 rounded-xl p-4 shadow-sm">
          <label className="text-xs font-bold text-gray-300 mb-2 block">MONTO DE RETIRO</label>
          <div className="flex items-center justify-between">
            <span className={`text-2xl font-bold ${selectedAmount ? 'text-white' : 'text-gray-400'}`}>
              {selectedAmount ? `$${selectedAmount.toLocaleString()}` : 'Selecciona un monto'}
            </span>
            <span className="text-lg font-bold text-yellow-400">COP</span>
          </div>
        </div>

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

        <div className="bg-purple-800 rounded-xl p-4 shadow-sm">
          <label htmlFor="account-number" className="text-xs font-bold text-gray-300 mb-2 block">
            CUENTA BANCARIA
          </label>
          <input
            id="account-number"
            type="text"
            value={accountNumber}
            onChange={(e) => setAccountNumber(e.target.value)}
            placeholder="Ingresa tu número de cuenta"
            className="w-full px-4 py-3 border-2 border-purple-700 rounded-lg bg-purple-900 text-white placeholder-gray-500 font-medium focus:outline-none focus:border-yellow-400"
          />
        </div>

        {error && (
          <div className="bg-red-900 border border-red-700 rounded-lg p-4">
            <p className="text-red-200 text-sm">{error}</p>
          </div>
        )}
      </div>

      <div className="fixed bottom-6 left-6 right-6">
        <button
          onClick={handleSubmit}
          disabled={!selectedAmount || loading}
          className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-200 ${
            selectedAmount && !loading
              ? 'bg-yellow-400 text-purple-900 hover:bg-yellow-500 shadow-lg'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {loading ? 'Procesando...' : 'Enviar'}
        </button>
      </div>
    </div>
  );
}

export default Retiros;
