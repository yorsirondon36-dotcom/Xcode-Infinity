/*
  # Add nombre_completo column to usuarios table

  1. Changes:
    - Add `nombre_completo` text column to usuarios table
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'usuarios' AND column_name = 'nombre_completo'
  ) THEN
    ALTER TABLE usuarios ADD COLUMN nombre_completo TEXT;
  END IF;
END $$;