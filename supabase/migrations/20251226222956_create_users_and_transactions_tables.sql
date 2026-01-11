/*
  # Create users profile and transaction tables

  1. New Tables
    - `users` - User profiles with phone, balance, and level
    - `recharges` - Record of all user recharges
    - `withdrawals` - Record of all user withdrawals
    - `daily_income` - Track daily earnings
    - `referrals` - Track referral relationships
    - `levels` - User level information
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users to access their own data
*/

CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  phone text UNIQUE NOT NULL,
  full_name text NOT NULL,
  balance decimal(12, 2) DEFAULT 0,
  total_income decimal(12, 2) DEFAULT 0,
  current_level_id uuid,
  banking_info jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  price decimal(12, 2) NOT NULL,
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_levels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  level_id uuid NOT NULL REFERENCES levels(id),
  purchased_at timestamptz DEFAULT now(),
  UNIQUE(user_id, level_id)
);

CREATE TABLE IF NOT EXISTS recharges (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount decimal(12, 2) NOT NULL,
  method text,
  status text DEFAULT 'completed',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS withdrawals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount decimal(12, 2) NOT NULL,
  status text DEFAULT 'pending',
  method text,
  created_at timestamptz DEFAULT now(),
  completed_at timestamptz
);

CREATE TABLE IF NOT EXISTS daily_income (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  amount decimal(12, 2) NOT NULL,
  source text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  referred_user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  commission decimal(12, 2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(referrer_id, referred_user_id)
);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE recharges ENABLE ROW LEVEL SECURITY;
ALTER TABLE withdrawals ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_income ENABLE ROW LEVEL SECURITY;
ALTER TABLE referrals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_levels ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view own recharges"
  ON recharges FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view own withdrawals"
  ON withdrawals FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view own daily income"
  ON daily_income FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view own levels"
  ON user_levels FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can view own referrals"
  ON referrals FOR SELECT
  TO authenticated
  USING (referrer_id = auth.uid() OR referred_user_id = auth.uid());
