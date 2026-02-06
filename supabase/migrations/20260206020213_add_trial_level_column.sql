/*
  # Add trial level tracking to users table
  
  1. New Column
    - `trial_level_started_at` (timestamptz) - Tracks when user activated the trial level, NULL if not activated
  
  2. Purpose
    - Allows tracking of 3-day trial period for "NIVEL PRACTICANTE"
    - When activated, user can watch videos for 3 days without purchasing a level
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'trial_level_started_at'
  ) THEN
    ALTER TABLE users ADD COLUMN trial_level_started_at timestamptz DEFAULT NULL;
  END IF;
END $$;