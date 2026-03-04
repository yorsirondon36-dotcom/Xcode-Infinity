import { supabase } from './supabase';

export type TipoActa = 'recompensa_video' | 'recarga' | 'retiro' | 'comision_referido' | 'compra_nivel';
export type EstadoActa = 'completado' | 'pendiente' | 'cancelado';

interface CrearActaParams {
  idUsuario: string;
  tipo: TipoActa;
  cantidad: number;
  estado?: EstadoActa;
  metodoPago?: string;
  comprobanteUrl?: string;
}

interface Acta {
  identificacion: string;
  id_usuario: string;
  tipo: string;
  cantidad: number;
  estado: string;
  método_pago?: string;
  comprobante_url?: string;
  creado_en: string;
}

export const crearActa = async (params: CrearActaParams): Promise<Acta> => {
  const { idUsuario, tipo, cantidad, estado = 'completado', metodoPago, comprobanteUrl } = params;

  const { data, error } = await supabase
    .from('actas')
    .insert([
      {
        id_usuario: idUsuario,
        tipo,
        cantidad,
        estado,
        método_pago: metodoPago || null,
        comprobante_url: comprobanteUrl || null,
      },
    ])
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Error al crear acta');

  return data;
};

export const obtenerActasUsuario = async (idUsuario: string): Promise<Acta[]> => {
  const { data, error } = await supabase
    .from('actas')
    .select('*')
    .eq('id_usuario', idUsuario)
    .order('creado_en', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const obtenerActasPorTipo = async (
  idUsuario: string,
  tipo: TipoActa
): Promise<Acta[]> => {
  const { data, error } = await supabase
    .from('actas')
    .select('*')
    .eq('id_usuario', idUsuario)
    .eq('tipo', tipo)
    .order('creado_en', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const obtenerActasEnRangoFecha = async (
  idUsuario: string,
  fechaInicio: Date,
  fechaFin: Date
): Promise<Acta[]> => {
  const inicio = fechaInicio.toISOString();
  const fin = fechaFin.toISOString();

  const { data, error } = await supabase
    .from('actas')
    .select('*')
    .eq('id_usuario', idUsuario)
    .gte('creado_en', inicio)
    .lte('creado_en', fin)
    .order('creado_en', { ascending: false });

  if (error) throw error;
  return data || [];
};

export const calcularTotalPorTipo = async (
  idUsuario: string,
  tipo: TipoActa
): Promise<number> => {
  const { data, error } = await supabase
    .from('actas')
    .select('cantidad')
    .eq('id_usuario', idUsuario)
    .eq('tipo', tipo)
    .eq('estado', 'completado');

  if (error) throw error;

  return (data || []).reduce((total, acta) => total + Number(acta.cantidad), 0);
};

export const actualizarEstadoActa = async (
  identificacionActa: string,
  nuevoEstado: EstadoActa
): Promise<Acta> => {
  const { data, error } = await supabase
    .from('actas')
    .update({ estado: nuevoEstado })
    .eq('identificacion', identificacionActa)
    .select()
    .single();

  if (error) throw error;
  if (!data) throw new Error('Acta no encontrada');

  return data;
};

export const registrarRecompensaVideo = async (
  idUsuario: string,
  cantidad: number
): Promise<Acta> => {
  return crearActa({
    idUsuario,
    tipo: 'recompensa_video',
    cantidad,
    estado: 'completado',
  });
};

export const registrarRecarga = async (
  idUsuario: string,
  cantidad: number,
  metodoPago: string
): Promise<Acta> => {
  return crearActa({
    idUsuario,
    tipo: 'recarga',
    cantidad,
    estado: 'completado',
    metodoPago,
  });
};

export const registrarRetiro = async (
  idUsuario: string,
  cantidad: number,
  metodoPago?: string
): Promise<Acta> => {
  return crearActa({
    idUsuario,
    tipo: 'retiro',
    cantidad,
    estado: 'completado',
    metodoPago,
  });
};

export const registrarComisionReferido = async (
  idUsuario: string,
  cantidad: number
): Promise<Acta> => {
  return crearActa({
    idUsuario,
    tipo: 'comision_referido',
    cantidad,
    estado: 'completado',
  });
};

export const registrarCompraLevel = async (
  idUsuario: string,
  cantidad: number
): Promise<Acta> => {
  return crearActa({
    idUsuario,
    tipo: 'compra_nivel',
    cantidad,
    estado: 'completado',
  });
};
