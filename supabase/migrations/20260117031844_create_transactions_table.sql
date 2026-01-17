/*
  # Crear tabla de transacciones para recargas

  1. Nueva tabla:
    - `transactions` para registrar recargas y pagos QR

  2. Campos:
    - `id` (uuid, primary key)
    - `user_id` (uuid, foreign key a users)
    - `order_number` (text, único)
    - `amount` (numeric)
    - `reference_code` (text)
    - `payment_method` (text, default: 'nequi')
    - `status` (text, default: 'pending')
    - `created_at` (timestamp)
    - `completed_at` (timestamp, nullable)

  3. Seguridad:
    - RLS habilitado
    - Usuarios solo pueden ver sus propias transacciones
    - Usuarios pueden insertar sus propias transacciones
*/

CREATE TABLE IF NOT EXISTS transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id),
  order_number text NOT NULL UNIQUE,
  amount numeric NOT NULL,
  reference_code text NOT NULL,
  payment_method text DEFAULT 'nequi',
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Política para que usuarios vean sus propias transacciones
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'transactions' AND policyname = 'Users can view own transactions'
  ) THEN
    CREATE POLICY "Users can view own transactions"
      ON transactions
      FOR SELECT
      TO authenticated
      USING (user_id = auth.uid());
  END IF;
END $$;

-- Política para que usuarios creen sus propias transacciones
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies 
    WHERE tablename = 'transactions' AND policyname = 'Users can create transactions'
  ) THEN
    CREATE POLICY "Users can create transactions"
      ON transactions
      FOR INSERT
      TO authenticated
      WITH CHECK (user_id = auth.uid());
  END IF;
END $$;

-- Crear índices para mejor rendimiento
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_order_number ON transactions(order_number);
CREATE INDEX IF NOT EXISTS idx_transactions_created_at ON transactions(created_at);
