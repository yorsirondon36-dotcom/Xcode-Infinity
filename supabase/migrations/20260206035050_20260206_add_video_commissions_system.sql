/*
  # Agregar sistema de comisiones por visualización de videos

  1. Nueva tabla:
    - `referral_commissions` para registrar todas las comisiones por referidos
    - Distingue entre comisiones por compra de nivel y por visualización de videos

  2. Campos:
    - `id` (uuid, primary key)
    - `user_id` (uuid, quien recibe la comisión)
    - `commission_type` (text - "purchase" o "video")
    - `referrer_level` (int - nivel en la cadena: 1, 2, 3)
    - `amount` (numeric)
    - `source_user_id` (uuid - quien realizó la acción)
    - `created_at` (timestamp)

  3. Funciones:
    - `distribute_video_commissions` - distribuye ganancias cuando se completa un video
    - Calcula: Nivel 1 (Directo): 5%, Nivel 2: 3%, Nivel 3: 1%

  4. Seguridad:
    - RLS habilitado en referral_commissions
    - Políticas para que usuarios vean sus propias comisiones
    - Función con SECURITY DEFINER para operaciones automáticas

  5. Notas importantes:
    - No modifica triggers ni funciones de compra existentes
    - Mantiene intacta la lógica actual
    - Agrega nuevos ingresos al balance del usuario
*/

-- Crear tabla de comisiones por referidos si no existe
CREATE TABLE IF NOT EXISTS referral_commissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  commission_type text NOT NULL CHECK (commission_type IN ('purchase', 'video')),
  referrer_level int NOT NULL CHECK (referrer_level IN (1, 2, 3)),
  amount decimal(12, 2) NOT NULL,
  source_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE referral_commissions ENABLE ROW LEVEL SECURITY;

-- Política para que usuarios vean sus propias comisiones
CREATE POLICY "Users can view own commissions"
  ON referral_commissions FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_referral_commissions_user_id ON referral_commissions(user_id);
CREATE INDEX IF NOT EXISTS idx_referral_commissions_type ON referral_commissions(commission_type);
CREATE INDEX IF NOT EXISTS idx_referral_commissions_source_user ON referral_commissions(source_user_id);
CREATE INDEX IF NOT EXISTS idx_referral_commissions_created_at ON referral_commissions(created_at);

-- Función para distribuir comisiones por visualización de videos
CREATE OR REPLACE FUNCTION distribute_video_commissions(
  p_video_viewer_id uuid,
  p_video_value numeric
)
RETURNS jsonb AS $$
DECLARE
  v_referrer_id uuid;
  v_referrer_level int := 1;
  v_commission_rate numeric;
  v_commission_amount numeric;
  v_current_user_id uuid;
BEGIN
  -- Inicializar con el usuario que vio el video
  v_current_user_id := p_video_viewer_id;

  -- Procesar hasta 3 niveles de referradores
  FOR v_referrer_level IN 1..3 LOOP
    -- Obtener el referidor del usuario actual
    SELECT id INTO v_referrer_id
    FROM users
    WHERE id IN (
      SELECT referrer_id FROM referrals 
      WHERE referred_user_id = v_current_user_id
    )
    LIMIT 1;

    -- Si no hay referidor, terminar
    IF v_referrer_id IS NULL THEN
      EXIT;
    END IF;

    -- Determinar porcentaje según el nivel
    v_commission_rate := CASE 
      WHEN v_referrer_level = 1 THEN 0.05
      WHEN v_referrer_level = 2 THEN 0.03
      WHEN v_referrer_level = 3 THEN 0.01
      ELSE 0
    END;

    -- Calcular comisión
    v_commission_amount := p_video_value * v_commission_rate;

    -- Registrar la comisión
    INSERT INTO referral_commissions (
      user_id,
      commission_type,
      referrer_level,
      amount,
      source_user_id
    ) VALUES (
      v_referrer_id,
      'video',
      v_referrer_level,
      v_commission_amount,
      p_video_viewer_id
    );

    -- Actualizar balance del referidor
    UPDATE users
    SET 
      balance = balance + v_commission_amount,
      total_income = total_income + v_commission_amount,
      updated_at = NOW()
    WHERE id = v_referrer_id;

    -- Avanzar al siguiente nivel
    v_current_user_id := v_referrer_id;
  END LOOP;

  RETURN jsonb_build_object('success', true, 'message', 'Comisiones distribuidas exitosamente');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función auxiliar para registrar comisión por compra de nivel
CREATE OR REPLACE FUNCTION record_purchase_commission(
  p_buyer_id uuid,
  p_level_price numeric
)
RETURNS jsonb AS $$
DECLARE
  v_referrer_id uuid;
  v_referrer_level int := 1;
  v_commission_rate numeric;
  v_commission_amount numeric;
  v_current_user_id uuid;
BEGIN
  -- Inicializar con el usuario que compró
  v_current_user_id := p_buyer_id;

  -- Procesar hasta 3 niveles de referradores
  FOR v_referrer_level IN 1..3 LOOP
    -- Obtener el referidor del usuario actual
    SELECT id INTO v_referrer_id
    FROM users
    WHERE id IN (
      SELECT referrer_id FROM referrals 
      WHERE referred_user_id = v_current_user_id
    )
    LIMIT 1;

    -- Si no hay referidor, terminar
    IF v_referrer_id IS NULL THEN
      EXIT;
    END IF;

    -- Determinar porcentaje según el nivel
    v_commission_rate := CASE 
      WHEN v_referrer_level = 1 THEN 0.20
      WHEN v_referrer_level = 2 THEN 0.10
      WHEN v_referrer_level = 3 THEN 0.05
      ELSE 0
    END;

    -- Calcular comisión
    v_commission_amount := p_level_price * v_commission_rate;

    -- Registrar la comisión
    INSERT INTO referral_commissions (
      user_id,
      commission_type,
      referrer_level,
      amount,
      source_user_id
    ) VALUES (
      v_referrer_id,
      'purchase',
      v_referrer_level,
      v_commission_amount,
      p_buyer_id
    );

    -- Actualizar balance del referidor
    UPDATE users
    SET 
      balance = balance + v_commission_amount,
      total_income = total_income + v_commission_amount,
      updated_at = NOW()
    WHERE id = v_referrer_id;

    -- Avanzar al siguiente nivel
    v_current_user_id := v_referrer_id;
  END LOOP;

  RETURN jsonb_build_object('success', true, 'message', 'Comisión por compra registrada');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
