/*
  # Completar políticas RLS para toda la base de datos

  1. Tablas afectadas:
    - `levels`: Habilitar RLS y agregar políticas públicas de lectura
    - `recharges`: Agregar políticas de INSERT
    - `daily_income`: Agregar políticas de INSERT
    - `referrals`: Agregar políticas de INSERT
    - `user_levels`: Agregar políticas de INSERT

  2. Seguridad:
    - Todos los usuarios autenticados pueden leer los niveles disponibles
    - Los usuarios solo pueden insertar datos relacionados con su propia cuenta
    - Solo el sistema/admin puede actualizar estados de recargas y retiros

  3. Notas importantes:
    - Las políticas son restrictivas por defecto
    - Se mantiene la integridad de datos existentes
*/

-- Habilitar RLS en la tabla levels
ALTER TABLE levels ENABLE ROW LEVEL SECURITY;

-- Políticas para levels (lectura pública para usuarios autenticados)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'levels' AND policyname = 'Anyone can view levels'
  ) THEN
    CREATE POLICY "Anyone can view levels"
      ON levels
      FOR SELECT
      TO authenticated
      USING (true);
  END IF;
END $$;

-- Políticas para recharges (INSERT)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'recharges' AND policyname = 'Users can create recharges'
  ) THEN
    CREATE POLICY "Users can create recharges"
      ON recharges
      FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- Políticas para daily_income (INSERT para sistema)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'daily_income' AND policyname = 'Users can create daily income'
  ) THEN
    CREATE POLICY "Users can create daily income"
      ON daily_income
      FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- Políticas para referrals (INSERT)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'referrals' AND policyname = 'Users can create referrals'
  ) THEN
    CREATE POLICY "Users can create referrals"
      ON referrals
      FOR INSERT
      TO authenticated
      WITH CHECK (referrer_id = auth.uid());
  END IF;
END $$;

-- Políticas para user_levels (INSERT)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'user_levels' AND policyname = 'Users can purchase levels'
  ) THEN
    CREATE POLICY "Users can purchase levels"
      ON user_levels
      FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- Insertar niveles VIP si no existen
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM levels WHERE name = 'VIP 1') THEN
    INSERT INTO levels (name, price, description) VALUES
      ('VIP 1', 120000, '5 videos por día, gana $800 por video'),
      ('VIP 2', 300000, '10 videos por día, gana $1000 por video'),
      ('VIP 3', 600000, '15 videos por día, gana $1400 por video'),
      ('VIP 4', 1000000, '20 videos por día, gana $1700 por video');
  END IF;
END $$;
