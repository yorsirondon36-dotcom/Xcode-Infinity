import { supabase } from './supabase';

export interface ResultadoTarea {
  exito: boolean;
  mensaje: string;
  recompensa_otorgada?: number;
  nuevo_balance?: number;
  ingresos_hoy?: number;
  videos_vistas_hoy?: number;
}

export const completarTareaVideo = async (
  idUsuario: string,
  idTareaVideo: string
): Promise<ResultadoTarea> => {
  try {
    const { data, error } = await supabase.rpc('completar_tarea_video', {
      p_id_usuario: idUsuario,
      p_id_tarea_video: idTareaVideo
    });

    if (error) {
      console.error('Error al completar tarea:', error);
      return {
        exito: false,
        mensaje: error.message || 'Error desconocido al completar la tarea'
      };
    }

    return data as ResultadoTarea;
  } catch (error) {
    console.error('Error en completarTareaVideo:', error);
    return {
      exito: false,
      mensaje: 'Error al procesar la tarea de video'
    };
  }
};

export const obtenerTareasVideos = async () => {
  try {
    const { data, error } = await supabase
      .from('tareas_videos')
      .select('*')
      .order('creado_en', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error al obtener tareas de videos:', error);
    return [];
  }
};

export const obtenerHistorialVideosCompletados = async (idUsuario: string) => {
  try {
    const { data, error } = await supabase
      .from('historial_videos_completados')
      .select('*')
      .eq('id_usuario', idUsuario)
      .order('completado_en', { ascending: false });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error al obtener historial:', error);
    return [];
  }
};

export const obtenerVideosCompletadosHoy = async (idUsuario: string) => {
  try {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const { data, error } = await supabase
      .from('historial_videos_completados')
      .select('*')
      .eq('id_usuario', idUsuario)
      .gte('completado_en', hoy.toISOString());

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error al obtener videos de hoy:', error);
    return [];
  }
};
