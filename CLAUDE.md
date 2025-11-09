# CLAUDE.md — Project Documentation & Build Instructions

## Purpose

**EtherFi Yield Quest** is a demo-ready dApp showcasing a no-loss, yield-only prediction game concept built with Claude AI as the adaptive Game Master. The core narrative: users deposit weETH (principal stays safe), earn Yield Credits from yield, and spend only YC on predictions—never risking their principal.

**Current Status:** ~80-85% feature-complete. Demo-ready but NOT production-ready.

**Strict Rules for AI Agents:**

- Do not hallucinate; if a fact is unknown, leave a TODO comment or ask.
- Do not generate code inside this file.
- Do not add random files, boilerplate readmes, or non-essential documentation.
- This file is the single source of truth for project state and requirements.
- After completing work, update this file with new constraints or next-step instructions only.
- Do NOT add progress logs, test reports, or status updates to this file.

---

## Product Narrative

**The Core Loop:**
1. Users stake **weETH** (principal) → principal is **SAFE** and never used to bet
2. **Yield Credits (YC)** accrue from principal (currently simulated at 5% APR)
3. Users spend **YC only** to make predictions on binary YES/NO markets
4. **Two game modes**: Manual (user places bets) or Automated (Claude AI trades automatically)
5. Users **level up** and earn **achievements** for accuracy, skill, and consistency
6. Users **withdraw principal anytime**; wins/losses only affect YC balance

**UI Goal:** Make this loop immediately obvious without documentation.

---

## Current Implementation Status

### ✅ FULLY IMPLEMENTED (90-100%)

#### Core Infrastructure
- **Next.js 16** with App Router and TypeScript
- **Wagmi 2.19 + Viem 2.38** for Web3 integration
- **RainbowKit 2.2** for wallet connection
- **Prisma 6.19** with SQLite database
- **Tailwind CSS 4** with custom dark theme design system
- **Framer Motion 12** for animations
- **Anthropic Claude Haiku 4.5** API integration

#### Wallet & Authentication
- Multi-wallet support (MetaMask, WalletConnect, Coinbase, etc.)
- Wallet connection/disconnection flows
- Address display with ENS resolution capability
- Network validation (hardcoded to Sepolia testnet)
- Automatic user creation on first interaction

#### Markets & Prediction Gameplay
- Admin can create binary YES/NO prediction markets
- Market cards display: question, difficulty (1-5), close time, pools, implied odds
- Users can browse active and resolved markets
- Bet placement with YC balance validation
- Position tracking (active and claimed)
- Market resolution by admin (YES/NO/CANCEL outcomes)
- Claim winnings flow with payout calculation
- 8 demo markets seeded with varied topics

#### Yield Credits System
- YC balance tracking per user (database-backed)
- New users start with 1000 YC for demo purposes
- YC spent/won tracking with full audit trail
- YC cannot be transferred (only spent or won)
- Simulated APR (5% hardcoded in config)
- YC Meter component with visual indicators

#### Player Progression
- **XP System**: +10 for bets, +20 for wins, +50 for 3-win streaks, +30 for quests
- **Level System**: `level = sqrt(xp / 100)` with quadratic thresholds
- **Skill Metrics**:
  - Accuracy: `wins / totalBets * 100`
  - Yield Efficiency: `(ycWon - ycSpent) / ycSpent * 100`
  - Wisdom Index: `(accuracy * 0.5) + (yieldEfficiency * 0.3) + (streakBonus * 0.2)`
- Streak tracking (consecutive wins)

#### Achievements System
- 7 achievement types with rarity tiers (Common → Legendary):
  - FIRST_BLOOD: Place first bet (Common)
  - HAT_TRICK: 3 wins in a row (Rare)
  - SHARPSHOOTER: >60% accuracy with 10+ bets (Epic)
  - QUEST_MASTER: Complete 5 Claude quests (Rare)
  - DIAMOND_HANDS: Withdraw after 7 days (Uncommon)
  - WHALE: Deposit >1 weETH (Rare)
  - ORACLE: >75% accuracy with 20+ bets (Legendary)
- Achievement checking triggered after relevant actions
- Achievement earned modal with confetti animation
- Achievement badges on profile (earned vs locked states)

#### Claude AI Integration
1. **Quest Generation** (`POST /api/quests/generate`)
   - Generates 3 personalized quests per request
   - Adaptive difficulty based on user accuracy
   - JSON-only responses with structured data
   - Quest storage in database

2. **Probability Hints** (`POST /api/claude/probability-hint`)
   - Returns probability (0-1), rationale, educational tip
   - Displayed in BetTicket component
   - Cached per market for performance

3. **Automated Predictions** (`POST /api/gamemode/predict`)
   - Claude analyzes market questions
   - Returns YES/NO prediction with confidence score
   - Automatically places bets if confidence meets threshold
   - Respects risk level settings

#### Game Modes
- **Manual Mode**: User browses and places bets manually
- **Automated Mode**: Claude researches and bets automatically
  - Risk level selector (Low/Medium/High)
  - Max bet per market setting
  - Min confidence threshold slider
  - Enable/disable toggle
  - Stats dashboard (active bets, YC deployed, estimated returns)

#### Leaderboards
- Three tabs: Accuracy Leaders, Wisdom Index Leaders, Quest Masters
- Pagination (20 per page)
- User search by address/ENS
- Current user highlighting
- Opt-in/opt-out toggle in profile
- Minimum participation threshold

#### Profile Page
- User stats: level, XP, accuracy, wisdom index
- Total bets, wins, losses display
- YC balance and principal display
- Achievement grid with earned/locked states
- Display name setting
- Leaderboard visibility toggle
- Betting history (basic)

#### Admin Panel
- Create new markets
- Resolve markets with outcome selection
- Demo mode setup button (seeds data)
- Gated by admin address (simple check)

#### Demo Mode
- Auto-generates realistic user stats for new users
- Seeds 8 diverse prediction markets
- Auto-generates 2-3 common achievements
- 1000 YC starting balance
- 1.5 weETH simulated principal
- One-click setup via admin panel

#### UI/UX
- Dark theme with cyan/teal accents (EtherFi colors)
- Responsive design (mobile, tablet, desktop)
- WCAG AA accessibility compliance
- Keyboard navigation support
- Focus states always visible
- Loading states and skeleton loaders
- Toast notification system
- Empty states with CTAs
- Tooltips for educational content
- Motion respects `prefers-reduced-motion`

### ⚠️ PARTIALLY IMPLEMENTED (50-89%)

#### Vault & Principal Management
- **Status**: UI complete, contracts exist but NOT deployed
- VaultCard component displays principal and YC balances
- DepositModal and WithdrawModal components built
- GameVault.sol contract written (~120 lines)
- MockWeETH.sol contract written (~45 lines)
- **GAP**: Contracts have placeholder addresses (0x0 in config)
- **GAP**: No deployment scripts or mainnet deployment
- **GAP**: Frontend uses MockWeETH, not real EtherFi weETH

#### Portfolio Analytics
- **Status**: Components exist, data collection incomplete
- PortfolioAnalytics component built with Recharts
- Basic time series tracking
- **GAP**: Limited historical data collection
- **GAP**: AI-generated insights not fully implemented

#### Education Layer
- **Status**: Tooltips exist, onboarding flow not interactive
- Tooltips on key concepts (Principal, YC, Wisdom Index, etc.)
- **GAP**: No interactive onboarding checklist in UI
- **GAP**: Documented in TESTING.md but not built as modal

#### Quest System
- **Status**: Claude generates quests, quest-to-market linking incomplete
- Quest generation works via Claude API
- Quest storage in database
- **GAP**: Optional marketId field not fully utilized
- **GAP**: Quests don't directly suggest specific markets to bet on
- **GAP**: Feedback mechanism exists but not fully featured

#### Daily Rewards
- **Status**: Components and endpoints exist, not integrated
- DailyRewards component built
- API endpoint exists
- **GAP**: Not integrated into main gameplay UI
- **GAP**: No visible claim flow

### ❌ NOT IMPLEMENTED / MOCKED

#### Real EtherFi Integration
- Uses MockWeETH instead of real weETH contract
- APR is simulated (5% hardcoded, not fetched from protocol)
- No live yield accrual from actual EtherFi protocol
- Vault contract not deployed to any network

#### Smart Contract Deployment
- GameVault.sol and MockWeETH.sol written but not deployed
- No deployment scripts
- No contract verification on Etherscan
- No mainnet or testnet addresses configured

#### Production Features
- No proper admin authentication (uses simple address check)
- No signature verification for admin actions
- No rate limiting on API endpoints
- No structured logging or error tracking (Sentry, etc.)
- No database backups (SQLite is local/ephemeral)
- No secrets management (API keys in .env.local)
- No monitoring or observability

#### NFT Achievement Minting
- Achievement designs exist
- No on-chain minting logic
- Only database records

#### Advanced Features (Post-Launch)
- No oracle integration (Chainlink, Pyth, UMA)
- No social features (comments, following, messaging)
- No tournament mode
- No referral system
- No multi-chain support
- No mobile app or PWA
- No gasless transactions

#### Player Class Assignment
- Class types defined (Oracle, Degen, Analyst, Whale)
- **NOT IMPLEMENTED**: Auto-assignment logic
- **NOT IMPLEMENTED**: Field not populated in database

---

## Technology Stack (Actual)

### Frontend
- Next.js 16.0.1 (App Router)
- TypeScript 5
- React 19.2.0
- Tailwind CSS 4 + PostCSS
- Framer Motion 12.0.0
- Lucide React 0.553 (icons)
- Wagmi 2.19.2 + Viem 2.38.6
- RainbowKit 2.2.9
- Zustand 5.0.8 (state management)
- React Hook Form 7.66.0 + Zod 4.1.12
- Recharts 3.3.0
- TanStack React Query 5.90.7
- date-fns 4.1.0

### Backend
- Next.js 16 API Routes (all endpoints)
- No separate Node.js server
- No Python FastAPI/Flask server

### Database
- SQLite (local development)
- Prisma 6.19.0 (ORM)
- @prisma/adapter-libsql 6.19.0

### Smart Contracts
- Solidity 0.8.20
- Hardhat 2.27.0
- OpenZeppelin Contracts 5.4.0
- **Status**: Written but NOT deployed

### External APIs
- Anthropic Claude API (@anthropic-ai/sdk 0.68.0)
- Model: Claude Haiku 4.5 (20251001)
- RPC Provider: Configurable (Alchemy/Infura/public)

### Development Tools
- ESLint 9
- Prettier 3.6.2
- dotenv 17.2.3

---

## Project Structure

```
/home/user/hack-asu-etherfi/
├── /app                          # Next.js App Router
│   ├── /api                      # 28 API route endpoints
│   │   ├── /achievements         # Achievement checking and retrieval
│   │   ├── /analytics            # Portfolio analytics data
│   │   ├── /claude               # Claude AI integration
│   │   ├── /credits              # YC credit purchase
│   │   ├── /demo                 # Demo mode setup
│   │   ├── /gamemode             # Automated betting (predict, toggle, stats, settings)
│   │   ├── /leaderboard          # Global leaderboards
│   │   ├── /markets              # Market CRUD and resolution
│   │   ├── /positions            # Bet placement and claiming
│   │   ├── /quests               # Quest generation and management
│   │   ├── /rewards              # Daily reward system
│   │   ├── /users                # User profile and stats
│   │   └── /yc                   # Yield Credits balance and accrual
│   ├── /play                     # Main gameplay page
│   ├── /profile                  # User profile page
│   ├── /leaderboard              # Leaderboard page
│   ├── /admin                    # Admin panel (gated)
│   ├── page.tsx                  # Home page
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── /components                   # 32 React components
│   ├── /ui                       # Design system (Button, Card, Input, Badge, etc.)
│   ├── /wallet                   # WalletButton
│   ├── /vault                    # VaultCard, Modals, YCMeter, DailyBonusCard
│   ├── /markets                  # MarketCard, BetTicket, Lists
│   ├── /quests                   # QuestCard, QuestsPanel, History, Feedback
│   ├── /gamemode                 # GameModePanel
│   ├── /profile                  # LevelBadge, AchievementBadge, Analytics
│   ├── /credits                  # CreditsWidget, Store, DailyRewards
│   ├── /leaderboard              # Leaderboard display
│   ├── /layout                   # Header, Footer
│   └── /providers                # Web3Provider
├── /lib
│   ├── /types                    # TypeScript type definitions
│   ├── /hooks                    # Custom React hooks
│   ├── /stores                   # Zustand stores (toast.ts)
│   ├── /contracts                # Smart contract ABIs (GameVault, MockWeETH)
│   ├── config.ts                 # Configuration and environment
│   ├── wagmi.ts                  # Wagmi/Viem Web3 config
│   ├── prisma.ts                 # Prisma client setup
│   ├── achievements.ts           # Achievement logic and definitions
│   └── (other utilities)
├── /prisma
│   └── schema.prisma             # Database schema (5 models)
├── /contracts
│   ├── GameVault.sol             # Vault contract (NOT deployed)
│   └── MockWeETH.sol             # Mock weETH token (NOT deployed)
├── /scripts                      # Demo data utility scripts
├── /artifacts                    # Compiled contract artifacts
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── next.config.ts                # Next.js config
├── tailwind.config.js            # Tailwind CSS config
├── hardhat.config.js             # Hardhat config
├── CLAUDE.md                     # This file
├── SETUP.md                      # Setup instructions
├── README.md                     # Project documentation
├── TESTING.md                    # Testing guide
└── .env.example                  # Environment variables template
```

---

## Database Schema (Prisma)

### Models

1. **User** (Primary entity)
   - `id`: UUID
   - `address`: Unique wallet address (lowercase)
   - `ycBalance`: Float (Yield Credits)
   - `principal`: Float (weETH deposited)
   - `lastAccrualTime`: DateTime
   - `xp`: Int
   - `level`: Int
   - `accuracy`: Float
   - `totalBets`, `wins`, `losses`: Int
   - `streakCount`: Int (consecutive wins)
   - `ycSpent`, `ycWon`: Float
   - `yieldEfficiency`, `wisdomIndex`: Float
   - `completedQuests`: Int
   - `showOnLeaderboard`: Boolean
   - `displayName`: String (optional)
   - `firstDepositAt`, `firstWithdrawAt`: DateTime (optional)

2. **Market**
   - `id`: UUID
   - `question`: String (YES/NO question)
   - `closeTime`: DateTime
   - `difficulty`: Int (1-5)
   - `yesPool`, `noPool`: Float
   - `resolved`: Boolean
   - `outcome`: String (YES/NO/CANCEL/null)
   - Relations: positions[]

3. **Position** (User's bet on a market)
   - `id`: UUID
   - `userId`, `marketId`: String
   - `side`: String (YES/NO)
   - `amount`: Float (YC staked)
   - `claimed`: Boolean
   - Relations: market

4. **Quest** (Claude-generated quests)
   - `id`: UUID
   - `userId`, `marketId`: String (marketId optional)
   - `title`, `question`: String
   - `suggestedStake`: Float
   - `difficulty`: Int (1-5)
   - `learningOutcome`: String
   - `closeTime`: DateTime
   - `accepted`, `completed`: Boolean
   - `outcome`, `feedback`, `suggestion`: String (optional)

5. **Achievement**
   - `id`: UUID
   - `userId`: String
   - `type`: String (ACHIEVEMENT_TYPE enum)
   - `earnedAt`: DateTime
   - Unique: [userId, type]

---

## API Routes (28 Total)

### Achievements
- `GET /api/achievements` - Get user's earned and locked achievements
- `POST /api/achievements/check` - Check and award achievements

### Analytics
- `GET /api/analytics/[address]` - Get portfolio analytics data

### Claude AI
- `POST /api/claude/probability-hint` - Get probability hint for a market

### Credits
- `POST /api/credits/purchase` - Purchase YC (multiple payment methods)

### Demo
- `POST /api/demo/setup` - Initialize demo mode with seed data

### Game Mode
- `POST /api/gamemode/predict` - Automated prediction and betting
- `GET /api/gamemode/stats` - Get automated betting statistics
- `POST /api/gamemode/settings` - Save automated mode settings
- `POST /api/gamemode/toggle` - Enable/disable automated mode

### Leaderboard
- `GET /api/leaderboard` - Get leaderboard data (filtered by type/page)

### Markets
- `GET /api/markets` - List all markets with optional filtering
- `POST /api/markets` - Create new market (admin)
- `PATCH /api/markets/:id/resolve` - Resolve market (admin)
- `POST /api/markets/seed` - Seed demo markets
- `POST /api/markets/auto-resolve` - Auto-resolve expired markets

### Positions
- `GET /api/positions` - Get user's positions
- `POST /api/positions` - Place a bet on a market
- `POST /api/positions/:id/claim` - Claim winnings

### Quests
- `POST /api/quests/generate` - Generate 3 personalized quests via Claude
- `GET /api/quests/user` - Get user's quests
- `POST /api/quests/accept` - Accept a quest
- `POST /api/quests/feedback` - Get Claude feedback on quest result

### Rewards
- `GET /api/rewards/daily` - Check daily reward eligibility
- `POST /api/rewards/daily/claim` - Claim daily bonus

### Users
- `GET /api/users/[address]` - Get/create user profile with demo data

### Yield Credits
- `GET /api/yc/balance` - Get YC balance (creates user if needed)
- `POST /api/yc/accrue` - Simulate YC accrual from principal
- `POST /api/yc/withdraw` - Withdraw YC (if implemented)
- `POST /api/yc/update-principal` - Update principal balance

---

## Design System

### Color Palette (Dark Theme)
- **Background**: `#0a0f1a` (near-black)
- **Surface**: `#131b2e` (dark navy)
- **Primary**: `#00d4ff` (cyan/teal - EtherFi brand)
- **Success**: `#4ade80` (soft green)
- **Warning**: `#fbbf24` (amber)
- **Error**: `#ef4444` (red)
- **Claude/Secondary**: `#c4b5fd` (lavender)

### Typography
- Headings: Geometric modern sans
- Body: Highly legible sans with generous line-height
- Numerics: Tabular numerals for balances
- Max 2 font families

### Layout & Spacing
- 12-column responsive grid
- 8px base spacing unit
- Card padding: 16-24px
- Max content width: 1200-1280px

### Components
- Buttons: Primary, secondary, subtle variants
- Cards: Rounded, hover shadows, gradient variants
- Inputs: Labels, helpers, error text
- Tooltips: 1-2 lines, hover delay
- Toasts: Auto-dismiss, bottom-center/top-right

### Animations
- Duration: 150-250ms with easing
- YC accrual: Breathing shimmer effect
- Achievements: Confetti + scale-in
- Respect `prefers-reduced-motion`

### Accessibility
- WCAG AA contrast (4.5:1 minimum)
- Full keyboard navigation
- Focus states always visible
- ARIA labels on interactive elements

---

## Known Issues & TODOs

### Critical (Blocks Production)
1. **Smart Contracts Not Deployed**
   - GameVault.sol and MockWeETH.sol written but addresses are 0x0
   - No deployment scripts
   - No testnet or mainnet deployment
   - Frontend cannot interact with real contracts

2. **Admin Authentication Inadequate**
   - Simple address check from config (not secure)
   - No signature verification
   - TODO comments in `/app/api/markets/route.ts:85` and `/app/api/markets/[id]/resolve/route.ts:23`

3. **Database Not Production-Ready**
   - SQLite is local/ephemeral
   - No backups or replication
   - Would fail in production deployment

### High Priority
4. **Automated Mode Settings Not Persisted**
   - Settings UI exists but values logged only
   - Should be stored in User model
   - Missing fields: `automatedEnabled`, `riskLevel`, `maxBetPerMarket`, `minConfidence`

5. **Real EtherFi Integration Missing**
   - Uses MockWeETH instead of real weETH
   - APR is hardcoded (5%), not fetched from protocol
   - No live yield accrual

6. **Player Class Assignment Not Implemented**
   - Types defined but not calculated/assigned
   - Field not populated in database

### Medium Priority
7. **Quest-to-Market Linking Incomplete**
   - Quests generated but don't suggest specific markets
   - Optional `marketId` field not fully utilized

8. **Daily Rewards Not Integrated**
   - Component and endpoint exist
   - Not visible in main gameplay UI

9. **Onboarding Checklist Not Built**
   - Documented in TESTING.md
   - No interactive modal in UI

10. **Limited Error Handling**
    - Generic error messages
    - Some server errors leak details
    - No structured logging

### Low Priority
11. **No Automated Testing**
    - Only manual testing guidance
    - No unit, integration, or contract tests

12. **No Caching Strategy**
    - Claude API calls should be cached
    - Probability hints mentioned to cache but unclear

13. **No Rate Limiting**
    - API endpoints can be spammed
    - Claude API could be abused

---

## Environment Variables

Required in `.env.local`:

```bash
# Database
DATABASE_URL="file:./dev.db"

# Anthropic Claude AI
ANTHROPIC_API_KEY="sk-ant-..."

# Web3 (RainbowKit)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID="your-project-id"

# Network (Sepolia testnet)
NEXT_PUBLIC_CHAIN_ID="11155111"

# Smart Contracts (currently 0x0 placeholders)
NEXT_PUBLIC_WEETH_ADDRESS="0x0000000000000000000000000000000000000000"
NEXT_PUBLIC_VAULT_ADDRESS="0x0000000000000000000000000000000000000000"

# Admin (simple address check - not secure)
ADMIN_ADDRESS="0x..."

# Demo Configuration
NEXT_PUBLIC_DEMO_MODE="true"
NEXT_PUBLIC_SIMULATED_APR="5"
```

---

## Quality Criteria (Demo Readiness)

### ✅ ACHIEVED
- Users can connect wallet with RainbowKit
- Demo mode provides realistic user data automatically
- Users can browse and place YC bets on markets
- Admin can create and resolve markets
- Users can claim winnings after resolution
- Profile shows level, XP, accuracy, achievements
- Leaderboards display top users by metrics
- Interface is modern, consistent, accessible
- Manual and Automated game modes toggle
- Claude AI generates quests and probability hints

### ⚠️ PARTIAL
- weETH balance reading (uses mock contract)
- YC accrues visually (simulated, not real yield)
- Deposit/withdraw UI exists (contracts not deployed)

### ❌ NOT ACHIEVED
- Real EtherFi weETH integration
- Live APR from protocol
- On-chain contract interactions
- Production-grade authentication
- Production-grade database
- Automated testing coverage

---

## Next Steps (Priority Order)

### For Demo Improvement
1. **Deploy Smart Contracts to Sepolia Testnet**
   - Write deployment script
   - Deploy GameVault.sol and MockWeETH.sol
   - Update addresses in config
   - Verify contracts on Etherscan

2. **Complete Onboarding Flow**
   - Build interactive checklist modal
   - Track completion in user record
   - Show on first visit

3. **Integrate Daily Rewards**
   - Add DailyRewards component to Play page
   - Make claim flow visible and functional

4. **Complete Quest-to-Market Linking**
   - Quests should suggest specific markets
   - Show "Recommended by Claude" badge on markets

### For Production Readiness
5. **Implement Proper Authentication**
   - Signature verification for admin actions
   - Replace simple address checks

6. **Upgrade Database**
   - Migrate from SQLite to PostgreSQL
   - Implement backup strategy
   - Add database migrations

7. **Add Rate Limiting & Security**
   - Implement rate limiting on all API routes
   - Add structured logging (Sentry, Datadog, etc.)
   - Implement secrets management

8. **Real EtherFi Integration**
   - Replace MockWeETH with real weETH contract
   - Fetch live APR from EtherFi protocol
   - Implement real yield accrual

9. **Testing & QA**
   - Write unit tests for utilities
   - Write integration tests for API routes
   - Write contract tests for GameVault
   - Set up CI/CD with automated testing

10. **Monitoring & Observability**
    - Add error tracking (Sentry)
    - Add performance monitoring
    - Set up alerting

---

## Non-Goals (Out of Scope)

- Complex AMMs or pricing engines
- Full NFT minting on-chain (designs only)
- External wallet integrations beyond RainbowKit set
- Advanced analytics (heatmaps, correlation analysis)
- Multiple themes/skins
- Tournament mode
- Referral system
- Multi-chain support
- Mobile app or PWA
- Social features (comments, following, messaging)
- Oracle integration (Chainlink, Pyth, UMA)
- Gasless transactions

---

## Success Metrics (Demo Evaluation)

### User Flow Completion
- 90%+ complete wallet connection
- 80%+ place at least one YC bet
- 70%+ view their profile and achievements

### UI/UX Quality
- Zero WCAG AA violations
- Sub-3 second page load times
- Zero critical bugs during demo
- Smooth animations (no jank)

### Feature Completeness
- All core features functional (markets, bets, claims, achievements)
- Claude AI integration working (quests, hints, predictions)
- Both game modes operational
- Leaderboards and profile accurate

### Story Clarity
- Demo viewers understand "no-loss" mechanic within 30 seconds
- Principal vs YC distinction immediately clear
- EtherFi and Claude branding visible

---

## Phase Implementation Summary

- [x] **Phase 0**: Project Bootstrap & Foundation - COMPLETE
- [x] **Phase 1**: Wallet Integration & Basic UI Shell - COMPLETE
- [x] **Phase 2**: Smart Contracts & Vault Integration - ~90% (contracts written, not deployed)
- [x] **Phase 3**: Markets & Prediction Gameplay - COMPLETE
- [x] **Phase 4**: Game Modes & Automated Claude Trading - COMPLETE
- [x] **Phase 5**: Player Progression & Social Features - ~85% (class assignment missing)
- [ ] **Phase 6**: Portfolio Analytics & Final Polish - ~50% (analytics partial, onboarding missing)
- [ ] **Post-Launch**: Future Enhancements - NOT STARTED

---

## Maintenance Notes

**Last Updated**: 2025-11-09

**Current State**: Demo-ready, not production-ready

**Blockers for Production**:
1. Smart contracts not deployed (addresses are 0x0)
2. Database is SQLite (not production-grade)
3. Admin auth is insecure (simple address check)
4. No automated tests
5. No monitoring or logging
6. Using MockWeETH instead of real weETH

**Demo Strengths**:
- Polished UI/UX with excellent accessibility
- Comprehensive Claude AI integration
- Full game loop functional (manual and automated modes)
- Rich player progression system
- Realistic demo data generation

**When updating this file**:
- Update "Last Updated" date
- Document new constraints or requirements
- Update implementation status percentages
- Add new TODOs to Known Issues section
- Do NOT add progress logs or test reports
