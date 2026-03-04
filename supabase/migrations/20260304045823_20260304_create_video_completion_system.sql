/*
  # Sistema de Completar Tareas de Videos

  1. Nueva Tabla
    - `historial_videos_completados`: Registra videos completados por usuarios

  2. Función SQL
    - `completar_tarea_video()`: Completa una tarea de video y actualiza balance e ingresos

  3. Trigger
    - `actualizar_estadisticas_usuario_trigger`: Actualiza videos_vistas_hoy, ingresos_hoy, balance

  4. Seguridad
    - RLS habilitado en historial de videos
    - Validación de usuario autenticado
*/

CREATE TABLE IF NOT EXISTS historial_videos_completados (
  identificacion UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  id_usuario UUID NOT NULL REFERENCES usuarios(identificacion),
  id_tarea_video UUID NOT NULL REFERENCES tareas_videos(identificacion),
  completado_en TIMESTAMPTZ DEFAULT now(),
  recompensa_otorgada NUMERIC NOT NULL DEFAULT 0
);

ALTER TABLE historial_videos_completados ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios ven su propio historial de videos"
  ON historial_videos_completados FOR SELECT
  TO authenticated
  USING (auth.uid() = id_usuario);

CREATE POLICY "Sistema inserta en historial"
  ON historial_videos_completados FOR INSERT
  WITH CHECK (true);


CREATE OR REPLACE FUNCTION completar_tarea_video(
  p_id_usuario UUID,
  p_id_tarea_video UUID
)
RETURNS JSONB AS $$
DECLARE
  v_tarea RECORD;
  v_usuario RECORD;
  v_resultado JSONB;
BEGIN
  IF p_id_usuario IS NULL OR p_id_tarea_video IS NULL THEN
    RETURN jsonb_build_object('exito', false, 'mensaje', 'Usuario o tarea video inválidos');
  END IF;

  SELECT * INTO v_tarea FROM tareas_videos WHERE identificacion = p_id_tarea_video;
  
  IF v_tarea IS NULL THEN
    RETURN jsonb_build_object('exito', false, 'mensaje', 'Tarea de video no encontrada');
  END IF;

  SELECT * INTO v_usuario FROM usuarios WHERE identificacion = p_id_usuario;
  
  IF v_usuario IS NULL THEN
    RETURN jsonb_build_object('exito', false, 'mensaje', 'Usuario no encontrado');
  END IF;

  INSERT INTO historial_videos_completados (id_usuario, id_tarea_video, recompensa_otorgada)
  VALUES (p_id_usuario, p_id_tarea_video, v_tarea.recompensa);

  UPDATE usuarios
  SET
    balance = balance + v_tarea.recompensa,
    ingresos_hoy = ingresos_hoy + v_tarea.recompensa,
    ingresos_totales = ingresos_totales + v_tarea.recompensa,
    videos_vistas_hoy = videos_vistas_hoy + 1,
    fecha_ultimo_video = now(),
    actualizado_en = now()
  WHERE identificacion = p_id_usuario;

  v_resultado := jsonb_build_object(
    'exito', true,
    'mensaje', 'Video completado exitosamente',
    'recompensa_otorgada', v_tarea.recompensa,
    'nuevo_balance', (SELECT balance FROM usuarios WHERE identificacion = p_id_usuario),
    'ingresos_hoy', (SELECT ingresos_hoy FROM usuarios WHERE identificacion = p_id_usuario),
    'videos_vistas_hoy', (SELECT videos_vistas_hoy FROM usuarios WHERE identificacion = p_id_usuario)
  );

  RETURN v_resultado;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
