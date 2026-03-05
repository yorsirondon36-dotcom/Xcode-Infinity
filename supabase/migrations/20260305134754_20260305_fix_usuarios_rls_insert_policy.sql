/*
  # Fix usuarios table INSERT RLS policy
  
  The INSERT policy was incorrectly configured. This migration:
  1. Removes the incorrect "Sistema inserta nuevos usuarios" policy
  2. Creates a proper INSERT policy that allows unauthenticated users to register
*/

DROP POLICY IF EXISTS "Sistema inserta nuevos usuarios" ON usuarios;

CREATE POLICY "Allow public registration"
  ON usuarios
  FOR INSERT
  TO public
  WITH CHECK (true);