/*
  # Add Registration ID column

  1. New Columns
    - `registration_id` - Unique readable identifier assigned at registration
  2. Changes
    - Add registration_id column to users table
    - Create sequence for auto-incrementing registration IDs
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'registration_id'
  ) THEN
    ALTER TABLE users ADD COLUMN registration_id bigint UNIQUE;
    CREATE SEQUENCE IF NOT EXISTS registration_id_seq START 1000;
  END IF;
END $$;
