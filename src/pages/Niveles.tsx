import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabase';

interface NivelVIP {
  identificacion: string;
  nombre: string;
  precio: number;
  videosAlDía: number;
  gananciaAlVideo: number;
  gananciaAlDía: number;
  gananciaAlMes: number;
  deshabilitado: boolean;
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
  const [trialStatus, setTrialStatus] = useState<{ isActive: boolean; daysRemaining: number } | null>(null);
  const [loadingTrial, setLoadingTrial] = useState(false);

  const nivelesVIP: NivelVIP[] = [
    {
      identificacion: 'vip1',
      nombre: 'VIP 1',
      precio: 150000,
      videosAlDía: 5,
      gananciaAlVideo: 1200,
      gananciaAlDía: 6000,
      gananciaAlMes: 180000,
      deshabilitado: false
    },
    {
      identificacion: 'vip2',
      nombre: 'VIP 2',
      precio: 480000,
      videosAlDía: 10,
      gananciaAlVideo: 1600,
      gananciaAlDía: 16000,
      gananciaAlMes: 480000,
      deshabilitado: false
    },
    {
      identificacion: 'vip3',
      nombre: 'VIP 3',
      precio: 1300000,
      videosAlDía: 15,
      gananciaAlVideo: 2800,
      gananciaAlDía: 42000,
      gananciaAlMes: 1260000,
      deshabilitado: false
    },
    {
      identificacion: 'vip4',
      nombre: 'VIP 4',
      precio: 4700000,
      videosAlDía: 30,
      gananciaAlVideo: 5600,
      gananciaAlDía: 168000,
      gananciaAlMes: 5040000,
      deshabilitado: true
    },
    {
      identificacion: 'vip5',
      nombre: 'VIP 5',
      precio: 12800000,
      videosAlDía: 50,
      gananciaAlVideo: 9200,
      gananciaAlDía: 460000,
      gananciaAlMes: 13800000,
      deshabilitado: true
    },
    {
      identificacion: 'vip6',
      nombre: 'VIP 6',
      precio: 31000000,
      videosAlDía: 80,
      gananciaAlVideo: 14000,
      gananciaAlDía: 1120000,
      gananciaAlMes: 33600000,
      deshabilitado: true
    },
    {
      identificacion: 'vip7',
      nombre: 'VIP 7',
      precio: 67200000,
      videosAlDía: 150,
      gananciaAlVideo: 16000,
      gananciaAlDía: 2400000,
      gananciaAlMes: 72000000,
      deshabilitado: true
    },
    {
      identificacion: 'vip8',
      nombre: 'VIP 8',
      precio: 135000000,
      videosAlDía: 250,
      gananciaAlVideo: 20000,
      gananciaAlDía: 5000000,
      gananciaAlMes: 150000000,
      deshabilitado: true
    },
    {
      identificacion: 'vip9',
      nombre: 'VIP 9',
      precio: 325000000,
      videosAlDía: 500,
      gananciaAlVideo: 25000,
      gananciaAlDía: 12500000,
      gananciaAlMes: 375000000,
      deshabilitado: true
    }
  ];

  useEffect(() => {
    if (user?.id) {
      checkTrialStatus();
    }
  }, [user?.id]);

  const checkTrialStatus = async () => {
    if (!user?.id) return;

    try {
      const { data: userData } = await supabase
        .from('usuarios')
        .select('fecha_inicio_nivel_prueba')
        .eq('id', user.id)
        .maybeSingle();

      if (userData?.fecha_inicio_nivel_prueba) {
        const startDate = new Date(userData.fecha_inicio_nivel_prueba);
        const today = new Date();
        const daysPassed = Math.floor((today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

        if (daysPassed < 3) {
          setTrialStatus({ isActive: true, daysRemaining: 3 - daysPassed });
        } else {
          setTrialStatus({ isActive: false, daysRemaining: 0 });
        }
      }
    } catch (error) {
      console.error('Error checking trial status:', error);
    }
  };

  const handleJoinTrial = async () => {
    if (!user?.id) {
      navigate('/login');
      return;
    }

    setLoadingTrial(true);
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({ fecha_inicio_nivel_prueba: new Date().toISOString() })
        .eq('id', user.id);

      if (error) throw error;

      setTrialStatus({ isActive: true, daysRemaining: 3 });
      addToast('¡Bienvenido! Tienes 3 días para probar el sistema', 'success');
    } catch (error) {
      console.error('Error joining trial:', error);
      addToast('Error al activar el nivel practicante', 'error');
    } finally {
      setLoadingTrial(false);
    }
  };

  const addToast = (message: string, type: 'info' | 'warning' | 'success' | 'error' = 'info') => {
    const id = Date.now().toString();
    const toast: Toast = { id, message, type };
    setToasts(prev => [...prev, toast]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  const handlePurchase = async (nivelVIP: NivelVIP) => {
    if (nivelVIP.deshabilitado) {
      addToast('Por ahora este vip no está activado', 'warning');
      return;
    }

    if (!user?.id) {
      navigate('/login');
      return;
    }

    try {
      const { data: userData } = await supabase
        .from('usuarios')
        .select('videos_vistos_hoy, fecha_último_video')
        .eq('id', user.id)
        .maybeSingle();

      const today = new Date().toISOString().split('T')[0];
      const lastVideoDate = userData?.fecha_último_video ? userData.fecha_último_video.split('T')[0] : null;
      const videosWatchedToday = lastVideoDate === today ? userData?.videos_vistos_hoy || 0 : 0;

      if (videosWatchedToday >= nivelVIP.videosAlDía) {
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
        {/* Trial Level Card */}
        <div className="bg-gradient-to-br from-purple-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-purple-700 hover:border-purple-600 transition-all duration-300">
          {/* VIP Logo Section */}
          <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 py-8 flex items-center justify-center">
            <div className="text-5xl font-bold text-gray-900">NIVEL PRACTICANTE</div>
          </div>

          {/* Details Section */}
          <div className="p-6 space-y-4">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-purple-200 font-medium">Precio:</span>
                <span className="text-white font-bold">$0</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-200 font-medium">Videos por día:</span>
                <span className="text-white font-bold">(3)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-200 font-medium">Ganancia por video:</span>
                <span className="text-white font-bold">$1.000</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-purple-200 font-medium">Ganancia diaria:</span>
                <span className="text-white font-bold">$3.000</span>
              </div>
              <div className="flex justify-between items-center border-t border-purple-700 pt-3">
                <span className="text-yellow-400 font-bold">Duración:</span>
                <span className="text-yellow-400 font-bold">3 días</span>
              </div>
              {trialStatus?.isActive && (
                <div className="bg-green-600/20 border border-green-500 rounded-lg p-3">
                  <span className="text-green-300 text-sm font-medium">
                    Activo - {trialStatus.daysRemaining} días restantes
                  </span>
                </div>
              )}
            </div>

            {/* Join Button */}
            <button
              onClick={handleJoinTrial}
              disabled={trialStatus?.isActive || loadingTrial}
              className={`w-full mt-6 py-3 rounded-lg font-bold text-lg transition-all duration-300 ${
                trialStatus?.isActive
                  ? 'bg-gray-600 text-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:from-purple-500 hover:to-pink-500 shadow-lg hover:shadow-pink-500/50'
              }`}
            >
              {loadingTrial ? 'Procesando...' : trialStatus?.isActive ? 'Ya estás en prueba' : 'Participar'}
            </button>
          </div>
        </div>

        {nivelesVIP.map((vip) => (
          <div
            key={vip.identificacion}
            className="bg-gradient-to-br from-purple-800 to-gray-900 rounded-2xl overflow-hidden shadow-2xl border border-purple-700 hover:border-purple-600 transition-all duration-300"
          >
            {/* VIP Logo Section */}
            <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 py-8 flex items-center justify-center">
              <div className="text-5xl font-bold text-gray-900">{vip.nombre}</div>
            </div>

            {/* Details Section */}
            <div className="p-6 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-purple-200 font-medium">Precio:</span>
                  <span className="text-white font-bold">${vip.precio.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-200 font-medium">Videos por día:</span>
                  <span className="text-white font-bold">({vip.videosAlDía})</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-200 font-medium">Ganancia por video:</span>
                  <span className="text-white font-bold">${vip.gananciaAlVideo.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-200 font-medium">Ganancia diaria:</span>
                  <span className="text-white font-bold">${vip.gananciaAlDía.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center border-t border-purple-700 pt-3">
                  <span className="text-yellow-400 font-bold">Total mensual:</span>
                  <span className="text-yellow-400 font-bold">${vip.gananciaAlMes.toLocaleString()}</span>
                </div>
              </div>

              {/* Buy Button */}
              <button
                onClick={() => handlePurchase(vip)}
                disabled={vip.deshabilitado}
                className={`w-full mt-6 py-3 rounded-lg font-bold text-lg transition-all duration-300 ${
                  vip.deshabilitado
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
