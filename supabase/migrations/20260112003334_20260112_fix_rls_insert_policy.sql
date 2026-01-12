/*
  # Fix RLS Insert Policy for Users Table

  Add missing INSERT policy to allow new users to create their profile during registration.
  
  IMPORTANT: Without this policy, user registration fails with "no rows affected" error.
*/

CREATE POLICY "Users can insert own profile"
  ON users
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);