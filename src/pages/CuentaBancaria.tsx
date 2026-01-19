import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

function CuentaBancaria() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [bankingInfo, setBankingInfo] = useState({
    bank_name: '',
    account_holder: '',
    account_number: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setBankingInfo({
      ...bankingInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    if (!user?.id) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('users')
        .update({ banking_info: bankingInfo })
        .eq('id', user.id);

      if (error) throw error;
      alert('Información bancaria guardada exitosamente');
    } catch (error) {
      console.error('Error saving banking info:', error);
      alert('Error al guardar la información');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-950 pb-24">
      <div className="bg-purple-800 px-6 py-6 shadow-sm flex items-center gap-4 border-b border-purple-700">
        <button onClick={() => navigate(-1)} className="text-yellow-400 hover:text-yellow-300">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-yellow-400">Cuenta Bancaria</h1>
      </div>

      <div className="p-6">
        <div className="bg-purple-800 rounded-xl p-6 shadow-md space-y-4 border border-purple-700">
          <div>
            <label className="block text-purple-200 font-medium text-sm mb-2">Banco</label>
            <select
              name="bank_name"
              value={bankingInfo.bank_name}
              onChange={handleChange}
              className="w-full px-4 py-3 border-2 border-purple-700 rounded-lg bg-purple-900 text-white font-medium focus:outline-none focus:border-yellow-400"
            >
              <option value="">Selecciona un banco</option>
              <option value="Nequi">Nequi</option>
              <option value="Bancolombia">Bancolombia</option>
            </select>
          </div>

          <div>
            <label className="block text-purple-200 font-medium text-sm mb-2">Titular de la cuenta</label>
            <input
              type="text"
              name="account_holder"
              value={bankingInfo.account_holder}
              onChange={handleChange}
              placeholder="Tu nombre completo"
              className="w-full px-4 py-3 border-2 border-purple-700 rounded-lg bg-purple-900 text-white placeholder-purple-400 font-medium focus:outline-none focus:border-yellow-400"
            />
          </div>

          <div>
            <label className="block text-purple-200 font-medium text-sm mb-2">Número de cuenta</label>
            <input
              type="text"
              name="account_number"
              value={bankingInfo.account_number}
              onChange={handleChange}
              placeholder="Número de cuenta"
              className="w-full px-4 py-3 border-2 border-purple-700 rounded-lg bg-purple-900 text-white placeholder-purple-400 font-medium focus:outline-none focus:border-yellow-400"
            />
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 disabled:bg-gray-600 text-purple-900 font-bold py-3 rounded-lg transition-colors mt-6 shadow-lg"
          >
            {loading ? 'Guardando...' : 'Guardar información'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CuentaBancaria;
