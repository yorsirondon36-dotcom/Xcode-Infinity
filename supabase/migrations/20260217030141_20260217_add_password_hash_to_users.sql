/*
  # Add password hash field to users table

  1. Changes
    - Add `password_hash` column to users table for custom phone authentication
    - Add `registration_id` column as auto-incrementing sequential ID for user display

  2. Security
    - password_hash will store bcrypt hashed passwords
    - registration_id provides a simple sequential identifier shown to users
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'password_hash'
  ) THEN
    ALTER TABLE users ADD COLUMN password_hash text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'registration_id'
  ) THEN
    ALTER TABLE users ADD COLUMN registration_id bigserial UNIQUE;
  END IF;
END $$;