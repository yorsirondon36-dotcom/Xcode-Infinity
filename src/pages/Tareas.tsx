import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface TareaVideo {
  identificacion: string;
  título: string;
  url_imagen: string;
  url_video: string;
  recompensa: number;
  duración_segundos: number;
}

interface VideoCompletado {
  id_tarea_video: string;
  completado_en: string;
}

function Tareas() {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [tareasVideos, setTareasVideos] = useState<TareaVideo[]>([]);
  const [videosCompletados, setVideosCompletados] = useState<VideoCompletado[]>([]);
  const [currentVideoIndex, setCurrentVideoIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [showRating, setShowRating] = useState(false);
  const [selectedRating, setSelectedRating] = useState(0);
  const [loading, setLoading] = useState(true);
  const [dailyLimitReached, setDailyLimitReached] = useState(false);
  const [levelInfo, setLevelInfo] = useState<any>(null);
  const [todayEarnings, setTodayEarnings] = useState(0);

  useEffect(() => {
    if (user) {
      loadData();
    }
  }, [user]);

  useEffect(() => {
    if (isPlaying && timeRemaining > 0) {
      const interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setIsPlaying(false);
            setShowRating(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, timeRemaining]);

  const loadData = async () => {
    if (!user) return;

    try {
      setLoading(true);

      const { data: level } = await supabase
        .from('niveles')
        .select('*')
        .eq('identificacion', userProfile?.id_nivel_actual)
        .maybeSingle();

      if (level) {
        setLevelInfo(level);
      }

      const { data: tasks } = await supabase
        .from('tareas_videos')
        .select('*')
        .eq('esta_activo', true)
        .order('creado_en', { ascending: true });

      if (tasks) {
        setTareasVideos(tasks);
      }

      const today = new Date().toISOString().split('T')[0];
      const { data: completed } = await supabase
        .from('historial_videos_usuarios')
        .select('id_tarea_video, completado_en')
        .eq('id_usuario', user.id)
        .gte('completado_en', `${today}T00:00:00`);

      if (completed) {
        setVideosCompletados(completed);
        setTodayEarnings(completed.length * (level?.ganancia_por_video || 500));
      }

      if (level && completed && completed.length >= level.videos_diarios_limitados) {
        setDailyLimitReached(true);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const startVideo = (index: number) => {
    if (!dailyLimitReached && !isVideoCompleted(tareasVideos[index]?.identificacion)) {
      setCurrentVideoIndex(index);
      setTimeRemaining(tareasVideos[index].duración_segundos || 60);
      setIsPlaying(true);
      setShowRating(false);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
    }
  };

  const isVideoCompleted = (videoId: string) => {
    return videosCompletados.some(cv => cv.id_tarea_video === videoId);
  };

  const handleRating = async (rating: number) => {
    if (!user || !levelInfo) return;

    try {
      setSelectedRating(rating);

      const currentVideo = tareasVideos[currentVideoIndex];
      const reward = levelInfo.ganancia_por_video;

      await supabase.from('historial_videos_usuarios').insert({
        id_usuario: user.id,
        id_tarea_video: currentVideo.identificacion,
        ganancias_recibidas: reward,
        calificación: rating
      });

      await supabase
        .from('usuarios')
        .update({
          saldo: (userProfile?.saldo || 0) + reward,
          ganancias_hoy: todayEarnings + reward,
          videos_vistos_hoy: (userProfile?.videos_vistos_hoy || 0) + 1
        })
        .eq('id', user.id);

      if (userProfile?.referido_por_codigo) {
        const { data: referrer } = await supabase
          .from('usuarios')
          .select('id, id_nivel_actual')
          .eq('código_referido', userProfile.referido_por_codigo)
          .maybeSingle();

        if (referrer) {
          const { data: referrerLevel } = await supabase
            .from('niveles')
            .select('porcentaje_comisión_referido')
            .eq('identificacion', referrer.id_nivel_actual)
            .maybeSingle();

          if (referrerLevel) {
            const commission = (reward * referrerLevel.porcentaje_comisión_referido) / 100;
            await supabase
              .from('usuarios')
              .update({ saldo: (await supabase.from('usuarios').select('saldo').eq('id', referrer.id).maybeSingle()).data?.saldo + commission })
              .eq('id', referrer.id);

            await supabase.from('ganancias_referidos').insert({
              id_usuario_referidor: referrer.id,
              id_usuario_referido: user.id,
              monto_comisión: commission
            });
          }
        }
      }

      setVideosCompletados([...videosCompletados, { id_tarea_video: currentVideo.identificacion, completado_en: new Date().toISOString() }]);
      setTodayEarnings(todayEarnings + reward);
      setShowRating(false);

      if (videosCompletados.length + 1 >= levelInfo.videos_diarios_limitados) {
        setDailyLimitReached(true);
      }

      setTimeout(() => {
        const nextIncompleteIndex = tareasVideos.findIndex((v, i) => i > currentVideoIndex && !isVideoCompleted(v.identificacion));
        if (nextIncompleteIndex !== -1) {
          startVideo(nextIncompleteIndex);
        }
      }, 1000);
    } catch (error) {
      console.error('Error al procesar calificación:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center pb-24">
        <div className="text-white text-xl">Cargando tareas...</div>
      </div>
    );
  }

  const currentVideo = tareasVideos[currentVideoIndex];

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 pb-24">
      <div className="bg-slate-800 px-6 py-4 shadow-sm flex items-center gap-4 border-b border-slate-700">
        <button
          onClick={() => navigate(-1)}
          className="text-yellow-400 hover:text-yellow-300 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-yellow-400">Tareas de Video</h1>
          <p className="text-sm text-slate-300">Gana dinero viendo videos</p>
        </div>
      </div>

      <div className="p-6 space-y-6 max-w-2xl mx-auto">
        {dailyLimitReached ? (
          <div className="bg-gradient-to-r from-emerald-900/50 to-emerald-800/50 border border-emerald-500 rounded-lg p-6 text-center">
            <h2 className="text-2xl font-bold text-emerald-300 mb-2">¡Felicidades!</h2>
            <p className="text-emerald-200 mb-4">
              Has completado tu límite diario de {levelInfo?.videos_diarios_limitados} videos
            </p>
            <p className="text-lg font-semibold text-yellow-400">
              Hoy ganaste: COP {todayEarnings.toLocaleString('es-CO')}
            </p>
            <p className="text-sm text-slate-300 mt-4">Vuelve mañana o sube de nivel para ganar más</p>
          </div>
        ) : (
          <>
            <div className="bg-slate-800 rounded-lg overflow-hidden shadow-lg border border-slate-700">
              <div className="relative aspect-video bg-black">
                <video
                  ref={videoRef}
                  src={currentVideo?.url_video}
                  className="w-full h-full object-cover"
                  onEnded={() => {
                    setIsPlaying(false);
                    setShowRating(true);
                  }}
                />

                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="bg-yellow-400 hover:bg-yellow-500 text-slate-900 rounded-full p-4 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                  </button>
                </div>

                <div className="absolute top-4 right-4 bg-slate-900/80 px-4 py-2 rounded-lg border border-slate-700">
                  <p className="text-white font-bold">{Math.floor(timeRemaining / 60)}:{String(timeRemaining % 60).padStart(2, '0')}</p>
                </div>
              </div>

              <div className="p-4 space-y-2">
                <h2 className="text-xl font-bold text-white">{currentVideo?.título}</h2>
                <p className="text-lg font-semibold text-yellow-400">
                  +COP {levelInfo?.ganancia_por_video.toLocaleString('es-CO')} por completar
                </p>
                {showRating && (
                  <div className="flex gap-3 mt-4">
                    {[1, 2, 3, 4, 5].map(star => (
                      <button
                        key={star}
                        onClick={() => handleRating(star)}
                        className={`transition-all transform hover:scale-110 ${
                          selectedRating >= star
                            ? 'text-yellow-400 scale-110'
                            : 'text-slate-500'
                        }`}
                      >
                        <Star className="w-8 h-8 fill-current" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white mb-4">
                Más videos ({tareasVideos.length - videosCompletados.length} disponibles)
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {tareasVideos.map((video, index) => {
                  const isCompleted = isVideoCompleted(video.identificacion);
                  const isActive = index === currentVideoIndex;

                  return (
                    <div
                      key={video.identificacion}
                      onClick={() => !isCompleted && startVideo(index)}
                      className={`flex gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                        isCompleted
                          ? 'opacity-50 bg-slate-800/50 border border-slate-700'
                          : isActive
                          ? 'bg-yellow-400/20 border border-yellow-400'
                          : 'bg-slate-800 border border-slate-700 hover:border-yellow-400'
                      }`}
                    >
                      <img
                        src={video.url_imagen}
                        alt={video.título}
                        className="w-16 h-16 rounded object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm truncate">{video.título}</p>
                        <p className="text-yellow-400 text-sm font-bold">+COP {video.recompensa.toLocaleString('es-CO')}</p>
                        {isCompleted && <p className="text-emerald-400 text-xs mt-1">✓ Completado</p>}
                      </div>
                      {isCompleted && (
                        <div className="flex items-center text-emerald-400">
                          <Star className="w-5 h-5 fill-current" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
              <p className="text-slate-300 text-sm">
                Hoy ganaste: <span className="text-yellow-400 font-bold text-lg">COP {todayEarnings.toLocaleString('es-CO')}</span>
              </p>
              <p className="text-slate-400 text-xs mt-2">
                {levelInfo?.videos_diarios_limitados - videosCompletados.length} videos restantes de tu límite diario
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Tareas;
