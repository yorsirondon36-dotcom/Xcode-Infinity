/*
  # Sistema de códigos de referidos

  1. Nuevos campos:
    - `referral_code` en users (código único de referido)
    - `referred_by_code` en users (código del referidor)

  2. Funciones:
    - Generación automática de código de referido
    - Procesamiento automático de comisiones por referidos

  3. Seguridad:
    - Códigos únicos por usuario
    - Validación de referidos
*/

-- Agregar campos para sistema de referidos si no existen
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'referral_code'
  ) THEN
    ALTER TABLE users ADD COLUMN referral_code text UNIQUE;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'referred_by_code'
  ) THEN
    ALTER TABLE users ADD COLUMN referred_by_code text;
  END IF;
END $$;

-- Función para generar código de referido único
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS text AS $$
DECLARE
  v_code text;
  v_exists boolean;
BEGIN
  LOOP
    v_code := 'REF' || upper(substr(md5(random()::text), 1, 6));
    
    SELECT EXISTS(SELECT 1 FROM users WHERE referral_code = v_code) INTO v_exists;
    
    IF NOT v_exists THEN
      EXIT;
    END IF;
  END LOOP;
  
  RETURN v_code;
END;
$$ LANGUAGE plpgsql;

-- Trigger para generar código de referido automáticamente
CREATE OR REPLACE FUNCTION set_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := generate_referral_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_referral_code ON users;
CREATE TRIGGER trigger_set_referral_code
  BEFORE INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION set_referral_code();

-- Función para procesar referido y dar comisión
CREATE OR REPLACE FUNCTION process_referral(
  p_new_user_id uuid,
  p_referral_code text
)
RETURNS jsonb AS $$
DECLARE
  v_referrer_id uuid;
  v_commission numeric := 5000;
BEGIN
  IF p_referral_code IS NULL OR p_referral_code = '' THEN
    RETURN jsonb_build_object('success', false, 'error', 'Código de referido no válido');
  END IF;

  -- Buscar el referidor
  SELECT id INTO v_referrer_id
  FROM users
  WHERE referral_code = p_referral_code;

  IF v_referrer_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Código de referido no encontrado');
  END IF;

  IF v_referrer_id = p_new_user_id THEN
    RETURN jsonb_build_object('success', false, 'error', 'No puedes referirte a ti mismo');
  END IF;

  -- Actualizar el usuario referido
  UPDATE users
  SET referred_by_code = p_referral_code
  WHERE id = p_new_user_id;

  -- Dar comisión al referidor
  UPDATE users
  SET 
    balance = balance + v_commission,
    total_income = total_income + v_commission
  WHERE id = v_referrer_id;

  -- Registrar el referido
  INSERT INTO referrals (referrer_id, referred_user_id, commission)
  VALUES (v_referrer_id, p_new_user_id, v_commission);

  RETURN jsonb_build_object('success', true, 'commission', v_commission);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear índice para búsqueda rápida de códigos de referido
CREATE INDEX IF NOT EXISTS idx_users_referral_code ON users(referral_code);
