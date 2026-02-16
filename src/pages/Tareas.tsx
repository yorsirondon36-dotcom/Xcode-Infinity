import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Play, Pause, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface VideoTask {
  id: string;
  title: string;
  image_url: string;
  video_url: string;
  reward: number;
  duration_seconds: number;
}

interface CompletedVideo {
  video_task_id: string;
  completed_at: string;
}

function Tareas() {
  const navigate = useNavigate();
  const { user, userProfile } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [videoTasks, setVideoTasks] = useState<VideoTask[]>([]);
  const [completedVideos, setCompletedVideos] = useState<CompletedVideo[]>([]);
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
        .from('levels')
        .select('*')
        .eq('id', userProfile?.current_level_id)
        .maybeSingle();

      if (level) {
        setLevelInfo(level);
      }

      const { data: tasks } = await supabase
        .from('video_tasks')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: true });

      if (tasks) {
        setVideoTasks(tasks);
      }

      const today = new Date().toISOString().split('T')[0];
      const { data: completed } = await supabase
        .from('user_video_history')
        .select('video_task_id, completed_at')
        .eq('user_id', user.id)
        .gte('completed_at', `${today}T00:00:00`);

      if (completed) {
        setCompletedVideos(completed);
        setTodayEarnings(completed.length * (level?.earnings_per_video || 500));
      }

      if (level && completed && completed.length >= level.daily_video_limit) {
        setDailyLimitReached(true);
      }
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const startVideo = (index: number) => {
    if (!dailyLimitReached && !isVideoCompleted(videoTasks[index]?.id)) {
      setCurrentVideoIndex(index);
      setTimeRemaining(videoTasks[index].duration_seconds || 60);
      setIsPlaying(true);
      setShowRating(false);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
      }
    }
  };

  const isVideoCompleted = (videoId: string) => {
    return completedVideos.some(cv => cv.video_task_id === videoId);
  };

  const handleRating = async (rating: number) => {
    if (!user || !levelInfo) return;

    try {
      setSelectedRating(rating);

      const currentVideo = videoTasks[currentVideoIndex];
      const reward = levelInfo.earnings_per_video;

      await supabase.from('user_video_history').insert({
        user_id: user.id,
        video_task_id: currentVideo.id,
        earnings_received: reward,
        rating
      });

      await supabase
        .from('users')
        .update({
          balance: (userProfile?.balance || 0) + reward,
          today_earnings: todayEarnings + reward,
          videos_watched_today: (userProfile?.videos_watched_today || 0) + 1
        })
        .eq('id', user.id);

      if (userProfile?.referred_by_code) {
        const { data: referrer } = await supabase
          .from('users')
          .select('id, current_level_id')
          .eq('referral_code', userProfile.referred_by_code)
          .maybeSingle();

        if (referrer) {
          const { data: referrerLevel } = await supabase
            .from('levels')
            .select('referral_commission_percentage')
            .eq('id', referrer.current_level_id)
            .maybeSingle();

          if (referrerLevel) {
            const commission = (reward * referrerLevel.referral_commission_percentage) / 100;
            await supabase
              .from('users')
              .update({ balance: (await supabase.from('users').select('balance').eq('id', referrer.id).maybeSingle()).data?.balance + commission })
              .eq('id', referrer.id);

            await supabase.from('referral_earnings').insert({
              referrer_user_id: referrer.id,
              referral_user_id: user.id,
              commission_amount: commission
            });
          }
        }
      }

      setCompletedVideos([...completedVideos, { video_task_id: currentVideo.id, completed_at: new Date().toISOString() }]);
      setTodayEarnings(todayEarnings + reward);
      setShowRating(false);

      if (completedVideos.length + 1 >= levelInfo.daily_video_limit) {
        setDailyLimitReached(true);
      }

      setTimeout(() => {
        const nextIncompleteIndex = videoTasks.findIndex((v, i) => i > currentVideoIndex && !isVideoCompleted(v.id));
        if (nextIncompleteIndex !== -1) {
          startVideo(nextIncompleteIndex);
        }
      }, 1000);
    } catch (error) {
      console.error('Error processing rating:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-950 flex items-center justify-center pb-24">
        <div className="text-white text-xl">Cargando tareas...</div>
      </div>
    );
  }

  const currentVideo = videoTasks[currentVideoIndex];

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
              Has completado tu límite diario de {levelInfo?.daily_video_limit} videos
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
                  src={currentVideo?.video_url}
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
                <h2 className="text-xl font-bold text-white">{currentVideo?.title}</h2>
                <p className="text-lg font-semibold text-yellow-400">
                  +COP {levelInfo?.earnings_per_video.toLocaleString('es-CO')} por completar
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
                Más videos ({videoTasks.length - completedVideos.length} disponibles)
              </h3>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {videoTasks.map((video, index) => {
                  const isCompleted = isVideoCompleted(video.id);
                  const isActive = index === currentVideoIndex;

                  return (
                    <div
                      key={video.id}
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
                        src={video.image_url}
                        alt={video.title}
                        className="w-16 h-16 rounded object-cover flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-semibold text-sm truncate">{video.title}</p>
                        <p className="text-yellow-400 text-sm font-bold">+COP {video.reward.toLocaleString('es-CO')}</p>
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
                {levelInfo?.daily_video_limit - completedVideos.length} videos restantes de tu límite diario
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Tareas;
