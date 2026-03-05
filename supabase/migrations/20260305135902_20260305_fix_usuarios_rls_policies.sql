/*
  # Fix usuarios RLS policies for registration
  
  The issue was that RLS policies were too restrictive for public registration.
  This migration:
  1. Drops all existing policies on usuarios table
  2. Creates a new INSERT policy that allows public users to register (no auth required)
  3. Creates SELECT policy for authenticated users to view their own data
  4. Creates UPDATE policy for authenticated users to update their own data
*/

DROP POLICY IF EXISTS "Allow public registration" ON usuarios;
DROP POLICY IF EXISTS "Usuarios actualizan su propio perfil" ON usuarios;
DROP POLICY IF EXISTS "Usuarios ven su propio perfil" ON usuarios;
DROP POLICY IF EXISTS "Sistema inserta nuevos usuarios" ON usuarios;

CREATE POLICY "Public can register"
  ON usuarios
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Users can view own profile"
  ON usuarios
  FOR SELECT
  TO authenticated
  USING (auth.uid() = identificacion);

CREATE POLICY "Users can update own profile"
  ON usuarios
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = identificacion)
  WITH CHECK (auth.uid() = identificacion);