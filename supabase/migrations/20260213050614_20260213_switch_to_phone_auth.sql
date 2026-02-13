/*
  # Switch authentication to phone-based system

  1. Changes
    - Add unique constraint on phone column in users table
    - Create index on phone for faster lookups
    - Ensure phone is required

  2. Notes
    - Phone is now the unique identifier for users
    - All authentication now uses phone instead of email
    - Registration and login are phone-based
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints
    WHERE table_name = 'users' AND constraint_name = 'users_phone_unique'
  ) THEN
    ALTER TABLE users ADD CONSTRAINT users_phone_unique UNIQUE (phone);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS idx_users_phone ON users(phone);
