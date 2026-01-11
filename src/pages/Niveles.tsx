import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface VipLevel {
  id: string;
  name: string;
  price: number;
  videosPerDay: number;
  earningPerVideo: number;
  dailyEarning: number;
  monthlyEarning: number;
  disabled: boolean;
}

interface Toast {
  id: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
}

function Niveles() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [toasts, setToasts] = useState<Toast[]>([]);

  const vipLevels: VipLevel[] = [
    {
      id: 'vip1',
      name: 'VIP 1',
      price: 120000,
      videosPerDay: 5,
      earningPerVideo: 800,
      dailyEarning: 4000,
      monthlyEarning: 120000,
      disabled: false
    },
    {
      id: 'vip2',
      name: 'VIP 2',
      price: 300000,
      videosPerDay: 10,
      earningPerVideo: 1000,
      dailyEarning: 10000,
      monthlyEarning: 300000,
      disabled: false
    },
    {
      id: 'vip3',
      name: 'VIP 3',
      price: 600000,
      videosPerDay: 15,
      earningPerVideo: 1400,
      dailyEarning: 21000,
      monthlyEarning: 630000,
      disabled: false
    },
    {
      id: 'vip4',
      name: 'VIP 4',
      price: 1000000,
      videosPerDay: 20,
      earningPerVideo: 1700,
      dailyEarning: 34000,
      monthlyEarning: 1020000,
      disabled: true
    }
  ];

  const addToast = (message: string, type: 'info' | 'warning' | 'success' | 'error' = 'info') => {
    const id = Date.now().toString();
    const toast: Toast = { id, message, type };
    setToasts(prev => [...prev, toast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handlePurchase = async (vipLevel: VipLevel) => {
    if (vipLevel.disabled) {
      addToast('Por ahora este vip no está activado', 'warning');
      return;
    }

    if (!user?.id) {
      navigate('/login');
      return;
    }

    try {
      const { data: userData } = await supabase
        .from('users')
        .select('videos_watched_today, last_video_date')
        .eq('id', user.id)
        .maybeSingle();

      const today = new Date().toISOString().split('T')[0];
      const lastVideoDate = userData?.last_video_date ? userData.last_video_date.split('T')[0] : null;
      const videosWatchedToday = lastVideoDate === today ? userData?.videos_watched_today || 0 : 0;

      if (videosWatchedToday >= vipLevel.videosPerDay) {
        addToast('Vuelve mañana', 'warning');
        return;
      }
    } catch (error) {
      console.error('Error checking video limit:', error);
    }

    navigate('/recargas');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-black pb-24">
      {/* Header */}
      <div className="bg-purple-800 px-6 py-6 shadow-sm flex items-center gap-4 border-b border-purple-700">
        <button onClick={() => navigate(-1)} className="text-yellow-400 hover:text-yellow-300">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-yellow-400">Membresías VIP</h1>
      </div>

      {/* VIP Cards Container */}
      <div className="px-6 py-8 space-y-6">
        {vipLevels.map((vip) => (
          <div
            key={vip.id}
            className="bg-gradient-to-br from-purple-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-purple-700 hover:border-purple-600 transition-all duration-300"
          >
            {/* VIP Logo Section */}
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 py-8 flex items-center justify-center">
              <div className="text-5xl font-bold text-gray-900">{vip.name}</div>
            </div>

            {/* Details Section */}
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-purple-200 font-medium">Precio:</span>
                  <span className="text-white font-bold">${vip.price.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-200 font-medium">Videos por día:</span>
                  <span className="text-white font-bold">({vip.videosPerDay})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-200 font-medium">Ganancia por video:</span>
                  <span className="text-white font-bold">${vip.earningPerVideo.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-200 font-medium">Ganancia diaria:</span>
                  <span className="text-white font-bold">${vip.dailyEarning.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center border-t border-purple-700 pt-3">
                  <span className="text-yellow-400 font-bold">Total mensual:</span>
                  <span className="text-yellow-400 font-bold">${vip.monthlyEarning.toLocaleString()}</span>
                </div>
              </div>

              {/* Buy Button */}
              <button
                onClick={() => handlePurchase(vip)}
                disabled={vip.disabled}
                className={`w-full mt-6 py-3 rounded-lg font-bold text-lg transition-all duration-300 ${
                  vip.disabled
                    ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 shadow-lg hover:shadow-pink-500/50'
                }`}
              >
                Comprar Ahora
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Toast Notifications */}
      <div className="fixed bottom-24 right-6 space-y-3 z-50">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            className={`px-6 py-4 rounded-lg shadow-lg flex items-center gap-3 max-w-sm animate-slide-in ${
              toast.type === 'warning'
                ? 'bg-yellow-600 text-white'
                : toast.type === 'success'
                ? 'bg-green-600 text-white'
                : toast.type === 'error'
                ? 'bg-red-600 text-white'
                : 'bg-blue-600 text-white'
            }`}
          >
            <span className="flex-1">{toast.message}</span>
            <button
              onClick={() => setToasts(prev => prev.filter(t => t.id !== toast.id))}
              className="hover:opacity-80"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Niveles;
