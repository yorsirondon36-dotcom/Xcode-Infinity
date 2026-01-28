import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home,
  ListChecks,
  MessageCircle,
  Users,
  Award,
  LogOut,
  Smartphone,
  DollarSign,
  TrendingUp,
  BarChart3,
  CreditCard,
  Info,
  ArrowUp,
  Zap
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface UserData {
  phone: string;
  balance: number;
  total_income: number;
  daily_income: number;
  current_level: string;
  banking_info: any;
}

function MyProfile() {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?.id) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      const { data: profile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user?.id)
        .single();

      const { data: dailyIncomeData } = await supabase
        .from('daily_income')
        .select('amount')
        .eq('user_id', user?.id)
        .gte('created_at', new Date().toISOString().split('T')[0]);

      const dailyTotal = dailyIncomeData?.reduce((sum, item) => sum + item.amount, 0) || 0;

      if (profile) {
        setUserData({
          phone: profile.phone,
          balance: profile.balance || 0,
          total_income: profile.total_income || 0,
          daily_income: dailyTotal,
          current_level: profile.current_level_id || 'Sin nivel',
          banking_info: profile.banking_info || {}
        });
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogOut = async () => {
    try {
      await supabase.auth.signOut();
      navigate('/login');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  const handleWhatsApp = () => {
    window.open('https://wa.me/573001234567', '_blank');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-950 flex items-center justify-center">
        <div className="text-yellow-400">Cargando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-950 pb-24">
      {/* Header with ID */}
      <div className="bg-purple-800 px-6 py-6 shadow-sm border-b border-purple-700">
        <h1 className="text-2xl font-bold text-yellow-400">ID {userData?.phone || 'N/A'}</h1>
        <p className="text-purple-200 text-sm mt-1">Tu cuenta</p>
      </div>

      {/* Account Summary Card */}
      <div className="px-6 py-6">
        <div className="bg-purple-800 rounded-xl p-6 shadow-md border border-purple-700">
          <div className="flex justify-between items-start mb-6">
            <div>
              <p className="text-purple-200 text-sm font-medium">MI NIVEL</p>
              <p className="text-3xl font-bold text-yellow-400 mt-2">{userData?.current_level}</p>
            </div>
            <Award className="w-12 h-12 text-yellow-400" />
          </div>

          <div className="flex gap-4 pt-4 border-t border-purple-700">
            <button
              onClick={() => navigate('/recargas')}
              className="flex-1 bg-purple-700 hover:bg-purple-600 text-yellow-400 font-semibold py-3 rounded-lg transition-colors"
            >
              Recargar
            </button>
            <button
              onClick={() => navigate('/retiros')}
              className="flex-1 bg-purple-700 hover:bg-purple-600 text-yellow-400 font-semibold py-3 rounded-lg transition-colors"
            >
              Retiro
            </button>
          </div>
        </div>
      </div>

      {/* Financial Overview */}
      <div className="px-6 space-y-4">
        <div className="bg-purple-800 rounded-xl p-6 shadow-md border border-purple-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-200 text-sm font-medium">Mi saldo</p>
              <p className="text-2xl font-bold text-yellow-400 mt-2">${userData?.balance.toFixed(2)}</p>
            </div>
            <DollarSign className="w-10 h-10 text-yellow-400" />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-purple-800 rounded-xl p-4 shadow-md border border-purple-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-xs font-medium">Ingresos hoy</p>
                <p className="text-xl font-bold text-yellow-400 mt-1">${userData?.daily_income.toFixed(2)}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-yellow-400" />
            </div>
          </div>

          <div className="bg-purple-800 rounded-xl p-4 shadow-md border border-purple-700">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-200 text-xs font-medium">Ingresos totales</p>
                <p className="text-xl font-bold text-yellow-400 mt-1">${userData?.total_income.toFixed(2)}</p>
              </div>
              <BarChart3 className="w-8 h-8 text-yellow-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="px-6 py-6">
        <h3 className="text-yellow-400 font-semibold text-sm uppercase tracking-wider mb-4">Menú</h3>

        <div className="space-y-3">
          <button
            onClick={() => navigate('/registro-recargas')}
            className="w-full flex items-center justify-between p-4 bg-purple-800 rounded-lg hover:bg-purple-700 transition-colors shadow-sm border border-purple-700"
          >
            <div className="flex items-center gap-3">
              <BarChart3 className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-medium">Registro de recarga</span>
            </div>
            <span className="text-yellow-400">›</span>
          </button>

          <button
            onClick={() => navigate('/registro-retiros')}
            className="w-full flex items-center justify-between p-4 bg-purple-800 rounded-lg hover:bg-purple-700 transition-colors shadow-sm border border-purple-700"
          >
            <div className="flex items-center gap-3">
              <CreditCard className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-medium">Registro de retiros</span>
            </div>
            <span className="text-yellow-400">›</span>
          </button>

          <button
            onClick={() => navigate('/cuenta-bancaria')}
            className="w-full flex items-center justify-between p-4 bg-purple-800 rounded-lg hover:bg-purple-700 transition-colors shadow-sm border border-purple-700"
          >
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-medium">Cuenta bancaria</span>
            </div>
            <span className="text-yellow-400">›</span>
          </button>

          <button
            onClick={() => navigate('/retiros')}
            className="w-full flex items-center justify-between p-4 bg-purple-800 rounded-lg hover:bg-purple-700 transition-colors shadow-sm border border-purple-700"
          >
            <div className="flex items-center gap-3">
              <ArrowUp className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-medium">Retirar</span>
            </div>
            <span className="text-yellow-400">›</span>
          </button>

          <button
            onClick={() => navigate('/mi-equipo')}
            className="w-full flex items-center justify-between p-4 bg-purple-800 rounded-lg hover:bg-purple-700 transition-colors shadow-sm border border-purple-700"
          >
            <div className="flex items-center gap-3">
              <Users className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-medium">Mi Equipo</span>
            </div>
            <span className="text-yellow-400">›</span>
          </button>

          <button
            onClick={() => navigate('/about')}
            className="w-full flex items-center justify-between p-4 bg-purple-800 rounded-lg hover:bg-purple-700 transition-colors shadow-sm border border-purple-700"
          >
            <div className="flex items-center gap-3">
              <Info className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-medium">Sobre Nosotros</span>
            </div>
            <span className="text-yellow-400">›</span>
          </button>

          <button
            onClick={handleWhatsApp}
            className="w-full flex items-center justify-between p-4 bg-purple-800 rounded-lg hover:bg-purple-700 transition-colors shadow-sm border border-purple-700"
          >
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-yellow-400" />
              <span className="text-white font-medium">Atención al Cliente</span>
            </div>
            <span className="text-yellow-400">›</span>
          </button>

          <button
            onClick={handleLogOut}
            className="w-full flex items-center justify-between p-4 bg-red-900 hover:bg-red-800 rounded-lg transition-colors shadow-sm mt-6 border border-red-700"
          >
            <div className="flex items-center gap-3">
              <LogOut className="w-5 h-5 text-red-400" />
              <span className="text-red-200 font-medium">Cerrar sesión</span>
            </div>
            <span className="text-red-400">›</span>
          </button>
        </div>
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 bg-purple-800 border-t border-purple-700 shadow-lg">
        <div className="flex justify-around items-center h-20 px-4">
          <button
            onClick={() => navigate('/mi-perfil')}
            className="flex flex-col items-center justify-center w-16 h-16 text-yellow-400"
          >
            <Home className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Inicio</span>
          </button>

          <button
            onClick={() => navigate('/tareas')}
            className="flex flex-col items-center justify-center w-16 h-16 text-gray-400 hover:text-yellow-400"
          >
            <ListChecks className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Tareas</span>
          </button>

          <button
            onClick={handleWhatsApp}
            className="flex flex-col items-center justify-center w-16 h-16 text-gray-400 hover:text-yellow-400"
          >
            <MessageCircle className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Soporte</span>
          </button>

          <button
            onClick={() => navigate('/mi-equipo')}
            className="flex flex-col items-center justify-center w-16 h-16 text-gray-400 hover:text-yellow-400"
          >
            <Users className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Mi Equipo</span>
          </button>

          <button
            onClick={() => navigate('/niveles')}
            className="flex flex-col items-center justify-center w-16 h-16 text-gray-400 hover:text-yellow-400"
          >
            <Zap className="w-6 h-6" />
            <span className="text-xs mt-1 font-medium">Niveles</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default MyProfile;
