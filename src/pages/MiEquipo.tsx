import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { ArrowLeft } from 'lucide-react';

interface Referido {
  id: string;
}

const MiEquipo = () => {
  const [referidosA, setReferidosA] = useState<Referido[]>([]);
  const [referidosB, setReferidosB] = useState<Referido[]>([]);
  const [referidosC, setReferidosC] = useState<Referido[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReferidos();
  }, []);

  const fetchReferidos = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData.user) {
        throw new Error("Usuario no autenticado o error de sesión.");
      }
      const userId = userData.user.id;

      const { data: dataA, error: errorA } = await supabase
        .from('profiles')
        .select('id')
        .eq('referred_by', userId);

      if (errorA) throw errorA;
      setReferidosA(dataA || []);

      setReferidosB([]);
      setReferidosC([]);

    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido al cargar referidos");
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    if (typeof window !== 'undefined') {
      window.history.back();
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100">
        <p className="text-gray-600">Cargando equipo...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-blue-50 to-blue-100">
        <p className="text-red-500">Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 pb-24">
      <div className="bg-white px-6 py-6 shadow-sm flex items-center gap-4">
        <button onClick={handleBack} className="text-blue-600 hover:text-blue-700">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-gray-800">Mi Equipo</h1>
      </div>

      <div className="p-6 space-y-6">
        <section className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3 text-blue-600">Nivel A (15%)</h2>
          {referidosA.length > 0 ? (
            <ul className="space-y-2">
              {referidosA.map((referido) => (
                <li key={referido.id} className="p-2 rounded-md bg-gray-50">
                  ID: {referido.id}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">Sin referidos de nivel A.</p>
          )}
          <p className="mt-2 font-semibold text-gray-700">Comisión ganada: $0.00</p>
        </section>

        <section className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3 text-green-600">Nivel B (10%)</h2>
          <p className="text-gray-600">Sin referidos de nivel B.</p>
          <p className="mt-2 font-semibold text-gray-700">Comisión ganada: $0.00</p>
        </section>

        <section className="bg-white p-4 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-3 text-amber-600">Nivel C (5%)</h2>
          <p className="text-gray-600">Sin referidos de nivel C.</p>
          <p className="mt-2 font-semibold text-gray-700">Comisión ganada: $0.00</p>
        </section>
      </div>
    </div>
  );
};

export default MiEquipo;
