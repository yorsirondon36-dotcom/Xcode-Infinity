import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Users, Award, TrendingUp } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface UserData {
  referral_code: string;
  total_income: number;
  referred_users_count: number;
}

function ReferralRegistry() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userData, setUserData] = useState<UserData>({
    referral_code: '',
    total_income: 0,
    referred_users_count: 0
  });
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user?.id) {
      loadUserData();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      const { data: userProfile, error } = await supabase
        .from('users')
        .select('referral_code, total_income')
        .eq('id', user?.id)
        .maybeSingle();

      if (error) throw error;

      const { count: referralCount } = await supabase
        .from('referrals')
        .select('*', { count: 'exact', head: true })
        .eq('referrer_id', user?.id);

      if (userProfile) {
        setUserData({
          referral_code: userProfile.referral_code || 'Generando...',
          total_income: userProfile.total_income || 0,
          referred_users_count: referralCount || 0
        });
      }
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const commissionA = userData.total_income * 0.15;
  const commissionB = userData.total_income * 0.10;
  const commissionC = userData.total_income * 0.05;

  const copyLink = async () => {
    const url = `${window.location.origin}/join?ref=${userData.referral_code}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Error copying to clipboard:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-950 pb-24 flex items-center justify-center">
        <p className="text-yellow-400">Cargando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-950 pb-24">
      <div className="bg-purple-800 px-6 py-6 shadow-sm flex items-center gap-4 border-b border-purple-700">
        <button onClick={() => navigate(-1)} className="text-yellow-400 hover:text-yellow-300">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-yellow-400">Registro de Referidos</h1>
      </div>

      <div className="p-6 space-y-6 max-w-2xl mx-auto">
        <div className="bg-purple-800 rounded-xl p-6 shadow-md border border-purple-700">
          <p className="text-purple-200 text-sm font-semibold mb-3">TU CÓDIGO DE REFERIDO</p>
          <div className="flex gap-3">
            <div className="flex-1 bg-purple-900 px-4 py-3 rounded-lg border-2 border-purple-700 text-yellow-400 font-mono font-bold overflow-hidden">
              {userData.referral_code}
            </div>
            <button
              onClick={copyLink}
              className={`px-6 py-3 rounded-lg font-bold transition-all duration-200 flex items-center gap-2 ${
                copied
                  ? 'bg-green-500 text-white'
                  : 'bg-orange-500 hover:bg-orange-600 text-white'
              }`}
            >
              <Copy className="w-5 h-5" />
              <span className="hidden sm:inline">{copied ? 'Copiado' : 'COPIAR'}</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-xl p-5 shadow-md border-l-4 border-orange-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-yellow-400 uppercase">Grupo A</h3>
              <span className="bg-orange-500/30 text-orange-400 text-xs px-3 py-1 rounded-full font-bold">15%</span>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-purple-300 text-xs font-semibold mb-1">REFERIDOS</p>
                <p className="text-3xl font-bold text-white">{userData.referred_users_count}</p>
              </div>
              <div className="pt-3 border-t border-purple-700">
                <p className="text-purple-300 text-xs font-semibold mb-1">COMISIÓN</p>
                <p className="text-2xl font-bold text-orange-400">${commissionA.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-xl p-5 shadow-md border-l-4 border-blue-500">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-yellow-400 uppercase">Grupo B</h3>
              <span className="bg-blue-500/30 text-blue-400 text-xs px-3 py-1 rounded-full font-bold">10%</span>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-purple-300 text-xs font-semibold mb-1">REFERIDOS</p>
                <p className="text-3xl font-bold text-white">{Math.floor(userData.referred_users_count * 0.6)}</p>
              </div>
              <div className="pt-3 border-t border-purple-700">
                <p className="text-purple-300 text-xs font-semibold mb-1">COMISIÓN</p>
                <p className="text-2xl font-bold text-blue-400">${commissionB.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-800 to-purple-900 rounded-xl p-5 shadow-md border-l-4 border-emerald-500 sm:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-yellow-400 uppercase">Grupo C</h3>
              <span className="bg-emerald-500/30 text-emerald-400 text-xs px-3 py-1 rounded-full font-bold">5%</span>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-purple-300 text-xs font-semibold mb-1">REFERIDOS</p>
                <p className="text-3xl font-bold text-white">{Math.floor(userData.referred_users_count * 0.3)}</p>
              </div>
              <div>
                <p className="text-purple-300 text-xs font-semibold mb-1">COMISIÓN</p>
                <p className="text-2xl font-bold text-emerald-400">${commissionC.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-purple-800 rounded-xl p-5 shadow-md border border-purple-700">
          <div className="flex items-center gap-3 mb-4">
            <Award className="w-6 h-6 text-yellow-400" />
            <h3 className="text-lg font-bold text-yellow-400">RESUMEN DE INGRESOS</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center pb-3 border-b border-purple-600">
              <p className="text-purple-300">Total generado</p>
              <p className="text-2xl font-bold text-yellow-400">${userData.total_income.toLocaleString('es-CO', { minimumFractionDigits: 2 })}</p>
            </div>
            <div className="flex justify-between items-center">
              <p className="text-purple-300 flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-400" />
                Total referidos
              </p>
              <p className="text-xl font-bold text-orange-400">{userData.referred_users_count}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ReferralRegistry;
