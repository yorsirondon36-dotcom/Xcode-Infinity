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
    account_number: '',
    account_type: ''
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
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 pb-24">
      <div className="bg-white px-6 py-6 shadow-sm flex items-center gap-4">
        <button onClick={() => navigate(-1)} className="text-blue-600 hover:text-blue-700">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Cuenta Bancaria</h1>
      </div>

      <div className="p-6">
        <div className="bg-white rounded-xl p-6 shadow-md space-y-4">
          <div>
            <label className="block text-gray-700 font-medium text-sm mb-2">Banco</label>
            <input
              type="text"
              name="bank_name"
              value={bankingInfo.bank_name}
              onChange={handleChange}
              placeholder="Ej: Nequi, Bancolombia"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium text-sm mb-2">Titular de la cuenta</label>
            <input
              type="text"
              name="account_holder"
              value={bankingInfo.account_holder}
              onChange={handleChange}
              placeholder="Tu nombre completo"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium text-sm mb-2">Número de cuenta</label>
            <input
              type="text"
              name="account_number"
              value={bankingInfo.account_number}
              onChange={handleChange}
              placeholder="Número de cuenta"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium text-sm mb-2">Tipo de cuenta</label>
            <select
              name="account_type"
              value={bankingInfo.account_type}
              onChange={handleChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
            >
              <option value="">Selecciona un tipo</option>
              <option value="ahorros">Ahorros</option>
              <option value="corriente">Corriente</option>
            </select>
          </div>

          <button
            onClick={handleSave}
            disabled={loading}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-lg transition-colors mt-6"
          >
            {loading ? 'Guardando...' : 'Guardar información'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CuentaBancaria;
