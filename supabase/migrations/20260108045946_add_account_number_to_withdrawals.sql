/*
  # Add account_number column to withdrawals table

  1. Changes
    - Add `account_number` column to store bank account numbers
    - Add RLS policy to allow users to create withdrawals
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'withdrawals' AND column_name = 'account_number'
  ) THEN
    ALTER TABLE withdrawals ADD COLUMN account_number text;
  END IF;
END $$;

CREATE POLICY "Users can create withdrawals"
  ON withdrawals FOR INSERT
  TO authenticated
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own withdrawals"
  ON withdrawals FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());
