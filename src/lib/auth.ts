import bcryptjs from 'bcryptjs';
import { supabase } from './supabase';

const CLAVE_SESION = 'sesion_usuario';

interface SesionUsuario {
  id: string;
  telefono: string;
  nombre_completo: string;
}

export const generarCodigoReferencia = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let codigo = '';
  for (let i = 0; i < 6; i++) {
    codigo += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return codigo;
};

export const hashearContrasena = async (contrasena: string): Promise<string> => {
  return bcryptjs.hash(contrasena, 10);
};

export const verificarContrasena = async (contrasena: string, hash: string): Promise<boolean> => {
  return bcryptjs.compare(contrasena, hash);
};

export const obtenerSesionAlmacenada = (): SesionUsuario | null => {
  const almacenada = localStorage.getItem(CLAVE_SESION);
  if (!almacenada) return null;
  try {
    return JSON.parse(almacenada);
  } catch {
    return null;
  }
};

export const guardarSesion = (sesion: SesionUsuario): void => {
  localStorage.setItem(CLAVE_SESION, JSON.stringify(sesion));
};

export const limpiarSesion = (): void => {
  localStorage.removeItem(CLAVE_SESION);
};

export const registrarseConTelefono = async (
  telefono: string,
  contrasena: string,
  nombreCompleto: string,
  codigoReferencia?: string
): Promise<SesionUsuario> => {
  const hashContrasena = await hashearContrasena(contrasena);
  const nuevoCodigoReferencia = generarCodigoReferencia();

  const { data, error } = await supabase
    .from('usuarios')
    .insert([{
      teléfono: telefono,
      contrasena: hashContrasena,
      nombre_completo: nombreCompleto,
      código_referido: nuevoCodigoReferencia,
      referido_por_código: codigoReferencia || null,
      saldo: 0,
      ingreso_total: 0,
      ganancias_hoy: 0,
      videos_vistos_hoy: 0,
    }])
    .select('id, teléfono, nombre_completo')
    .single();

  if (error) throw error;
  if (!data) throw new Error('Error al crear el usuario');

  const sesion: SesionUsuario = {
    id: data.id,
    telefono: data.teléfono,
    nombre_completo: data.nombre_completo,
  };

  guardarSesion(sesion);
  return sesion;
};

export const iniciarSesionConTelefono = async (
  telefono: string,
  contrasena: string
): Promise<SesionUsuario> => {
  const { data, error } = await supabase
    .from('usuarios')
    .select('id, teléfono, nombre_completo, contrasena')
    .eq('teléfono', telefono)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('Teléfono o contraseña inválidos');

  const esContrasenaValida = await verificarContrasena(contrasena, data.contrasena);
  if (!esContrasenaValida) throw new Error('Teléfono o contraseña inválidos');

  const sesion: SesionUsuario = {
    id: data.id,
    telefono: data.teléfono,
    nombre_completo: data.nombre_completo,
  };

  guardarSesion(sesion);
  return sesion;
};

export const cerrarSesion = (): void => {
  limpiarSesion();
};

export const getStoredSession = (): SesionUsuario | null => obtenerSesionAlmacenada();
export const setStoredSession = (sesion: SesionUsuario): void => guardarSesion(sesion);
export const clearStoredSession = (): void => limpiarSesion();
export const signUpWithPhone = (telefono: string, contrasena: string, nombreCompleto: string, codigoReferencia?: string) => registrarseConTelefono(telefono, contrasena, nombreCompleto, codigoReferencia);
export const signInWithPhone = (telefono: string, contrasena: string) => iniciarSesionConTelefono(telefono, contrasena);
export const signOut = cerrarSesion;
