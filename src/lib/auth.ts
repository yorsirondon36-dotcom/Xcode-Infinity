import bcryptjs from 'bcryptjs';
import { supabase } from './supabase';

const CLAVE_SESION = 'sesion_usuario';

interface SesionUsuario {
  id: string;
  telefono: string;
  nombre_completo: string;
}

export const generarCodigoReferencia = (): string => {
  return Math.random().toString(36).substring(2, 10).toUpperCase();
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
      telefono,
      contrasena_hash: hashContrasena,
      nombre_completo: nombreCompleto,
      codigo_referencia: nuevoCodigoReferencia,
      referido_por_codigo: codigoReferencia || null,
    }])
    .select('id, telefono, nombre_completo')
    .single();

  if (error) throw error;
  if (!data) throw new Error('Error al crear el usuario');

  const sesion: SesionUsuario = {
    id: data.id,
    telefono: data.telefono,
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
    .select('id, telefono, nombre_completo, contrasena_hash')
    .eq('telefono', telefono)
    .maybeSingle();

  if (error) throw error;
  if (!data) throw new Error('Teléfono o contraseña inválidos');

  const esContrasenaValida = await verificarContrasena(contrasena, data.contrasena_hash);
  if (!esContrasenaValida) throw new Error('Teléfono o contraseña inválidos');

  const sesion: SesionUsuario = {
    id: data.id,
    telefono: data.telefono,
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
