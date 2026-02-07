/*
  # Add personal information fields

  1. New Fields
    - `withdrawal_pin` (text, optional) - PIN para retiros
  2. Changes
    - Add withdrawal_pin column to users table for withdrawal security
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'withdrawal_pin'
  ) THEN
    ALTER TABLE users ADD COLUMN withdrawal_pin text;
  END IF;
END $$;
