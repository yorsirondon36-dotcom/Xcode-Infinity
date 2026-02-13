/*
  # Add automatic user creation for transactions

  1. Problem
    - Foreign key constraint fails when user exists in auth.users but not in public.users
  
  2. Solution
    - Create trigger to automatically create user profile if missing
    - Ensures transaction insertion always succeeds if user is authenticated
  
  3. Changes
    - Create function: ensure_user_exists()
    - Create trigger on transactions before insert
*/

CREATE OR REPLACE FUNCTION public.ensure_user_exists()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, phone, full_name, balance, total_income)
  VALUES (
    NEW.user_id,
    '',
    'Usuario',
    0,
    0
  )
  ON CONFLICT (id) DO NOTHING;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS ensure_user_exists_trigger ON transactions;
CREATE TRIGGER ensure_user_exists_trigger
  BEFORE INSERT ON transactions
  FOR EACH ROW EXECUTE FUNCTION public.ensure_user_exists();
