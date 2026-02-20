-- PACE DAO Database Schema for Supabase
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/cwykwzftrjumwkxipzox/sql

-- ============================================
-- USERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_address TEXT UNIQUE NOT NULL,
  email TEXT,
  display_name TEXT,
  avatar_url TEXT,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  pace_balance DECIMAL DEFAULT 0,
  streak INTEGER DEFAULT 0,
  total_distance DECIMAL DEFAULT 0, -- in km
  total_runs INTEGER DEFAULT 0,
  total_calories INTEGER DEFAULT 0,
  club_id UUID,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for wallet lookups
CREATE INDEX IF NOT EXISTS idx_users_wallet ON users(wallet_address);
CREATE INDEX IF NOT EXISTS idx_users_club ON users(club_id);

-- ============================================
-- RUNS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  distance DECIMAL NOT NULL, -- in km
  duration INTEGER NOT NULL, -- in seconds
  pace DECIMAL NOT NULL, -- seconds per km
  calories INTEGER,
  avg_heart_rate INTEGER,
  elevation DECIMAL, -- in meters
  route JSONB, -- [{lat, lng, timestamp}]
  xp_earned INTEGER DEFAULT 0,
  pace_earned DECIMAL DEFAULT 0,
  is_pending BOOLEAN DEFAULT true, -- true if $PACE not yet claimed
  start_time TIMESTAMP WITH TIME ZONE NOT NULL,
  end_time TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for run queries
CREATE INDEX IF NOT EXISTS idx_runs_user ON runs(user_id);
CREATE INDEX IF NOT EXISTS idx_runs_created_at ON runs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_runs_pending ON runs(is_pending) WHERE is_pending = true;

-- ============================================
-- CLUBS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS clubs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  location TEXT,
  logo_url TEXT,
  founder_id UUID NOT NULL REFERENCES users(id),
  member_count INTEGER DEFAULT 1,
  total_distance DECIMAL DEFAULT 0,
  requires_approval BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for club searches
CREATE INDEX IF NOT EXISTS idx_clubs_location ON clubs(location);
CREATE INDEX IF NOT EXISTS idx_clubs_name ON clubs(name);

-- ============================================
-- CLUB MEMBERS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS club_members (
  club_id UUID NOT NULL REFERENCES clubs(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member', -- 'founder', 'admin', 'member'
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (club_id, user_id)
);

-- Index for member queries
CREATE INDEX IF NOT EXISTS idx_club_members_user ON club_members(user_id);

-- ============================================
-- BADGES TABLE (Predefined achievements)
-- ============================================
CREATE TABLE IF NOT EXISTS badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT, -- Icon name (e.g., 'medal-outline')
  icon_color TEXT,
  bg_color TEXT,
  requirement_type TEXT NOT NULL, -- 'distance', 'runs', 'streak', 'pace', 'xp'
  requirement_value DECIMAL NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USER BADGES TABLE (Earned badges)
-- ============================================
CREATE TABLE IF NOT EXISTS user_badges (
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (user_id, badge_id)
);

-- Index for badge queries
CREATE INDEX IF NOT EXISTS idx_user_badges_user ON user_badges(user_id);

-- ============================================
-- CHALLENGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  type TEXT NOT NULL, -- 'distance', 'duration', 'frequency'
  target DECIMAL NOT NULL,
  reward_xp INTEGER DEFAULT 0,
  reward_pace DECIMAL DEFAULT 0,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CHALLENGE PARTICIPANTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS challenge_participants (
  challenge_id UUID NOT NULL REFERENCES challenges(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  progress DECIMAL DEFAULT 0,
  completed BOOLEAN DEFAULT false,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  PRIMARY KEY (challenge_id, user_id)
);

-- ============================================
-- REWARDS QUEUE TABLE (Pending blockchain rewards)
-- ============================================
CREATE TABLE IF NOT EXISTS rewards_queue (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  run_id UUID NOT NULL REFERENCES runs(id) ON DELETE CASCADE,
  amount DECIMAL NOT NULL, -- $PACE amount
  status TEXT DEFAULT 'pending', -- 'pending', 'queued', 'claimed', 'failed'
  tx_hash TEXT, -- Transaction hash when queued on-chain
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  queued_at TIMESTAMP WITH TIME ZONE,
  claimed_at TIMESTAMP WITH TIME ZONE
);

-- Index for reward queries
CREATE INDEX IF NOT EXISTS idx_rewards_user ON rewards_queue(user_id);
CREATE INDEX IF NOT EXISTS idx_rewards_status ON rewards_queue(status);

-- ============================================
-- FUNCTIONS
-- ============================================

-- Function to update user stats after a run
CREATE OR REPLACE FUNCTION update_user_stats_after_run()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE users
  SET
    total_runs = total_runs + 1,
    total_distance = total_distance + NEW.distance,
    total_calories = total_calories + COALESCE(NEW.calories, 0),
    xp = xp + NEW.xp_earned,
    updated_at = NOW()
  WHERE id = NEW.user_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-update user stats
DROP TRIGGER IF EXISTS trigger_update_user_stats ON runs;
CREATE TRIGGER trigger_update_user_stats
  AFTER INSERT ON runs
  FOR EACH ROW
  EXECUTE FUNCTION update_user_stats_after_run();

-- Function to calculate user level from XP
CREATE OR REPLACE FUNCTION calculate_level(xp_amount INTEGER)
RETURNS INTEGER AS $$
DECLARE
  level INTEGER := 1;
  total_xp_for_next_level INTEGER := 0;
BEGIN
  WHILE xp_amount >= total_xp_for_next_level LOOP
    level := level + 1;
    total_xp_for_next_level := total_xp_for_next_level + (level * 1000 + (level - 1) * 500);
  END LOOP;
  
  RETURN level;
END;
$$ LANGUAGE plpgsql;

-- Function to update user level automatically
CREATE OR REPLACE FUNCTION update_user_level()
RETURNS TRIGGER AS $$
BEGIN
  NEW.level := calculate_level(NEW.xp);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-calculate level from XP
DROP TRIGGER IF EXISTS trigger_update_user_level ON users;
CREATE TRIGGER trigger_update_user_level
  BEFORE UPDATE OF xp ON users
  FOR EACH ROW
  WHEN (OLD.xp IS DISTINCT FROM NEW.xp)
  EXECUTE FUNCTION update_user_level();

-- ============================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE clubs ENABLE ROW LEVEL SECURITY;
ALTER TABLE club_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE challenge_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE rewards_queue ENABLE ROW LEVEL SECURITY;

-- Users: Can read all, update own profile
CREATE POLICY "Users can view all profiles"
  ON users FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  USING (auth.uid()::text = id::text);

-- Runs: Can read all, insert/update own runs
CREATE POLICY "Runs are viewable by everyone"
  ON runs FOR SELECT
  USING (true);

CREATE POLICY "Users can insert own runs"
  ON runs FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own runs"
  ON runs FOR UPDATE
  USING (auth.uid()::text = user_id::text);

-- Clubs: Can read all, founders can update their clubs
CREATE POLICY "Clubs are viewable by everyone"
  ON clubs FOR SELECT
  USING (true);

CREATE POLICY "Club founders can update their clubs"
  ON clubs FOR UPDATE
  USING (auth.uid()::text = founder_id::text);

-- Club members: Can read all, users can join/leave
CREATE POLICY "Club members are viewable by everyone"
  ON club_members FOR SELECT
  USING (true);

CREATE POLICY "Users can join clubs"
  ON club_members FOR INSERT
  WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can leave clubs"
  ON club_members FOR DELETE
  USING (auth.uid()::text = user_id::text);

-- Rewards: Users can view own rewards
CREATE POLICY "Users can view own rewards"
  ON rewards_queue FOR SELECT
  USING (auth.uid()::text = user_id::text);

-- ============================================
-- SEED DATA (Sample badges)
-- ============================================

INSERT INTO badges (name, description, icon, icon_color, bg_color, requirement_type, requirement_value)
VALUES
  ('First 5K', 'Complete your first 5km run', 'medal-outline', '#D4880F', '#FFF3D9', 'distance', 5),
  ('Marathon', 'Complete a 42km marathon', 'trophy-outline', '#D4880F', '#FFF3D9', 'distance', 42),
  ('Century', 'Run 100km total', 'star-outline', '#8B5CF6', '#F3E8FF', 'distance', 100),
  ('Dedicated', 'Complete 50 runs', 'fitness-outline', '#10B981', '#D1FAE5', 'runs', 50),
  ('Streak Master', 'Maintain a 30-day streak', 'flame-outline', '#EF4444', '#FEE2E2', 'streak', 30),
  ('Speed Demon', 'Run under 4:00 min/km pace', 'flash-outline', '#F59E0B', '#FEF3C7', 'pace', 240),
  ('XP Champion', 'Reach 10,000 XP', 'ribbon-outline', '#3B82F6', '#DBEAFE', 'xp', 10000)
ON CONFLICT DO NOTHING;

-- ============================================
-- VIEWS FOR COMMON QUERIES
-- ============================================

-- View: User leaderboard by distance
CREATE OR REPLACE VIEW leaderboard_distance AS
SELECT
  u.id,
  u.wallet_address,
  u.display_name,
  u.avatar_url,
  u.total_distance,
  u.total_runs,
  u.level,
  u.club_id,
  c.name AS club_name
FROM users u
LEFT JOIN clubs c ON u.club_id = c.id
ORDER BY u.total_distance DESC;

-- View: User leaderboard by XP
CREATE OR REPLACE VIEW leaderboard_xp AS
SELECT
  u.id,
  u.wallet_address,
  u.display_name,
  u.avatar_url,
  u.xp,
  u.level,
  u.club_id,
  c.name AS club_name
FROM users u
LEFT JOIN clubs c ON u.club_id = c.id
ORDER BY u.xp DESC;

-- View: Recent runs (last 7 days)
CREATE OR REPLACE VIEW recent_runs AS
SELECT
  r.*,
  u.wallet_address,
  u.display_name,
  u.avatar_url
FROM runs r
JOIN users u ON r.user_id = u.id
WHERE r.created_at >= NOW() - INTERVAL '7 days'
ORDER BY r.created_at DESC;

-- ============================================
-- SUCCESS MESSAGE
-- ============================================
SELECT 'PACE DAO database schema created successfully! ✅' AS status;
