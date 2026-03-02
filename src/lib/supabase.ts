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
  id: string;
  nombre: string;
  descripcion: string;
  precio_acceso: number;
  limite_videos_diarios: number;
  ganancias_por_video: number;
  porcentaje_comision_referidos: number;
}

export interface TareaVideo {
  id: string;
  titulo: string;
  url_imagen: string;
  url_video: string;
  recompensa: number;
  id_nivel_requerido: string;
  duracion_segundos: number;
  esta_activo: boolean;
  creado_en: string;
}

export interface HistorialVideoUsuario {
  id: string;
  id_usuario: string;
  id_tarea_video: string;
  completado_en: string;
  ganancias_recibidas: number;
  calificacion?: number;
}

export interface GananciaReferido {
  id: string;
  id_usuario_referidor: string;
  id_usuario_referido: string;
  monto_comision: number;
  id_video_completado: string;
  creado_en: string;
}

export interface Transaccion {
  id: string;
  id_usuario: string;
  tipo: 'recarga' | 'retiro' | 'comision_video' | 'comision_referido';
  monto: number;
  estado: 'pendiente' | 'aprobado' | 'rechazado';
  url_comprobante?: string;
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
        Insert: Omit<Nivel, 'id'>;
        Update: Partial<Nivel>;
      };
      tareas_videos: {
        Row: TareaVideo;
        Insert: Omit<TareaVideo, 'id' | 'creado_en'>;
        Update: Partial<TareaVideo>;
      };
      historial_videos_usuarios: {
        Row: HistorialVideoUsuario;
        Insert: Omit<HistorialVideoUsuario, 'id'>;
        Update: Partial<HistorialVideoUsuario>;
      };
      ganancias_referidos: {
        Row: GananciaReferido;
        Insert: Omit<GananciaReferido, 'id' | 'creado_en'>;
        Update: Partial<GananciaReferido>;
      };
      transacciones: {
        Row: Transaccion;
        Insert: Omit<Transaccion, 'id' | 'creado_en' | 'actualizado_en'>;
        Update: Partial<Transaccion>;
      };
    };
  };
};
