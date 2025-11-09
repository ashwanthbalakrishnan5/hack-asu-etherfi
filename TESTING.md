# Testing Guide - EtherFi Prediction Game

This guide will help you test all features of the no-loss prediction game without needing real weETH.

## Prerequisites

1. **Development Environment Setup**
   ```bash
   npm install
   npm run dev
   ```
   The app should now be running at `http://localhost:3000`

2. **Wallet Setup**
   - Install MetaMask or any Web3 wallet
   - You don't need any real tokens for testing
   - Any wallet address will work

## Quick Start: Demo Mode Setup

### Step 1: Connect Your Wallet
1. Navigate to `http://localhost:3000`
2. Click "Connect Wallet" button
3. Connect with any test wallet (no funds needed)

### Step 2: Initialize Demo Mode
1. Navigate to `/admin` page: `http://localhost:3000/admin`
2. You'll see the **"Demo Mode Setup"** card at the top
3. Click **"Initialize Demo Mode"** button
4. Wait for success message

**What this does:**
- ✅ Credits your account with 1000 YC (Yield Credits) instantly
- ✅ Simulates 1.5 weETH principal deposit
- ✅ Seeds 8 diverse prediction markets
- ✅ Sets up initial XP, level, and stats

### Step 3: Start Testing!
Navigate to `/play` and you're ready to test all features!

---

## Complete Feature Testing Checklist

### 1. Home Page
**URL:** `/`

**Test:**
- [ ] Hero section displays correctly
- [ ] "How It Works" 4-step diagram is visible
- [ ] EtherFi and Claude badges are present
- [ ] CTAs: "Connect Wallet" or "Enter Play" (if connected)
- [ ] "View Leaderboard" button works

**Expected Result:** Clean, modern landing page explaining the no-loss concept

---

### 2. Wallet Connection
**Location:** Header (any page)

**Test:**
- [ ] Click "Connect Wallet" button
- [ ] Wallet modal appears
- [ ] Connect with test wallet
- [ ] Address appears in header
- [ ] Disconnect works

**Expected Result:** Smooth wallet connection with clear states

---

### 3. Vault & YC System
**URL:** `/play` (Left Column)

**Test:**
- [ ] **VaultCard** displays:
  - Principal balance (should show 1.5 weETH after demo setup)
  - YC balance (should show ~1000 YC)
  - "SAFE" badge on principal
  - Simulated APR (5%)
- [ ] **YC Meter** shows breathing shimmer animation
- [ ] **Deposit/Withdraw buttons** are visible (disabled in demo mode)

**YC Accrual Test:**
- [ ] Wait 10-20 seconds and watch YC balance increase slightly
- [ ] Simulates yield accrual from principal

**Expected Result:** Clear separation of principal (safe) vs YC (spendable)

---

### 4. Prediction Markets
**URL:** `/play` (Right Column)

**Test:**
- [ ] 8 markets are displayed in cards
- [ ] Each market shows:
  - Question title
  - Difficulty (1-5 stars)
  - Close time countdown
  - YES/NO pool sizes
  - Implied odds
  - Status badge (Active/Resolved)
- [ ] Click "Place Bet" on any market

**Expected Result:** Clean market cards with all info visible

---

### 5. Bet Placement Flow
**URL:** `/play` → Click "Place Bet"

**Test:**
- [ ] **BetTicket panel** slides in from right
- [ ] Displays:
  - Market question
  - Your YC balance (1000 YC)
  - Side selector (YES/NO toggle)
  - Amount input
  - Expected payout calculation
  - Claude probability hint (if API configured)
- [ ] Enter bet amount (e.g., 50 YC)
- [ ] Select YES or NO
- [ ] Click "Confirm Bet"
- [ ] Success toast appears
- [ ] YC balance decreases
- [ ] Bet appears in "My Positions" section

**Expected Result:** Smooth bet placement with immediate feedback

**Note:** If you get an error about missing user, run demo setup again.

---

### 6. Claude Quests (AI Game Master)
**URL:** `/play` → Quests Panel

**Test:**
- [ ] Click **"Get Quests"** button
- [ ] Wait for Claude to generate quests (requires ANTHROPIC_API_KEY)
- [ ] 3 quest cards appear with:
  - Title
  - Question
  - Suggested stake
  - Difficulty (1-5)
  - Learning outcome
  - Close time
- [ ] Click "Accept Quest" on any quest
- [ ] Bet ticket opens pre-filled
- [ ] Place bet normally

**If Claude API is not configured:**
- You'll see an error about missing API key
- Skip this test or add `ANTHROPIC_API_KEY` to `.env.local`

**Expected Result:** 3 personalized quests tailored to your skill level

---

### 7. Claiming Winnings
**URL:** `/play` → My Positions

**Test (requires admin to resolve markets first):**

1. **Resolve a market (Admin):**
   - Go to `/admin`
   - Find the market you bet on
   - Click "Resolve YES" or "Resolve NO"
   - Confirm

2. **Claim winnings (Player):**
   - Go back to `/play`
   - Scroll to "My Positions"
   - If you won, you'll see "Claim YC" button
   - Click "Claim YC"
   - YC balance increases
   - Confetti animation plays (optional)
   - XP awarded

**Expected Result:** Smooth claim flow with clear win/loss indication

---

### 8. Profile & Achievements
**URL:** `/profile`

**Test:**
- [ ] **Profile Header** shows:
  - Avatar (first letter of address)
  - Display name or shortened address
  - Class badge (Novice/Degen/Oracle/Analyst/Whale)
  - Achievements count
- [ ] **Level & XP Card:**
  - Current level
  - XP progress bar
  - Next level threshold
- [ ] **Key Metrics:**
  - Accuracy %
  - Wisdom Index
  - Win Streak
  - Yield Efficiency
- [ ] **Detailed Stats:**
  - Total bets, wins, losses
  - YC balance, spent, won, profit/loss
  - Quests completed
- [ ] **Portfolio Analytics:**
  - Time series chart (Principal vs YC)
  - Allocation pie chart (YES vs NO)
  - Outcomes summary
  - AI Insights (if enough data)
- [ ] **Achievements Grid:**
  - Earned achievements in color
  - Locked achievements in grayscale
  - Hover for tooltips
- [ ] **Quest History:**
  - Timeline of accepted quests
- [ ] Click "Edit Profile"
  - Change display name
  - Toggle "Show on leaderboard"
  - Click "Save Changes"

**Expected Result:** Comprehensive profile with stats and analytics

---

### 9. Leaderboards
**URL:** `/leaderboard`

**Test:**
- [ ] Three tabs visible:
  - Accuracy Leaders
  - Wisdom Index Leaders
  - Quest Masters
- [ ] Switch between tabs
- [ ] Each shows ranked users (if any have 10+ bets)
- [ ] Search bar works (search by address)
- [ ] Current user row highlighted (if opted in)
- [ ] Pagination if >20 users

**To populate leaderboard:**
- You need multiple users with 10+ bets
- For demo, you may see "Not enough participants"

**Expected Result:** Clean leaderboard with multiple metrics

---

### 10. Onboarding Checklist
**Location:** Appears automatically after wallet connection

**Test:**
- [ ] Modal appears on first visit after connecting
- [ ] Shows 5 tasks:
  1. Connect Wallet (auto-completes)
  2. Deposit weETH (completes after demo setup)
  3. Generate Quests
  4. Place First Bet
  5. Claim Winnings
- [ ] Progress bar updates as tasks complete
- [ ] Click "Skip Tutorial" to dismiss
- [ ] Floating button appears in bottom-right corner
- [ ] Click button to reopen checklist

**Expected Result:** Helpful onboarding that tracks progress

---

### 11. Admin Panel
**URL:** `/admin`

**Test:**
- [ ] **Demo Setup Card:**
  - Instructions clear
  - "Initialize Demo Mode" button works
  - Success/error messages display
- [ ] **Create Market:**
  - Click "Create Market"
  - Fill in question, difficulty, days until close
  - Click "Create Market"
  - New market appears in list
- [ ] **Resolve Market:**
  - Find an active market
  - Click "Resolve YES" or "Resolve NO"
  - Market status changes to "Resolved"
  - Players can claim winnings

**Expected Result:** Full admin control for testing

---

## Common Testing Scenarios

### Scenario 1: Complete First-Time User Flow
1. Connect wallet
2. Initialize demo mode at `/admin`
3. Go to `/play`
4. Observe onboarding checklist
5. Place first bet (50 YC on any market)
6. Close checklist
7. Go to `/admin` and resolve that market (YES or NO)
8. Go back to `/play`
9. Claim winnings from "My Positions"
10. Check profile at `/profile` to see updated stats
11. View portfolio analytics

**Expected:** Smooth flow with clear feedback at each step

---

### Scenario 2: Quest-Driven Gameplay
1. Connect wallet, setup demo mode
2. Go to `/play`
3. Click "Get Quests" (requires Claude API key)
4. Accept a quest
5. Bet ticket opens pre-filled
6. Adjust amount if needed, confirm bet
7. Quest marked as accepted
8. Wait for admin to resolve market
9. Claim winnings
10. Receive Claude feedback on your decision
11. See quest in profile history

**Expected:** Adaptive quest system with personalized feedback

---

### Scenario 3: Achievement Unlocking
1. Setup demo mode
2. Place 1 bet → Unlock "First Blood" achievement
3. Win 3 bets in a row → Unlock "Hat Trick"
4. Reach 60% accuracy with 10+ bets → Unlock "Sharpshooter"
5. Complete 5 Claude quests → Unlock "Quest Master"
6. Achievement earned modal pops up with confetti
7. View all achievements in `/profile`

**Expected:** Satisfying achievement progression

---

### Scenario 4: Portfolio Analytics
1. Place 5-10 bets on different markets
2. Resolve some as wins, some as losses
3. Go to `/profile`
4. Scroll to "Portfolio Analytics"
5. View:
   - Time series chart showing YC growth
   - Allocation chart (YES vs NO distribution)
   - Outcomes summary (spent, won, net change)
   - AI Insights based on your behavior

**Expected:** Rich analytics with personalized insights

---

## Troubleshooting

### Issue: "User not found" error when placing bet
**Solution:**
- Run demo setup again at `/admin`
- Or manually create user via API: `POST /api/demo/setup` with `{ "address": "your_address" }`

### Issue: No markets showing
**Solution:**
- Run demo setup at `/admin` to seed markets
- Or manually create markets via admin panel

### Issue: Leaderboard shows "Error fetching leaderboard"
**Solution:**
- Database migration needed: `npx prisma migrate dev`
- Restart dev server: `npm run dev`

### Issue: Quest generation fails
**Solution:**
- Add `ANTHROPIC_API_KEY` to `.env.local`
- Or skip quest testing for now

### Issue: YC balance not accruing
**Solution:**
- Ensure principal > 0 (run demo setup)
- Wait 10-20 seconds for next accrual tick
- Check browser console for errors

### Issue: Charts not displaying
**Solution:**
- Ensure recharts is installed: `npm install recharts`
- Check browser console for errors

---

## Environment Variables

Create `.env.local` file with:

```env
# Required for Claude Quests
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional: Customize simulated APR
NEXT_PUBLIC_SIMULATED_APR=5

# Optional: Admin addresses (comma-separated)
NEXT_PUBLIC_ADMIN_ADDRESSES=0x_your_admin_address

# Contract addresses (not needed for demo mode)
NEXT_PUBLIC_WEETH_ADDRESS=0x...
NEXT_PUBLIC_VAULT_ADDRESS=0x...
NEXT_PUBLIC_CHAIN_ID=11155111
```

---

## Demo Mode vs. Real Mode

### Demo Mode (What you're testing now)
- No real weETH required
- YC credited instantly via API
- Simulated yield accrual
- Perfect for development and demos

### Real Mode (Production)
- Requires real weETH on Sepolia testnet
- Actual smart contract interactions
- Real yield accrual from EtherFi
- Oracle-based market resolution

---

## Testing Checklist Summary

### Core Features
- [x] Wallet connection
- [x] Demo mode setup
- [x] Vault display (Principal + YC)
- [x] YC accrual simulation
- [x] Market listing
- [x] Bet placement
- [x] Position tracking
- [x] Market resolution (admin)
- [x] Claiming winnings
- [x] XP and leveling

### Phase 4: Claude Integration
- [x] Quest generation (requires API key)
- [x] Probability hints
- [x] Post-resolution feedback

### Phase 5: Social Features
- [x] Achievements system
- [x] Leaderboards (3 types)
- [x] Profile stats
- [x] User classes (Whale, Oracle, etc.)

### Phase 6: Polish
- [x] Onboarding checklist
- [x] Portfolio analytics with charts
- [x] AI insights
- [x] UI/UX polish (padding, spacing)
- [x] Responsive design

---

## Next Steps After Testing

1. **Add Smart Contract Integration:**
   - Deploy GameVault.sol and YieldCredits.sol
   - Replace API calls with contract interactions
   - Add real weETH deposit/withdraw

2. **Production Deployment:**
   - Deploy to Vercel
   - Set up production database (PostgreSQL)
   - Configure environment variables
   - Enable mainnet or Sepolia testnet

3. **Advanced Features (Post-MVP):**
   - NFT achievement minting
   - Real oracle integration (Chainlink, UMA)
   - Multi-chain support
   - Social features (comments, following)
   - Mobile app

---

## Support

If you encounter issues during testing:
1. Check browser console for errors
2. Restart dev server: `npm run dev`
3. Clear browser cache and localStorage
4. Re-run database migrations: `npx prisma migrate dev`
5. Re-run demo setup at `/admin`

---

## Success Criteria

You've successfully tested the game if you can:
- ✅ Connect wallet and initialize demo mode
- ✅ Place a bet and see YC deducted
- ✅ Resolve a market and claim winnings
- ✅ View updated stats and analytics in profile
- ✅ See achievements unlock
- ✅ Navigate all pages without errors
- ✅ Experience smooth, polished UI

**Congratulations! The game is ready for demo presentation.** 🎉
