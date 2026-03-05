/*
  # Create usuarios table with Spanish column names
  
  1. New Tables
    - `usuarios` - Main user table with Spanish naming convention
      - `id` (uuid, primary key)
      - `telefono` (text, unique)
      - `nombre_completo` (text)
      - `balance` (numeric)
      - `ingresos_totales` (numeric)
      - `id_nivel_actual` (uuid)
      - `informacion_bancaria` (jsonb)
      - `creado_en` (timestamptz)
      - `actualizado_en` (timestamptz)
      - `videos_vistos_hoy` (integer)
      - `fecha_ultimo_video` (timestamptz)
      - `codigo_referencia` (text, unique)
      - `referido_por_codigo` (text)
      - `contrasena_hash` (text)
      - `id_registro` (bigint, unique)
  
  2. Security
    - Enable RLS on `usuarios` table
    - Add policies for authenticated users
*/

CREATE SEQUENCE IF NOT EXISTS usuarios_id_registro_seq START 1 INCREMENT 1;

CREATE TABLE IF NOT EXISTS usuarios (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  telefono text UNIQUE NOT NULL,
  nombre_completo text,
  balance numeric DEFAULT 0,
  ingresos_totales numeric DEFAULT 0,
  id_nivel_actual uuid,
  informacion_bancaria jsonb,
  creado_en timestamptz DEFAULT now(),
  actualizado_en timestamptz DEFAULT now(),
  videos_vistos_hoy integer DEFAULT 0,
  fecha_ultimo_video timestamptz,
  codigo_referencia text UNIQUE,
  referido_por_codigo text,
  contrasena_hash text,
  id_registro bigint UNIQUE DEFAULT nextval('usuarios_id_registro_seq')
);

ALTER TABLE usuarios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios pueden ver su propio perfil"
  ON usuarios FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Usuarios pueden actualizar su propio perfil"
  ON usuarios FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Sistema puede insertar usuarios"
  ON usuarios FOR INSERT
  WITH CHECK (true);
