/*
  # Add video tracking fields to users table

  1. New Columns
    - `videos_watched_today` (integer)
      - Tracks the number of videos watched by the user today
      - Default value: 0
    - `last_video_date` (timestamp)
      - Tracks the date of the last video watched
      - Used to reset the counter daily

  2. Purpose
    - Enable tracking of daily video limits based on VIP level
    - Show "Vuelve mañana" message when daily limit is exceeded
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'videos_watched_today'
  ) THEN
    ALTER TABLE users ADD COLUMN videos_watched_today integer DEFAULT 0;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'last_video_date'
  ) THEN
    ALTER TABLE users ADD COLUMN last_video_date timestamptz;
  END IF;
END $$;