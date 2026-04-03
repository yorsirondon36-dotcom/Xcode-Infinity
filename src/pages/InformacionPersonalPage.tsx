import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Phone, CreditCard, Key, Check } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../context/AuthContext';

interface UserInfo {
  phone: string;
  banking_info: {
    bank_name?: string;
    account_number?: string;
  };
  withdrawal_pin: string | null;
}

interface EditMode {
  phone: boolean;
  withdrawal_pin: boolean;
  banking_info: boolean;
}

function InformacionPersonalPage() {
  const navigate = useNavigate();
  const { usuario } = useAuth();
  const [userInfo, setUserInfo] = useState<UserInfo>({
    phone: '',
    banking_info: {},
    withdrawal_pin: null,
  });
  const [editMode, setEditMode] = useState<EditMode>({
    phone: false,
    withdrawal_pin: false,
    banking_info: false,
  });
  const [tempValues, setTempValues] = useState<UserInfo>({ ...userInfo });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (usuario?.identificacion) {
      fetchUserInfo();
    }
  }, [usuario?.identificacion]);

  const fetchUserInfo = async () => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('telefono, informacion_bancaria, clave_retiro')
        .eq('identificacion', usuario?.identificacion)
        .maybeSingle();

      if (error) throw error;

      if (data) {
        const newUserInfo: UserInfo = {
          phone: data.telefono || '',
          banking_info: data.informacion_bancaria || {},
          withdrawal_pin: data.clave_retiro || null,
        };
        setUserInfo(newUserInfo);
        setTempValues(newUserInfo);
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    } finally {
      setLoading(false);
    }
  };

  const saveToDatabase = async (field: keyof UserInfo, value: any) => {
    try {
      setSaving(true);
      const updateData: any = { [field]: value };

      const { error } = await supabase
        .from('usuarios')
        .update(updateData)
        .eq('identificacion', usuario?.identificacion);

      if (error) throw error;

      setUserInfo((prev) => ({ ...prev, [field]: value }));
      setEditMode((prev) => ({ ...prev, [field === 'banking_info' ? 'banking_info' : field]: false }));
    } catch (error) {
      console.error('Error saving data:', error);
    } finally {
      setSaving(false);
    }
  };

  const handlePhoneChange = (value: string) => {
    setTempValues((prev) => ({ ...prev, phone: value }));
  };

  const handlePhoneSave = () => {
    if (tempValues.phone.trim()) {
      saveToDatabase('phone', tempValues.phone);
    }
  };

  const handlePinChange = (value: string) => {
    setTempValues((prev) => ({ ...prev, withdrawal_pin: value }));
  };

  const handlePinSave = () => {
    if (tempValues.withdrawal_pin && tempValues.withdrawal_pin.trim()) {
      saveToDatabase('withdrawal_pin', tempValues.withdrawal_pin);
    }
  };

  const handleBankingChange = (field: string, value: string) => {
    setTempValues((prev) => ({
      ...prev,
      banking_info: { ...prev.banking_info, [field]: value },
    }));
  };

  const handleBankingSave = () => {
    if (tempValues.banking_info.account_number?.trim()) {
      saveToDatabase('banking_info', tempValues.banking_info);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-950 flex items-center justify-center">
        <div className="text-yellow-400 text-lg">Cargando información...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-900 to-purple-950 pb-24">
      <div className="bg-purple-800 px-6 py-6 shadow-sm flex items-center gap-4 border-b border-purple-700">
        <button
          onClick={() => navigate(-1)}
          className="text-yellow-400 hover:text-yellow-500 transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-white">Información Personal</h1>
      </div>

      <div className="px-6 py-6 space-y-4">
        <div className="bg-purple-800 rounded-xl p-5 shadow-md border border-purple-700">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-purple-900 rounded-lg p-3">
              <Phone className="w-5 h-5 text-fuchsia-400" />
            </div>
            <p className="text-purple-200 text-sm font-medium">Número de teléfono</p>
          </div>

          {editMode.phone ? (
            <div className="flex gap-2">
              <input
                type="text"
                value={tempValues.phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className="flex-1 bg-purple-900 text-white px-4 py-2 rounded-lg border border-purple-600 focus:outline-none focus:border-yellow-400"
                placeholder="Ingresa tu teléfono"
                disabled={saving}
              />
              <button
                onClick={handlePhoneSave}
                disabled={saving}
                className="bg-yellow-400 text-purple-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setEditMode((prev) => ({ ...prev, phone: true }));
                setTempValues((prev) => ({ ...prev, phone: userInfo.phone }));
              }}
              className="w-full bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors text-left"
            >
              {userInfo.phone || 'Agregar teléfono'}
            </button>
          )}
        </div>

        <div className="bg-purple-800 rounded-xl p-5 shadow-md border border-purple-700">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-purple-900 rounded-lg p-3">
              <CreditCard className="w-5 h-5 text-fuchsia-400" />
            </div>
            <p className="text-purple-200 text-sm font-medium">Cuenta bancaria</p>
          </div>

          {editMode.banking_info ? (
            <div className="space-y-3">
              <input
                type="text"
                value={tempValues.banking_info?.bank_name || ''}
                onChange={(e) => handleBankingChange('bank_name', e.target.value)}
                className="w-full bg-purple-900 text-white px-4 py-2 rounded-lg border border-purple-600 focus:outline-none focus:border-yellow-400"
                placeholder="Nombre del banco"
                disabled={saving}
              />
              <input
                type="text"
                value={tempValues.banking_info?.account_number || ''}
                onChange={(e) => handleBankingChange('account_number', e.target.value)}
                className="w-full bg-purple-900 text-white px-4 py-2 rounded-lg border border-purple-600 focus:outline-none focus:border-yellow-400"
                placeholder="Número de cuenta"
                disabled={saving}
              />
              <button
                onClick={handleBankingSave}
                disabled={saving}
                className="w-full bg-yellow-400 text-purple-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
                Guardar
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setEditMode((prev) => ({ ...prev, banking_info: true }));
                setTempValues((prev) => ({ ...prev, banking_info: userInfo.banking_info }));
              }}
              className="w-full bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors text-left"
            >
              <div className="flex flex-col">
                {userInfo.banking_info?.bank_name && (
                  <p className="text-gray-300 text-xs">{userInfo.banking_info.bank_name}</p>
                )}
                <p className="text-white text-sm font-medium">
                  {userInfo.banking_info?.account_number || 'Agregar cuenta bancaria'}
                </p>
              </div>
            </button>
          )}
        </div>

        <div className="bg-purple-800 rounded-xl p-5 shadow-md border border-purple-700">
          <div className="flex items-center gap-4 mb-4">
            <div className="bg-purple-900 rounded-lg p-3">
              <Key className="w-5 h-5 text-fuchsia-400" />
            </div>
            <p className="text-purple-200 text-sm font-medium">Clave de retiro</p>
          </div>

          {editMode.withdrawal_pin ? (
            <div className="flex gap-2">
              <input
                type="password"
                value={tempValues.withdrawal_pin || ''}
                onChange={(e) => handlePinChange(e.target.value)}
                className="flex-1 bg-purple-900 text-white px-4 py-2 rounded-lg border border-purple-600 focus:outline-none focus:border-yellow-400"
                placeholder="Ingresa tu clave"
                disabled={saving}
              />
              <button
                onClick={handlePinSave}
                disabled={saving}
                className="bg-yellow-400 text-purple-900 px-4 py-2 rounded-lg font-semibold hover:bg-yellow-500 transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Check className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => {
                setEditMode((prev) => ({ ...prev, withdrawal_pin: true }));
                setTempValues((prev) => ({ ...prev, withdrawal_pin: userInfo.withdrawal_pin || '' }));
              }}
              className="w-full bg-purple-700 hover:bg-purple-600 text-white px-4 py-2 rounded-lg transition-colors text-left"
            >
              {userInfo.withdrawal_pin ? '••••' : 'Agregar clave de retiro'}
            </button>
          )}
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

export default InformacionPersonalPage;
