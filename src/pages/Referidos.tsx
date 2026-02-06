import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Copy, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface Commission {
  id: string;
  commission_type: 'purchase' | 'video';
  referrer_level: number;
  amount: number;
  source_user_id: string;
  created_at: string;
}

function Referidos() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [referralCode, setReferralCode] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [copiedCode, setCopiedCode] = useState(false);

  useEffect(() => {
    if (!user) return;
    fetchData();
  }, [user]);

  const fetchData = async () => {
    if (!user) return;
    try {
      const { data: userData } = await supabase
        .from('users')
        .select('referral_code')
        .eq('id', user.id)
        .single();

      if (userData?.referral_code) {
        setReferralCode(userData.referral_code);
      }

      const { data: commissionsData } = await supabase
        .from('referral_commissions')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (commissionsData) {
        setCommissions(commissionsData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(referralCode);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const purchaseCommissions = commissions.filter(c => c.commission_type === 'purchase');
  const videoCommissions = commissions.filter(c => c.commission_type === 'video');

  const purchaseTotal = purchaseCommissions.reduce((sum, c) => sum + c.amount, 0);
  const videoTotal = videoCommissions.reduce((sum, c) => sum + c.amount, 0);
  const totalEarned = purchaseTotal + videoTotal;

  const purchaseByLevel = {
    1: purchaseCommissions.filter(c => c.referrer_level === 1).reduce((sum, c) => sum + c.amount, 0),
    2: purchaseCommissions.filter(c => c.referrer_level === 2).reduce((sum, c) => sum + c.amount, 0),
    3: purchaseCommissions.filter(c => c.referrer_level === 3).reduce((sum, c) => sum + c.amount, 0),
  };

  const videoByLevel = {
    1: videoCommissions.filter(c => c.referrer_level === 1).reduce((sum, c) => sum + c.amount, 0),
    2: videoCommissions.filter(c => c.referrer_level === 2).reduce((sum, c) => sum + c.amount, 0),
    3: videoCommissions.filter(c => c.referrer_level === 3).reduce((sum, c) => sum + c.amount, 0),
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-950 pb-24">
      <div className="bg-purple-800 px-6 py-6 shadow-sm flex items-center gap-4 border-b border-purple-700">
        <button onClick={() => navigate(-1)} className="text-yellow-400 hover:text-yellow-300">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-yellow-400">Programa de Referidos</h1>
      </div>

      <div className="p-6 max-w-2xl mx-auto space-y-6">
        {/* Referral Code Section */}
        <div className="bg-purple-800 rounded-lg p-6 border border-purple-700">
          <h2 className="text-lg font-semibold text-yellow-400 mb-4">Tu Código de Referido</h2>
          <div className="flex items-center gap-3 bg-purple-900 rounded-lg p-4">
            <input
              type="text"
              value={referralCode}
              readOnly
              className="flex-1 bg-transparent text-white font-mono text-lg outline-none"
            />
            <button
              onClick={copyToClipboard}
              className="bg-yellow-400 hover:bg-yellow-500 text-purple-900 p-2 rounded-lg transition-colors"
            >
              {copiedCode ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
          </div>
          <p className="text-sm text-purple-300 mt-3">Comparte este código con tus amigos para ganar comisiones</p>
        </div>

        {isLoading ? (
          <div className="text-center text-purple-300">Cargando...</div>
        ) : (
          <>
            {/* Earnings Summary */}
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-purple-800 rounded-lg p-4 border border-purple-700 text-center">
                <p className="text-sm text-purple-300 mb-2">Total Ganado</p>
                <p className="text-2xl font-bold text-yellow-400">
                  ${totalEarned.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="bg-purple-800 rounded-lg p-4 border border-purple-700 text-center">
                <p className="text-sm text-purple-300 mb-2">Por Compras</p>
                <p className="text-2xl font-bold text-green-400">
                  ${purchaseTotal.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                </p>
              </div>
              <div className="bg-purple-800 rounded-lg p-4 border border-purple-700 text-center">
                <p className="text-sm text-purple-300 mb-2">Por Videos</p>
                <p className="text-2xl font-bold text-blue-400">
                  ${videoTotal.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                </p>
              </div>
            </div>

            {/* Commission by Type Section */}
            <div className="space-y-6">
              {/* Purchase Commissions */}
              <div className="bg-purple-800 rounded-lg p-6 border border-purple-700">
                <h3 className="text-lg font-semibold text-yellow-400 mb-4">Comisiones por Compra de Niveles</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-purple-900 rounded-lg p-4">
                    <span className="text-purple-200">Nivel 1 (Directo) - 20%</span>
                    <span className="font-bold text-green-400">
                      ${purchaseByLevel[1].toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-purple-900 rounded-lg p-4">
                    <span className="text-purple-200">Nivel 2 - 10%</span>
                    <span className="font-bold text-green-400">
                      ${purchaseByLevel[2].toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-purple-900 rounded-lg p-4">
                    <span className="text-purple-200">Nivel 3 - 5%</span>
                    <span className="font-bold text-green-400">
                      ${purchaseByLevel[3].toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-green-900/30 rounded-lg p-4 border border-green-700">
                    <span className="text-green-200 font-semibold">Total Compras</span>
                    <span className="font-bold text-green-400">
                      ${purchaseTotal.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Video Commissions */}
              <div className="bg-purple-800 rounded-lg p-6 border border-purple-700">
                <h3 className="text-lg font-semibold text-yellow-400 mb-4">Comisiones por Visualización de Videos</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center bg-purple-900 rounded-lg p-4">
                    <span className="text-purple-200">Nivel 1 (Directo) - 5%</span>
                    <span className="font-bold text-blue-400">
                      ${videoByLevel[1].toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-purple-900 rounded-lg p-4">
                    <span className="text-purple-200">Nivel 2 - 3%</span>
                    <span className="font-bold text-blue-400">
                      ${videoByLevel[2].toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-purple-900 rounded-lg p-4">
                    <span className="text-purple-200">Nivel 3 - 1%</span>
                    <span className="font-bold text-blue-400">
                      ${videoByLevel[3].toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                  <div className="flex justify-between items-center bg-blue-900/30 rounded-lg p-4 border border-blue-700">
                    <span className="text-blue-200 font-semibold">Total Videos</span>
                    <span className="font-bold text-blue-400">
                      ${videoTotal.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Commissions */}
              {commissions.length > 0 && (
                <div className="bg-purple-800 rounded-lg p-6 border border-purple-700">
                  <h3 className="text-lg font-semibold text-yellow-400 mb-4">Historial Reciente</h3>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {commissions.slice(0, 20).map((commission) => (
                      <div key={commission.id} className="flex justify-between items-center bg-purple-900 rounded-lg p-3 text-sm">
                        <div className="flex-1">
                          <p className="text-purple-200">
                            {commission.commission_type === 'purchase' ? 'Compra' : 'Video'} - Nivel {commission.referrer_level}
                          </p>
                          <p className="text-xs text-purple-400">
                            {new Date(commission.created_at).toLocaleDateString('es-CO')}
                          </p>
                        </div>
                        <span className={`font-semibold ${commission.commission_type === 'purchase' ? 'text-green-400' : 'text-blue-400'}`}>
                          +${commission.amount.toLocaleString('es-CO', { maximumFractionDigits: 0 })}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default Referidos;
