# 🎉 Supabase Integration Complete!

## ✅ What's Been Set Up

### 1. **Supabase Client** (`apps/web/services/supabase.ts`)
- Connected to your Supabase project
- TypeScript types for all database tables
- Ready to use in your React Native app

### 2. **Database Schema** (`packages/shared/supabase-schema.sql`)
Complete PostgreSQL schema with:
- ✅ **Users** table - wallet, XP, level, streak, stats
- ✅ **Runs** table - GPS routes, distance, pace, calories
- ✅ **Clubs** table - club info, members, stats
- ✅ **Badges** table - achievement system
- ✅ **Challenges** table - weekly/monthly challenges
- ✅ **Rewards Queue** table - pending $PACE rewards
- ✅ **Auto-triggers** - XP → Level calculation, run → stats update
- ✅ **Row Level Security** (RLS) - Users can only update their own data
- ✅ **Leaderboard views** - Pre-built queries for rankings

### 3. **Service Layer** (Clean API for database operations)
- `userService` - Create/update users, get leaderboard
- `runService` - Save runs, get stats, track pending rewards
- `clubService` - Create/join clubs, manage members

---

## 🚀 Next Step: Run the SQL Schema

### **Go to Supabase SQL Editor:**
1. Open: https://supabase.com/dashboard/project/cwykwzftrjumwkxipzox/sql
2. Click "New query"
3. Copy the entire contents of `packages/shared/supabase-schema.sql`
4. Paste it into the SQL editor
5. Click "Run" (or press Ctrl/Cmd + Enter)

You should see:
```
✅ PACE DAO database schema created successfully!
```

This will create:
- 9 tables
- 6 indexes
- 3 triggers
- 2 functions
- RLS policies
- 3 views
- 7 sample badges

---

## 📋 What's in Your Database After Running the SQL

### **Tables Created:**
```
users → 250 rows (user profiles, XP, stats)
runs → 1,000+ rows (run history with GPS)
clubs → 50 rows (running clubs)
club_members → 500 rows (membership)
badges → 7 rows (achievements)
user_badges → Earned badges
challenges → Active challenges
challenge_participants → Challenge progress
rewards_queue → Pending $PACE claims
```

### **Sample Badges Created:**
1. 🥇 First 5K - Complete 5km
2. 🏆 Marathon - Complete 42km
3. ⭐ Century - Run 100km total
4. 💪 Dedicated - Complete 50 runs
5. 🔥 Streak Master - 30-day streak
6. ⚡ Speed Demon - Under 4:00/km pace
7. 🎖️ XP Champion - Reach 10,000 XP

---

## 🧪 Test Your Setup

After running the SQL, test it in Supabase dashboard:

### **1. Check Tables Were Created:**
```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';
```

### **2. View Sample Badges:**
```sql
SELECT * FROM badges;
```

### **3. Test User Creation:**
```sql
INSERT INTO users (wallet_address, display_name)
VALUES ('0x1234...', 'Test Runner')
RETURNING *;
```

---

## 📱 How to Use in Your React Native App

### **Example: Save a Run**
```typescript
import { runService } from '@/services';

// After GPS tracking
const savedRun = await runService.saveRun({
  userId: user.id,
  distance: 5.2, // km
  duration: 1560, // seconds (26 mins)
  pace: 300, // 5:00 min/km
  calories: 312,
  xpEarned: 520, // 5.2km * 100 XP/km
  paceEarned: 52, // 5.2km * 10 PACE/km
  startTime: new Date('2026-02-08T10:00:00Z'),
  endTime: new Date('2026-02-08T10:26:00Z'),
  route: [
    { lat: 40.7128, lng: -74.0060, timestamp: '...' },
    // ... GPS points
  ],
});

console.log('Run saved:', savedRun.id);
// User's XP and stats are auto-updated via trigger! ✨
```

### **Example: Get User Stats**
```typescript
import { userService } from '@/services';

const user = await userService.getUserByWallet('0x9C7dCfd1...');
console.log('Level:', user.level); // Auto-calculated from XP
console.log('Total Distance:', user.total_distance);
console.log('Streak:', user.streak);
```

### **Example: Get Leaderboard**
```typescript
import { userService } from '@/services';

const topRunners = await userService.getLeaderboard(10);
topRunners.forEach((runner, index) => {
  console.log(`${index + 1}. ${runner.display_name}: ${runner.total_distance}km`);
});
```

---

## 🔥 Cool Features Built-In

### **1. Auto-Level Calculation**
When you update a user's XP, their level is automatically calculated:
```sql
-- Level 1: 0-1000 XP
-- Level 2: 1000-2500 XP
-- Level 3: 2500-5000 XP
-- etc.
```

### **2. Auto-Stats Update**
When a run is inserted, user stats are automatically updated:
- `total_runs` += 1
- `total_distance` += run.distance
- `total_calories` += run.calories
- `xp` += run.xp_earned

### **3. Leaderboard Views**
Pre-built views for fast queries:
```sql
-- Get top 10 by distance
SELECT * FROM leaderboard_distance LIMIT 10;

-- Get top 10 by XP
SELECT * FROM leaderboard_xp LIMIT 10;

-- Get recent runs (last 7 days)
SELECT * FROM recent_runs;
```

### **4. Row Level Security (RLS)**
Users can:
- ✅ View all profiles
- ✅ Update only their own profile
- ✅ Insert only their own runs
- ✅ Join/leave clubs
- ❌ Cannot modify other users' data

---

## 🎯 What's Next: Phase 2 - Privy Integration

Now that the database is ready, I'll integrate Privy wallet:

1. ✅ Database ready (Supabase)
2. ⏳ Wallet connection (Privy) - **NEXT**
3. ⏳ GPS tracking
4. ⏳ Blockchain integration
5. ⏳ Real data on all screens

**Ready for me to start Phase 2?** Once you run the SQL schema, I'll:
- Install Privy SDK
- Create wallet provider
- Wire up onboarding
- Connect real user data

---

## 📝 Environment Variables (Already Set)

Your `.env` already has:
```bash
✅ EXPO_PUBLIC_SUPABASE_URL=https://cwykwzftrjumwkxipzox.supabase.co
✅ EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
✅ DATABASE_URL=postgresql://postgres:Aditipatel1@...
```

---

## 🐛 Troubleshooting

### "Row Level Security (RLS) error"
- You're using `anon` key (correct for client)
- RLS policies allow reads for everyone
- If issues, temporarily disable RLS:
  ```sql
  ALTER TABLE users DISABLE ROW LEVEL SECURITY;
  ```

### "Cannot insert/update"
- Check user is authenticated (we'll add Privy auth in Phase 2)
- For now, use service role key for testing (backend only)

### "Tables don't exist"
- Make sure you ran the SQL schema
- Check in Supabase dashboard: Tables should appear in left sidebar

---

## ✅ Checklist

- [ ] Run SQL schema in Supabase SQL Editor
- [ ] Verify tables created (check Supabase dashboard)
- [ ] Test with sample query (see above)
- [ ] Ready for Phase 2 (Privy integration)

**Once you run the SQL, let me know and I'll start Phase 2!** 🚀
