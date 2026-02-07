import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Eye, EyeOff, Phone, CreditCard, Lock, Key } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface UserInfo {
  phone: string;
  banking_info: any;
  withdrawal_pin: string | null;
}

function InformacionPersonalPage() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showPin, setShowPin] = useState(false);

  useEffect(() => {
    if (user?.id) {
      fetchUserInfo();
    }
  }, [user?.id]);

  const fetchUserInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('phone, banking_info, withdrawal_pin')
        .eq('id', user?.id)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        setUserInfo({
          phone: data.phone || '',
          banking_info: data.banking_info || {},
          withdrawal_pin: data.withdrawal_pin || null
        });
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-950 flex items-center justify-center">
        <div className="text-yellow-400 text-lg">Cargando información...</div>
      </div>
    );
  }

  const accountNumber = userInfo?.banking_info?.account_number || 'No registrada';
  const bankName = userInfo?.banking_info?.bank_name || '';

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-950 pb-24">
      <div className="bg-purple-800 px-6 py-6 shadow-sm flex items-center gap-4 border-b border-purple-700">
        <button
          onClick={() => navigate(-1)}
          className="text-yellow-400 hover:text-yellow-500 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-white">Información Personal</h1>
      </div>

      <div className="px-6 py-6 space-y-4">
        <div className="bg-purple-800 rounded-xl p-5 shadow-md border border-purple-700 flex items-center justify-between hover:bg-purple-700 transition-colors">
          <div className="flex items-center gap-4">
            <div className="bg-purple-900 rounded-lg p-3">
              <Phone className="w-5 h-5 text-fuchsia-400" />
            </div>
            <div>
              <p className="text-purple-200 text-sm font-medium">Número de teléfono</p>
              <p className="text-white text-sm mt-1">{userInfo?.phone || 'No registrado'}</p>
            </div>
          </div>
        </div>

        <div className="bg-purple-800 rounded-xl p-5 shadow-md border border-purple-700 flex items-center justify-between hover:bg-purple-700 transition-colors">
          <div className="flex items-center gap-4 flex-1">
            <div className="bg-purple-900 rounded-lg p-3">
              <CreditCard className="w-5 h-5 text-fuchsia-400" />
            </div>
            <div className="flex-1">
              <p className="text-purple-200 text-sm font-medium">Cuenta bancaria</p>
              <div className="flex flex-col mt-1">
                {bankName && <p className="text-gray-300 text-xs">{bankName}</p>}
                <p className="text-white text-sm font-medium">{accountNumber}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-purple-800 rounded-xl p-5 shadow-md border border-purple-700 flex items-center justify-between hover:bg-purple-700 transition-colors">
          <div className="flex items-center gap-4 flex-1">
            <div className="bg-purple-900 rounded-lg p-3">
              <Lock className="w-5 h-5 text-fuchsia-400" />
            </div>
            <div className="flex-1">
              <p className="text-purple-200 text-sm font-medium">Contraseña de inicio de sesión</p>
              <p className="text-white text-sm mt-1">
                {showPassword ? '••••••••' : '••••••••'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="text-yellow-400 hover:text-yellow-500 transition-colors ml-4"
          >
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>

        <div className="bg-purple-800 rounded-xl p-5 shadow-md border border-purple-700 flex items-center justify-between hover:bg-purple-700 transition-colors">
          <div className="flex items-center gap-4 flex-1">
            <div className="bg-purple-900 rounded-lg p-3">
              <Key className="w-5 h-5 text-fuchsia-400" />
            </div>
            <div className="flex-1">
              <p className="text-purple-200 text-sm font-medium">Clave de retiro</p>
              <p className="text-white text-sm mt-1">
                {showPin ? (userInfo?.withdrawal_pin || 'No configurada') : '••••'}
              </p>
            </div>
          </div>
          <button
            onClick={() => setShowPin(!showPin)}
            className="text-yellow-400 hover:text-yellow-500 transition-colors ml-4"
          >
            {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>

      <div className="fixed bottom-6 left-6 right-6">
        <button
          onClick={() => navigate('/mi-perfil')}
          className="w-full py-4 rounded-xl font-bold text-lg bg-yellow-400 text-purple-900 hover:bg-yellow-500 shadow-lg transition-all duration-200"
        >
          Volver
        </button>
      </div>
    </div>
  );
}

export default InformacionPersonalPage;
