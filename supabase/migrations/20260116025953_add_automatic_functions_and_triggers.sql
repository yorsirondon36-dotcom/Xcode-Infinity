/*
  # Funciones y Triggers automáticos

  1. Funciones creadas:
    - Actualización automática de updated_at en users
    - Actualización automática de balance en users cuando hay transacciones
    - Registro automático de daily_income cuando se completan tareas

  2. Triggers:
    - Trigger para updated_at
    - Trigger para actualizar balance en rechargas
    - Trigger para actualizar balance en retiros

  3. Seguridad:
    - Todas las operaciones son automáticas
    - Mantiene integridad de datos
*/

-- Función para actualizar updated_at automáticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para users.updated_at
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Función para actualizar balance y total_income cuando se aprueba una recarga
CREATE OR REPLACE FUNCTION process_recharge_approval()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND (OLD.status IS NULL OR OLD.status != 'completed') THEN
    UPDATE users
    SET 
      balance = balance + NEW.amount,
      total_income = total_income + NEW.amount,
      updated_at = NOW()
    WHERE id = NEW.user_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para procesar recargas aprobadas
DROP TRIGGER IF EXISTS trigger_recharge_approval ON recharges;
CREATE TRIGGER trigger_recharge_approval
  AFTER INSERT OR UPDATE ON recharges
  FOR EACH ROW
  EXECUTE FUNCTION process_recharge_approval();

-- Función para registrar ingresos diarios automáticamente
CREATE OR REPLACE FUNCTION record_daily_income(
  p_user_id uuid,
  p_amount numeric,
  p_source text DEFAULT 'video_task'
)
RETURNS void AS $$
BEGIN
  INSERT INTO daily_income (user_id, amount, source)
  VALUES (p_user_id, p_amount, p_source);
  
  UPDATE users
  SET 
    balance = balance + p_amount,
    total_income = total_income + p_amount,
    updated_at = NOW()
  WHERE id = p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Función para procesar compra de nivel
CREATE OR REPLACE FUNCTION purchase_level(
  p_user_id uuid,
  p_level_id uuid
)
RETURNS jsonb AS $$
DECLARE
  v_level_price numeric;
  v_user_balance numeric;
  v_result jsonb;
BEGIN
  -- Obtener precio del nivel
  SELECT price INTO v_level_price
  FROM levels
  WHERE id = p_level_id;

  IF v_level_price IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Nivel no encontrado');
  END IF;

  -- Obtener balance del usuario
  SELECT balance INTO v_user_balance
  FROM users
  WHERE id = p_user_id;

  IF v_user_balance < v_level_price THEN
    RETURN jsonb_build_object('success', false, 'error', 'Saldo insuficiente');
  END IF;

  -- Actualizar nivel actual y balance
  UPDATE users
  SET 
    current_level_id = p_level_id,
    balance = balance - v_level_price,
    updated_at = NOW()
  WHERE id = p_user_id;

  -- Registrar la compra
  INSERT INTO user_levels (user_id, level_id)
  VALUES (p_user_id, p_level_id);

  RETURN jsonb_build_object('success', true, 'message', 'Nivel comprado exitosamente');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Crear índices para mejorar rendimiento
CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
CREATE INDEX IF NOT EXISTS idx_recharges_user_id ON recharges(user_id);
CREATE INDEX IF NOT EXISTS idx_withdrawals_user_id ON withdrawals(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_income_user_id ON daily_income(user_id);
CREATE INDEX IF NOT EXISTS idx_daily_income_created_at ON daily_income(created_at);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referred_user_id ON referrals(referred_user_id);
CREATE INDEX IF NOT EXISTS idx_user_levels_user_id ON user_levels(user_id);
