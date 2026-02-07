/*
  # Actualizar porcentajes de comisión por compra de niveles

  Cambios en las comisiones por compra de niveles en el programa de referidos:
  - Nivel 2: de 10% a 4%
  - Nivel 3: de 5% a 2%
  
  Nivel 1 mantiene su porcentaje actual.

  Impacto:
  - Afecta nuevas comisiones registradas
  - Las comisiones históricas no se modifican
  - El cálculo se realiza en la función record_purchase_commission
*/

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

    -- Determinar porcentaje según el nivel (ACTUALIZADO)
    v_commission_rate := CASE 
      WHEN v_referrer_level = 1 THEN 0.20
      WHEN v_referrer_level = 2 THEN 0.04
      WHEN v_referrer_level = 3 THEN 0.02
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
