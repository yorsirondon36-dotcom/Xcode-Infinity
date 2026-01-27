import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Users, Zap } from 'lucide-react';

interface Referido {
  id: string;
  email?: string;
  created_at?: string;
}

interface EquipoStats {
  nivelA: Referido[];
  nivelB: Referido[];
  nivelC: Referido[];
  comisionA: number;
  comisionB: number;
  comisionC: number;
}

const MiEquipo = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState<EquipoStats>({
    nivelA: [],
    nivelB: [],
    nivelC: [],
    comisionA: 0,
    comisionB: 0,
    comisionC: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user?.id) {
      fetchEquipoData();
    }
  }, [user]);

  const fetchEquipoData = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: referidos, error: refError } = await supabase
        .from('referrals')
        .select('id, referree_id, level')
        .eq('referrer_id', user?.id);

      if (refError) throw refError;

      const nivelA = referidos?.filter(r => r.level === 'A') || [];
      const nivelB = referidos?.filter(r => r.level === 'B') || [];
      const nivelC = referidos?.filter(r => r.level === 'C') || [];

      setStats({
        nivelA,
        nivelB,
        nivelC,
        comisionA: nivelA.length * 0,
        comisionB: nivelB.length * 0,
        comisionC: nivelC.length * 0
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar equipo');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-950 pb-24 flex items-center justify-center">
        <p className="text-yellow-400">Cargando equipo...</p>
      </div>
    );
  }

  const totalReferidos = stats.nivelA.length + stats.nivelB.length + stats.nivelC.length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-950 pb-24">
      <div className="bg-purple-800 px-6 py-6 shadow-sm flex items-center gap-4 border-b border-purple-700">
        <button onClick={() => navigate(-1)} className="text-yellow-400 hover:text-yellow-300">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-yellow-400">Mi Equipo</h1>
      </div>

      {error && (
        <div className="m-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
          {error}
        </div>
      )}

      <div className="p-6 space-y-6 max-w-2xl mx-auto">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-purple-800 rounded-xl p-5 shadow-md border-t-4 border-orange-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-purple-300 text-sm font-semibold">GRUPO A</p>
              <span className="bg-orange-500/20 text-orange-400 text-xs px-2 py-1 rounded-full font-bold">15%</span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{stats.nivelA.length}</p>
            <p className="text-yellow-400 text-xs font-semibold">Referidos directos</p>
          </div>

          <div className="bg-purple-800 rounded-xl p-5 shadow-md border-t-4 border-blue-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-purple-300 text-sm font-semibold">GRUPO B</p>
              <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-full font-bold">10%</span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{stats.nivelB.length}</p>
            <p className="text-yellow-400 text-xs font-semibold">Nivel indirecto</p>
          </div>

          <div className="bg-purple-800 rounded-xl p-5 shadow-md border-t-4 border-emerald-500">
            <div className="flex items-center justify-between mb-2">
              <p className="text-purple-300 text-sm font-semibold">GRUPO C</p>
              <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2 py-1 rounded-full font-bold">5%</span>
            </div>
            <p className="text-3xl font-bold text-white mb-1">{stats.nivelC.length}</p>
            <p className="text-yellow-400 text-xs font-semibold">Nivel lejano</p>
          </div>
        </div>

        <div className="bg-purple-800 rounded-xl p-6 shadow-md border border-purple-700">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-6 h-6 text-yellow-400" />
            <h2 className="text-xl font-bold text-yellow-400">RESUMEN GENERAL</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-purple-900/50 px-4 py-3 rounded-lg">
              <p className="text-purple-300 text-sm mb-1">Total equipo</p>
              <p className="text-3xl font-bold text-white">{totalReferidos}</p>
            </div>
            <div className="bg-purple-900/50 px-4 py-3 rounded-lg">
              <p className="text-purple-300 text-sm mb-1">Comisión total</p>
              <p className="text-3xl font-bold text-orange-400">
                ${(stats.comisionA + stats.comisionB + stats.comisionC).toLocaleString('es-CO')}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
            <Zap className="w-6 h-6" /> Detalles por nivel
          </h2>

          <div className="bg-purple-800/50 rounded-xl p-5 border border-purple-700">
            <h3 className="text-orange-400 font-bold mb-3 flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-500 rounded-full" />
              Grupo A - 15% Comisión ({stats.nivelA.length} referidos)
            </h3>
            {stats.nivelA.length > 0 ? (
              <ul className="space-y-2">
                {stats.nivelA.map((ref) => (
                  <li key={ref.id} className="p-2 rounded bg-purple-900/50 text-purple-200 text-sm">
                    {ref.email || ref.id}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-purple-300 text-sm">Sin referidos aún</p>
            )}
          </div>

          <div className="bg-purple-800/50 rounded-xl p-5 border border-purple-700">
            <h3 className="text-blue-400 font-bold mb-3 flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full" />
              Grupo B - 10% Comisión ({stats.nivelB.length} referidos)
            </h3>
            {stats.nivelB.length > 0 ? (
              <ul className="space-y-2">
                {stats.nivelB.map((ref) => (
                  <li key={ref.id} className="p-2 rounded bg-purple-900/50 text-purple-200 text-sm">
                    {ref.email || ref.id}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-purple-300 text-sm">Sin referidos aún</p>
            )}
          </div>

          <div className="bg-purple-800/50 rounded-xl p-5 border border-purple-700">
            <h3 className="text-emerald-400 font-bold mb-3 flex items-center gap-2">
              <div className="w-3 h-3 bg-emerald-500 rounded-full" />
              Grupo C - 5% Comisión ({stats.nivelC.length} referidos)
            </h3>
            {stats.nivelC.length > 0 ? (
              <ul className="space-y-2">
                {stats.nivelC.map((ref) => (
                  <li key={ref.id} className="p-2 rounded bg-purple-900/50 text-purple-200 text-sm">
                    {ref.email || ref.id}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-purple-300 text-sm">Sin referidos aún</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MiEquipo;
