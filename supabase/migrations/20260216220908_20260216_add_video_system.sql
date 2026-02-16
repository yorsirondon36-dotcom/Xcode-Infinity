/*
  # Agregar sistema completo de videos

  1. Actualizar tabla levels
    - Agregar daily_video_limit
    - Agregar earnings_per_video
    - Agregar referral_commission_percentage

  2. Crear tabla video_tasks
    - Almacenar videos disponibles
    - Títulos, URLs de imagen, URLs de video

  3. Crear tabla user_video_history
    - Historial de videos vistos
    - Ganancias por video

  4. Crear tabla referral_earnings
    - Registro de comisiones
    - Ganancias por referidos

  5. Actualizar tabla transactions
    - Agregar transaction_type
    - Agregar proof_url

  6. Actualizar tabla users
    - Agregar today_earnings
    - Agregar last_video_reset
*/

-- Agregar columnas faltantes a levels
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'levels' AND column_name = 'daily_video_limit'
  ) THEN
    ALTER TABLE levels ADD COLUMN daily_video_limit integer NOT NULL DEFAULT 5;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'levels' AND column_name = 'earnings_per_video'
  ) THEN
    ALTER TABLE levels ADD COLUMN earnings_per_video numeric NOT NULL DEFAULT 500;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'levels' AND column_name = 'referral_commission_percentage'
  ) THEN
    ALTER TABLE levels ADD COLUMN referral_commission_percentage numeric NOT NULL DEFAULT 10;
  END IF;
END $$;

-- Actualizar los niveles existentes
UPDATE levels SET daily_video_limit = 5, earnings_per_video = 500, referral_commission_percentage = 10 WHERE name = 'Level 1';
UPDATE levels SET daily_video_limit = 10, earnings_per_video = 1000, referral_commission_percentage = 15 WHERE name = 'Level 2';
UPDATE levels SET daily_video_limit = 20, earnings_per_video = 1500, referral_commission_percentage = 20 WHERE name = 'Level 3';
UPDATE levels SET daily_video_limit = 40, earnings_per_video = 2500, referral_commission_percentage = 25 WHERE name = 'Level 4';

-- Crear tabla de tareas de videos
CREATE TABLE IF NOT EXISTS video_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  image_url text NOT NULL,
  video_url text NOT NULL,
  reward numeric NOT NULL DEFAULT 500,
  required_level_id uuid REFERENCES levels(id),
  duration_seconds integer DEFAULT 60,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE video_tasks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos pueden ver tareas de videos activas"
  ON video_tasks FOR SELECT
  TO public
  USING (is_active = true);

-- Crear tabla de historial de videos
CREATE TABLE IF NOT EXISTS user_video_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  video_task_id uuid NOT NULL REFERENCES video_tasks(id) ON DELETE CASCADE,
  completed_at timestamptz DEFAULT now(),
  earnings_received numeric DEFAULT 0,
  rating integer,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE user_video_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios ven su propio historial"
  ON user_video_history FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Usuarios pueden registrar sus videos"
  ON user_video_history FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE INDEX IF NOT EXISTS idx_user_video_history_user_id ON user_video_history(user_id);
CREATE INDEX IF NOT EXISTS idx_user_video_history_completed_at ON user_video_history(completed_at);

-- Agregar columnas a transactions
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'transaction_type'
  ) THEN
    ALTER TABLE transactions ADD COLUMN transaction_type text DEFAULT 'recharge';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'proof_url'
  ) THEN
    ALTER TABLE transactions ADD COLUMN proof_url text;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'transactions' AND column_name = 'notes'
  ) THEN
    ALTER TABLE transactions ADD COLUMN notes text;
  END IF;
END $$;

-- Agregar columnas a users
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'today_earnings'
  ) THEN
    ALTER TABLE users ADD COLUMN today_earnings numeric DEFAULT 0;
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'last_video_reset'
  ) THEN
    ALTER TABLE users ADD COLUMN last_video_reset timestamptz DEFAULT now();
  END IF;
END $$;

-- Crear tabla de ganancias por referidos
CREATE TABLE IF NOT EXISTS referral_earnings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referral_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  commission_amount numeric NOT NULL,
  video_completed_id uuid REFERENCES user_video_history(id),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE referral_earnings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuarios ven sus ganancias por referidos"
  ON referral_earnings FOR SELECT
  TO authenticated
  USING (referrer_user_id = auth.uid());

CREATE POLICY "Sistema puede insertar ganancias"
  ON referral_earnings FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_referral_earnings_referrer_id ON referral_earnings(referrer_user_id);
CREATE INDEX IF NOT EXISTS idx_referral_earnings_created_at ON referral_earnings(created_at);

-- Función para procesar comisiones de referidos
CREATE OR REPLACE FUNCTION process_referral_commission(
  p_video_completer_id uuid,
  p_video_reward numeric
)
RETURNS void AS $$
DECLARE
  v_referrer_code text;
  v_referrer_id uuid;
  v_commission_amount numeric;
  v_referrer_level_id uuid;
BEGIN
  SELECT referred_by_code INTO v_referrer_code FROM users WHERE id = p_video_completer_id;
  
  IF v_referrer_code IS NOT NULL THEN
    SELECT id, current_level_id INTO v_referrer_id, v_referrer_level_id 
    FROM users 
    WHERE referral_code = v_referrer_code;
    
    IF v_referrer_id IS NOT NULL THEN
      SELECT (referral_commission_percentage / 100.0) * p_video_reward INTO v_commission_amount
      FROM levels 
      WHERE id = v_referrer_level_id;
      
      IF v_commission_amount > 0 THEN
        UPDATE users 
        SET balance = balance + v_commission_amount 
        WHERE id = v_referrer_id;
        
        INSERT INTO referral_earnings (referrer_user_id, referral_user_id, commission_amount)
        VALUES (v_referrer_id, p_video_completer_id, v_commission_amount);
      END IF;
    END IF;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
