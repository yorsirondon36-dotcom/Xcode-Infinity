import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Coins, TrendingUp } from 'lucide-react';

function ReglesInversionPage() {
  const navigate = useNavigate();

  const levels = [
    { name: 'Practicante', deposit: 0, tasks: 3, dailyIncome: 1000, dailyIncome30: 3000, salary30: 0, salary360: 0 },
    { name: 'VIP1', deposit: '150,000', tasks: 5, dailyIncome: 1200, dailyIncome30: 6000, salary30: '180,000', salary360: '2,160,000' },
    { name: 'VIP2', deposit: '480,000', tasks: 10, dailyIncome: 1600, dailyIncome30: 16000, salary30: '480,000', salary360: '5,760,000' },
    { name: 'VIP3', deposit: '1,300,000', tasks: 15, dailyIncome: 2800, dailyIncome30: 42000, salary30: '1,260,000', salary360: '15,120,000' },
    { name: 'VIP4', deposit: '4,700,000', tasks: 30, dailyIncome: 5600, dailyIncome30: 168000, salary30: '5,040,000', salary360: '60,480,000' },
    { name: 'VIP5', deposit: '12,800,000', tasks: 50, dailyIncome: 9200, dailyIncome30: 460000, salary30: '13,800,000', salary360: '165,600,000' },
    { name: 'VIP6', deposit: '31,000,000', tasks: 80, dailyIncome: 14000, dailyIncome30: 1120000, salary30: '33,600,000', salary360: '403,200,000' },
    { name: 'VIP7', deposit: '67,200,000', tasks: 150, dailyIncome: 16000, dailyIncome30: 2400000, salary30: '72,000,000', salary360: '864,000,000' },
    { name: 'VIP8', deposit: '135,000,000', tasks: 250, dailyIncome: 20000, dailyIncome30: 5000000, salary30: '150,000,000', salary360: '1,800,000,000' },
    { name: 'VIP9', deposit: '325,000,000', tasks: 500, dailyIncome: 25000, dailyIncome30: 12500000, salary30: '375,000,000', salary360: '4,500,000,000' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-950 pb-24">
      <div className="bg-purple-800 px-6 py-6 shadow-sm flex items-center gap-4 border-b border-purple-700">
        <button
          onClick={() => navigate(-1)}
          className="text-yellow-400 hover:text-yellow-500 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-white">Reglas de Inversión</h1>
      </div>

      <div className="px-6 py-8">
        <div className="mb-8 flex items-center justify-center gap-3">
          <Coins className="w-8 h-8 text-yellow-400" />
          <h2 className="text-3xl font-bold text-center text-white">Reglas de Ingresos de Inversión</h2>
          <TrendingUp className="w-8 h-8 text-fuchsia-400" />
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-t-lg p-6 border-2 border-yellow-400">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-blue-800 border-b-2 border-yellow-400">
                  <th className="px-4 py-3 text-left font-bold text-white border-r border-yellow-300">Sistema de Niveles</th>
                  <th className="px-4 py-3 text-center font-bold text-white border-r border-yellow-300">Depósito</th>
                  <th className="px-4 py-3 text-center font-bold text-white border-r border-yellow-300">Número de Tareas</th>
                  <th className="px-4 py-3 text-center font-bold text-white border-r border-yellow-300">Ingreso 30D</th>
                  <th className="px-4 py-3 text-center font-bold text-white border-r border-yellow-300">Ingreso Diario</th>
                  <th className="px-4 py-3 text-center font-bold text-white border-r border-yellow-300">Salario 30 Días</th>
                  <th className="px-4 py-3 text-center font-bold text-white">Salario 360 Días</th>
                </tr>
              </thead>
              <tbody>
                {levels.map((level, index) => (
                  <tr
                    key={index}
                    className={`border-b border-yellow-300 ${
                      index % 2 === 0 ? 'bg-yellow-50' : 'bg-yellow-100'
                    }`}
                  >
                    <td className="px-4 py-3 font-bold text-gray-900 border-r border-yellow-300">{level.name}</td>
                    <td className="px-4 py-3 text-center text-gray-900 font-semibold border-r border-yellow-300">{level.deposit}</td>
                    <td className="px-4 py-3 text-center text-gray-900 font-semibold border-r border-yellow-300">{level.tasks}</td>
                    <td className="px-4 py-3 text-center text-gray-900 font-semibold border-r border-yellow-300">{level.dailyIncome.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center text-gray-900 font-semibold border-r border-yellow-300">{level.dailyIncome30.toLocaleString()}</td>
                    <td className="px-4 py-3 text-center text-gray-900 font-semibold border-r border-yellow-300">{level.salary30}</td>
                    <td className="px-4 py-3 text-center text-gray-900 font-semibold">{level.salary360}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-b-lg px-6 py-4 border-2 border-t-0 border-yellow-400">
          <p className="text-white text-sm text-center leading-relaxed">
            El período de prácticas es de 3 días. No se requiere depósito durante las prácticas.<br/>
            Puedes ganar una comisión de 3000 pesos colombianos diarios completando tareas.
          </p>
        </div>

        <div className="mt-8 bg-purple-800 rounded-xl p-6 border border-purple-700">
          <div className="space-y-3">
            <div className="flex items-start gap-3">
              <div className="bg-fuchsia-400 rounded-full w-2 h-2 mt-2 flex-shrink-0"></div>
              <p className="text-purple-100 text-sm">Los montos mostrados son en pesos colombianos</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-fuchsia-400 rounded-full w-2 h-2 mt-2 flex-shrink-0"></div>
              <p className="text-purple-100 text-sm">Los ingresos diarios se calculan al completar el número de tareas requeridas</p>
            </div>
            <div className="flex items-start gap-3">
              <div className="bg-fuchsia-400 rounded-full w-2 h-2 mt-2 flex-shrink-0"></div>
              <p className="text-purple-100 text-sm">Sube de nivel invirtiendo en tu desarrollo profesional</p>
            </div>
          </div>
        </div>
      </div>

      <div className="fixed bottom-6 left-6 right-6">
        <button
          onClick={() => navigate(-1)}
          className="w-full py-4 rounded-xl font-bold text-lg bg-yellow-400 text-purple-900 hover:bg-yellow-500 shadow-lg transition-all duration-200"
        >
          Volver
        </button>
      </div>
    </div>
  );
}

export default ReglesInversionPage;
