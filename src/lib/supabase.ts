import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.warn('Supabase environment variables not configured');
}

export const supabase = supabaseUrl && supabaseKey
  ? createClient(supabaseUrl, supabaseKey)
  : createClient('https://placeholder.supabase.co', 'placeholder-key');

export interface Usuario {
  identificacion: string;
  telefono: string;
  contrasena: string;
  balance: number;
  ingresos_totales: number;
  ingresos_hoy: number;
  id_nivel_actual: string;
  codigo_referencia: string;
  referido_por_codigo: string | null;
  videos_vistas_hoy: number;
  creado_en: string;
  actualizado_en: string;
}

export interface Nivel {
  identificacion: string;
  nombre: string;
  precio: number;
  videos_diarios_limitados: number;
  ganancia_por_video: number;
  creado_en: string;
  actualizado_en: string;
}

export interface TareasVideos {
  identificacion: string;
  título: string;
  url_imagen: string;
  url_video: string;
  recompensa: number;
  nivel_requerido_id: string;
  duración_segundos: number;
  esta_activo: boolean;
  creado_en: string;
  actualizado_en: string;
}

export interface Actas {
  identificacion: string;
  id_usuario: string;
  tipo: string;
  cantidad: number;
  estado: string;
  método_pago: string;
  comprobante_url: string | null;
  creado_en: string;
  actualizado_en: string;
}

export interface HistorialVideosUsuarios {
  identificacion: string;
  id_usuario: string;
  id_tarea_video: string;
  completado_en: string;
  ganancias_recibidas: number;
  calificación?: number;
  creado_en: string;
}

export interface GananciasReferidos {
  identificacion: string;
  id_usuario_referidor: string;
  id_usuario_referido: string;
  monto_comision: number;
  id_video_completado: string;
  creado_en: string;
}

export interface Transacciones {
  identificacion: string;
  id_usuario: string;
  tipo: string;
  monto: number;
  estado: string;
  comprobante_url?: string;
  notas?: string;
  creado_en: string;
  actualizado_en: string;
}

export type Database = {
  public: {
    Tables: {
      usuarios: {
        Row: Usuario;
        Insert: Omit<Usuario, 'creado_en' | 'actualizado_en'>;
        Update: Partial<Usuario>;
      };
      niveles: {
        Row: Nivel;
        Insert: Omit<Nivel, 'identificacion' | 'creado_en' | 'actualizado_en'>;
        Update: Partial<Nivel>;
      };
      tareas_videos: {
        Row: TareasVideos;
        Insert: Omit<TareasVideos, 'identificacion' | 'creado_en' | 'actualizado_en'>;
        Update: Partial<TareasVideos>;
      };
      historial_videos_usuarios: {
        Row: HistorialVideosUsuarios;
        Insert: Omit<HistorialVideosUsuarios, 'identificacion' | 'creado_en'>;
        Update: Partial<HistorialVideosUsuarios>;
      };
      ganancias_referidos: {
        Row: GananciasReferidos;
        Insert: Omit<GananciasReferidos, 'identificacion' | 'creado_en'>;
        Update: Partial<GananciasReferidos>;
      };
      transacciones: {
        Row: Transacciones;
        Insert: Omit<Transacciones, 'identificacion' | 'creado_en' | 'actualizado_en'>;
        Update: Partial<Transacciones>;
      };
      actas: {
        Row: Actas;
        Insert: Omit<Actas, 'identificacion' | 'creado_en' | 'actualizado_en'>;
        Update: Partial<Actas>;
      };
    };
  };
};
