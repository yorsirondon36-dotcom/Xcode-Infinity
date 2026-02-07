import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, TrendingUp, Coins, Users, Video } from 'lucide-react';

function FormasDeGanarPage() {
  const navigate = useNavigate();

  const formas = [
    {
      id: 1,
      titulo: 'Reglas de Inversión',
      descripcion: 'Consulta los niveles VIP y sus ingresos diarios',
      icono: TrendingUp,
      ruta: '/regles-inversion',
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 2,
      titulo: 'Recargas',
      descripcion: 'Realiza recargas para invertir en tu negocio',
      icono: Coins,
      ruta: '/recargas',
      color: 'from-yellow-500 to-yellow-600',
    },
    {
      id: 3,
      titulo: 'Referidos',
      descripcion: 'Gana comisiones invitando amigos a la plataforma',
      icono: Users,
      ruta: '/referidos',
      color: 'from-fuchsia-500 to-fuchsia-600',
    },
    {
      id: 4,
      titulo: 'Tareas',
      descripcion: 'Completa tareas diarias y gana comisiones',
      icono: Video,
      ruta: '/tareas',
      color: 'from-cyan-500 to-cyan-600',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-950 pb-24">
      <div className="bg-purple-800 px-6 py-6 shadow-sm flex items-center gap-4 border-b border-purple-700">
        <button onClick={() => navigate('/mi-perfil')} className="text-yellow-400 hover:text-yellow-500 transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-white">Formas de Ganar Dinero</h1>
      </div>

      <div className="p-6">
        <div className="mb-8">
          <p className="text-purple-200 text-center text-sm leading-relaxed">
            Descubre todas las formas disponibles para ganar dinero en nuestra plataforma
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formas.map((forma) => {
            const Icon = forma.icono;
            return (
              <button
                key={forma.id}
                onClick={() => navigate(forma.ruta)}
                className="group relative overflow-hidden rounded-2xl p-6 text-left shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-105"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${forma.color} opacity-90 group-hover:opacity-100 transition-opacity`}></div>

                <div className="relative z-10 flex items-start justify-between mb-4">
                  <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 group-hover:bg-white/30 transition-all">
                    <Icon className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-white/60 group-hover:text-white transition-colors">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>

                <h3 className="text-lg font-bold text-white mb-2 group-hover:text-yellow-200 transition-colors">
                  {forma.titulo}
                </h3>
                <p className="text-white/90 text-sm leading-relaxed">
                  {forma.descripcion}
                </p>

                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-white to-transparent opacity-20 group-hover:opacity-40 transition-opacity"></div>
              </button>
            );
          })}
        </div>

        <div className="mt-8 bg-purple-800 rounded-xl p-6 border border-purple-700">
          <p className="text-purple-200 text-sm leading-relaxed text-center">
            Elige la forma que mejor se adapte a ti y comienza a ganar dinero hoy mismo
          </p>
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

export default FormasDeGanarPage;
