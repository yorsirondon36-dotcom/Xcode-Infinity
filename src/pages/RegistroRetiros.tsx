import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface Withdrawal {
  id: string;
  amount: number;
  status: string;
  created_at: string;
}

function RegistroRetiros() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (user) {
      fetchWithdrawals();
    }
  }, [user]);

  const fetchWithdrawals = async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('withdrawals')
        .select('id, amount, status, created_at')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setWithdrawals(data || []);
    } catch (err: any) {
      console.error('Error fetching withdrawals:', err);
      setError('No se pudieron cargar los retiros');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'exitoso':
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pendiente':
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed':
        return 'Exitoso';
      case 'pending':
        return 'Pendiente';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-950 pb-24">
      <div className="bg-purple-800 px-6 py-6 shadow-sm flex items-center gap-4 border-b border-purple-700">
        <button
          onClick={() => navigate(-1)}
          className="text-yellow-400 hover:text-yellow-300"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-yellow-400">Registros de Retiros</h1>
      </div>

      <div className="px-6 py-6">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-yellow-400">Cargando...</p>
          </div>
        ) : error ? (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : withdrawals.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-purple-200">No hay retiros registrados</p>
          </div>
        ) : (
          <div className="space-y-4">
            {withdrawals.map((withdrawal, index) => (
              <div key={withdrawal.id} className="bg-purple-800 rounded-xl p-4 shadow-md border border-purple-700">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-yellow-400 rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-purple-900 font-bold text-lg">R</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-yellow-400 font-semibold">{index + 1}</p>
                    <p className="text-purple-200 text-sm">{formatDate(withdrawal.created_at)}</p>
                  </div>

                  <div className="flex flex-col items-end gap-1 flex-shrink-0">
                    <p className="text-yellow-400 font-bold">
                      ${Number(withdrawal.amount).toFixed(2)}
                    </p>
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${getStatusColor(withdrawal.status)}`}>
                      {getStatusLabel(withdrawal.status)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RegistroRetiros;
