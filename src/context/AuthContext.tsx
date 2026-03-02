import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { getStoredSession, setStoredSession, signOut as authSignOut, signUpWithPhone as authSignUpWithPhone, signInWithPhone as authSignInWithPhone } from '../lib/auth';

interface SesionUsuario {
  id: string;
  telefono: string;
  nombre_completo: string;
}

interface PerfilUsuario {
  id: string;
  telefono: string;
  nombre_completo: string;
  balance: number;
  ingresos_totales: number;
  id_nivel_actual: string | null;
  informacion_bancaria: any;
  id_registro?: number;
}

interface TipoContextoAutenticacion {
  usuario: SesionUsuario | null;
  perfilUsuario: PerfilUsuario | null;
  cargando: boolean;
  registrarse: (telefono: string, contrasena: string, nombre: string, codigoReferencia?: string) => Promise<void>;
  iniciarSesion: (telefono: string, contrasena: string) => Promise<void>;
  cerrarSesion: () => Promise<void>;
}

const ContextoAutenticacion = createContext<TipoContextoAutenticacion | undefined>(undefined);

export function ProveedorAutenticacion({ children }: { children: React.ReactNode }) {
  const [usuario, setUsuario] = useState<SesionUsuario | null>(null);
  const [perfilUsuario, setPerfilUsuario] = useState<PerfilUsuario | null>(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const sesion = getStoredSession();
    if (sesion) {
      setUsuario(sesion);
      obtenerPerfilUsuario(sesion.id);
    } else {
      setCargando(false);
    }
  }, []);

  const obtenerPerfilUsuario = async (idUsuario: string) => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', idUsuario)
        .maybeSingle();

      if (error) throw error;
      setPerfilUsuario(data);
    } catch (error) {
      console.error('Error al obtener perfil del usuario:', error);
    } finally {
      setCargando(false);
    }
  };

  const registrarse = async (telefono: string, contrasena: string, nombre: string, codigoReferencia?: string) => {
    try {
      const sesion = await authSignUpWithPhone(telefono, contrasena, nombre, codigoReferencia);
      setUsuario(sesion);
      await obtenerPerfilUsuario(sesion.id);
    } catch (error) {
      console.error('Error al registrarse:', error);
      throw error;
    }
  };

  const iniciarSesion = async (telefono: string, contrasena: string) => {
    try {
      const sesion = await authSignInWithPhone(telefono, contrasena);
      setUsuario(sesion);
      await obtenerPerfilUsuario(sesion.id);
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      throw error;
    }
  };

  const cerrarSesion = async () => {
    try {
      authSignOut();
      setUsuario(null);
      setPerfilUsuario(null);
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      throw error;
    }
  };

  return (
    <ContextoAutenticacion.Provider value={{ usuario, perfilUsuario, cargando, registrarse, iniciarSesion, cerrarSesion }}>
      {children}
    </ContextoAutenticacion.Provider>
  );
}

export function useAuth() {
  const context = useContext(ContextoAutenticacion);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un ProveedorAutenticacion');
  }
  return context;
}
