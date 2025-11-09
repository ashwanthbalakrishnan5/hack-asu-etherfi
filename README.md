# Yield Quest

> A no-loss prediction game powered by EtherFi weETH with Claude AI as your adaptive Game Master

**Live Demo:** [https://yieldquest.ashwanthbk.com/](https://yieldquest.ashwanthbk.com/)

---

## What is Yield Quest?

**Yield Quest** is an innovative prediction market platform that transforms the way users engage with DeFi. Instead of risking your principal on predictions, Yield Quest enables you to play with only the yield generated from your staked weETH. Your principal remains 100% safe and withdrawable at any time—creating a truly no-loss gaming experience.

Think of it as a gamified yield layer on top of EtherFi's liquid staking, where you can test your prediction skills, compete with others, and earn rewards—all without putting your capital at risk.

### Core Concept

1. **Deposit weETH** → Your principal is locked safely in a vault
2. **Earn Yield Credits (YC)** → Your principal generates YC over time (simulated 5% APR)
3. **Make Predictions** → Spend only YC on binary YES/NO prediction markets
4. **Win & Level Up** → Correct predictions earn more YC, boost your level, and unlock achievements
5. **Withdraw Anytime** → Your principal is always yours, completely risk-free

---

## How It Works

### The No-Loss Mechanic

Traditional prediction markets require you to risk your own capital. **Yield Quest changes this paradigm:**

- **Principal Protection**: Your weETH is stored securely in a smart contract vault and never used for betting
- **Yield-Only Betting**: Only the Yield Credits (YC) generated from your principal can be used for predictions
- **True Risk-Free**: Even if you lose all your bets, your principal remains untouched and fully withdrawable
- **Sustainable Gameplay**: As long as you have principal staked, you continue earning YC to play with

### Prediction Markets

Engage with diverse binary prediction markets covering:

- Cryptocurrency prices and trends
- Sports outcomes
- Technology developments
- Political events
- Science and research breakthroughs

Each market features:

- Clear YES/NO questions
- Difficulty ratings (1-5 stars)
- Close times for resolution
- Dynamic odds based on pool distribution
- Admin-verified outcomes

### Claude AI Game Master

What sets Yield Quest apart is the integration of **Claude AI (Haiku 4.5)** as an adaptive, intelligent game master:

#### Personalized Quests

- Claude generates custom quests tailored to your skill level
- Adaptive difficulty based on your historical accuracy
- Educational learning outcomes embedded in each quest
- Complete quests to earn bonus XP and achievements

#### Probability Hints

- Get AI-powered probability assessments for any market
- Receive detailed reasoning and educational tips
- Improve your prediction skills through Claude's insights
- Learn to think critically about market outcomes

#### Automated Trading Mode

- Enable Claude to research and bet on your behalf
- Set risk levels (Low/Medium/High) and confidence thresholds
- Claude analyzes markets, calculates probabilities, and places bets automatically
- Track automated performance with detailed statistics
- Perfect for passive yield generation

---

## Key Features

### 1. Wallet Integration

- **Multi-Wallet Support**: Connect via MetaMask, WalletConnect, Coinbase Wallet, and more
- **Powered by RainbowKit**: Seamless, beautiful wallet connection experience
- **Network Validation**: Hardcoded to Sepolia testnet for demo
- **Auto-Initialization**: First-time users automatically receive demo data

### 2. Two Game Modes

#### Manual Mode

- Browse available prediction markets
- Analyze odds and market dynamics
- Place bets manually with your YC balance
- Get probability hints from Claude AI
- Claim winnings after market resolution

#### Automated Mode

- Toggle automated predictions on/off
- Configure risk parameters (Low/Medium/High)
- Set maximum bet per market and minimum confidence threshold
- Claude researches markets and places bets automatically
- Monitor active automated bets and estimated returns

### 3. Player Progression System

#### Experience & Leveling

- **XP Rewards**: +10 for placing bets, +20 for wins, +50 for 3-win streaks, +30 for quest completion
- **Level Calculation**: `level = sqrt(xp / 100)` with quadratic progression
- **Visual Progress**: Real-time XP meter and level badges

#### Skill Metrics

- **Accuracy**: Win rate percentage (wins / total bets × 100)
- **Yield Efficiency**: Return on YC spent ((YC won - YC spent) / YC spent × 100)
- **Wisdom Index**: Composite score combining accuracy (50%), yield efficiency (30%), and streak bonus (20%)
- **Win Streaks**: Track consecutive winning predictions

### 4. Achievement System

Earn 7 unique achievements with varying rarity tiers:

| Achievement   | Requirement                   | Rarity    |
| ------------- | ----------------------------- | --------- |
| First Blood   | Place your first bet          | Common    |
| Hat Trick     | Win 3 in a row                | Rare      |
| Sharpshooter  | >60% accuracy with 10+ bets   | Epic      |
| Quest Master  | Complete 5 Claude quests      | Rare      |
| Diamond Hands | Withdraw after 7 days staking | Uncommon  |
| Whale         | Deposit >1 weETH              | Rare      |
| Oracle        | >75% accuracy with 20+ bets   | Legendary |

Each earned achievement triggers a celebration with confetti animation and is permanently displayed on your profile.

### 5. Social & Competitive Features

#### Global Leaderboards

- **Accuracy Leaders**: Top players by prediction accuracy
- **Wisdom Index Leaders**: Best overall performers
- **Quest Masters**: Most quests completed
- **Privacy Controls**: Opt-in/opt-out visibility
- **Search Functionality**: Find players by address or ENS
- **Real-time Rankings**: Pagination with 20 players per page

#### Profile Page

- Comprehensive stats dashboard
- Level, XP, and progress visualization
- Total bets, wins, losses
- YC balance and principal display
- Achievement showcase (earned vs locked)
- Display name customization
- Betting history

### 6. Vault & Credit System

#### Vault Mechanics

- Deposit weETH to start earning YC
- View real-time principal balance
- Withdraw principal anytime (no lockup periods)
- Emergency withdrawal capability
- Smart contract protection

#### Yield Credits (YC)

- Accrue from staked principal (5% simulated APR)
- Visual "breathing" effect shows active accrual
- Cannot be transferred (only spent or won)
- Complete audit trail of YC spent and earned
- New users start with 1000 YC in demo mode

### 7. Demo Mode

For easy onboarding and testing:

- Auto-generates 8 diverse prediction markets
- Seeds realistic user stats
- Awards 2-3 common achievements
- Provides 1000 YC starting balance
- Simulates 1.5 weETH principal
- One-click setup via admin panel

### 8. Admin Panel

Manage the platform (address-gated):

- Create new prediction markets
- Resolve markets (YES/NO/CANCEL outcomes)
- Auto-resolve expired markets
- Initialize demo mode
- View market statistics

---

## Technical Architecture

### Frontend Stack

| Technology      | Version | Purpose                 |
| --------------- | ------- | ----------------------- |
| Next.js         | 16.0.1  | App Router framework    |
| TypeScript      | 5.x     | Type safety             |
| React           | 19.2.0  | UI library              |
| Tailwind CSS    | 4.x     | Styling & design system |
| Framer Motion   | 12.x    | Animations              |
| Wagmi           | 2.19.2  | Web3 React hooks        |
| Viem            | 2.38.6  | Ethereum library        |
| RainbowKit      | 2.2.9   | Wallet connection       |
| Zustand         | 5.0.8   | State management        |
| React Hook Form | 7.66.0  | Form handling           |
| Zod             | 4.1.12  | Schema validation       |
| Recharts        | 3.3.0   | Analytics charts        |
| Lucide React    | 0.553   | Icon library            |

### Backend Stack

| Technology         | Version  | Purpose               |
| ------------------ | -------- | --------------------- |
| Next.js API Routes | 16.0.1   | 28 REST endpoints     |
| Prisma             | 6.19.0   | ORM                   |
| SQLite             | -        | Database (dev)        |
| Anthropic SDK      | 0.68.0   | Claude AI integration |
| Claude Haiku 4.5   | 20251001 | AI model              |

### Smart Contracts

| Contract      | Language        | Lines | Status                |
| ------------- | --------------- | ----- | --------------------- |
| GameVault.sol | Solidity 0.8.20 | ~120  | Written, not deployed |
| MockWeETH.sol | Solidity 0.8.20 | ~45   | Written, not deployed |

**Libraries**: OpenZeppelin Contracts 5.4.0

### Database Schema

**5 Core Models:**

1. **User**: Wallet address, YC balance, principal, XP, level, stats, preferences
2. **Market**: Question, close time, difficulty, pools, resolution status
3. **Position**: User bets on markets with side (YES/NO) and amount
4. **Quest**: Claude-generated challenges with learning outcomes
5. **Achievement**: Earned achievements linked to users

### API Architecture

**28 REST Endpoints** organized into 9 modules:

- `/api/achievements` - Achievement checking and retrieval
- `/api/analytics` - Portfolio analytics data
- `/api/claude` - AI integration (hints, quests)
- `/api/credits` - YC purchase system
- `/api/demo` - Demo mode initialization
- `/api/gamemode` - Automated betting (predict, stats, settings, toggle)
- `/api/leaderboard` - Global rankings
- `/api/markets` - Market CRUD and resolution
- `/api/positions` - Bet placement and claiming
- `/api/quests` - Quest generation and management
- `/api/rewards` - Daily reward system
- `/api/users` - User profiles and stats
- `/api/yc` - Yield Credits balance and accrual

### Design System

**Color Palette (Dark Theme)**:

- Background: `#0a0f1a` (near-black)
- Surface: `#131b2e` (dark navy)
- Primary: `#00d4ff` (cyan/teal - EtherFi brand)
- Secondary: `#c4b5fd` (lavender - Claude)
- Success: `#4ade80` (soft green)
- Warning: `#fbbf24` (amber)
- Error: `#ef4444` (red)

**Accessibility**:

- WCAG AA compliant (4.5:1 contrast minimum)
- Full keyboard navigation
- Visible focus states
- ARIA labels on all interactive elements
- Respects `prefers-reduced-motion`

**Responsive Design**:

- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Optimized for phones, tablets, and desktops

---

## Project Structure

```
/home/user/hack-asu-etherfi/
├── /app                          # Next.js App Router
│   ├── /api                      # 28 API route endpoints
│   │   ├── /achievements         # Achievement system
│   │   ├── /analytics            # Portfolio analytics
│   │   ├── /claude               # Claude AI integration
│   │   ├── /credits              # YC credit purchase
│   │   ├── /demo                 # Demo mode setup
│   │   ├── /gamemode             # Automated betting
│   │   ├── /leaderboard          # Global leaderboards
│   │   ├── /markets              # Market CRUD and resolution
│   │   ├── /positions            # Bet placement and claiming
│   │   ├── /quests               # Quest system
│   │   ├── /rewards              # Daily rewards
│   │   ├── /users                # User profiles
│   │   └── /yc                   # Yield Credits
│   ├── /play                     # Main gameplay page
│   ├── /profile                  # User profile page
│   ├── /leaderboard              # Leaderboard page
│   ├── /admin                    # Admin panel
│   ├── page.tsx                  # Home/landing page
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── /components                   # 32+ React components
│   ├── /ui                       # Design system components
│   ├── /wallet                   # Wallet connection
│   ├── /vault                    # Vault and YC components
│   ├── /markets                  # Market displays
│   ├── /quests                   # Quest components
│   ├── /gamemode                 # Automated mode UI
│   ├── /profile                  # Profile sections
│   ├── /credits                  # Credits widgets
│   ├── /leaderboard              # Leaderboard tables
│   ├── /layout                   # Header, Footer
│   └── /providers                # Web3 providers
├── /lib
│   ├── /types                    # TypeScript definitions
│   ├── /hooks                    # Custom React hooks
│   ├── /stores                   # Zustand stores
│   ├── /contracts                # Smart contract ABIs
│   ├── config.ts                 # App configuration
│   ├── wagmi.ts                  # Web3 config
│   ├── prisma.ts                 # Prisma client
│   └── achievements.ts           # Achievement logic
├── /prisma
│   └── schema.prisma             # Database schema
├── /contracts                    # Solidity contracts
│   ├── GameVault.sol             # Principal vault
│   └── MockWeETH.sol             # Mock weETH token
├── /scripts                      # Utility scripts
│   ├── populate-demo-data.ts     # Demo data generator
│   └── verify-demo-data.ts       # Data verification
├── package.json                  # Dependencies
├── tsconfig.json                 # TypeScript config
├── next.config.ts                # Next.js config
├── tailwind.config.js            # Tailwind config
├── hardhat.config.js             # Hardhat config
├── CLAUDE.md                     # Full project documentation
└── README.md                     # This file
```

---

## Local Development Setup

### Prerequisites

- Node.js 18+ and npm
- Git
- WalletConnect Project ID ([Get one here](https://cloud.walletconnect.com))
- Anthropic API Key ([Get one here](https://console.anthropic.com))

### Installation Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/ashwanthbalakrishnan5/hack-asu-etherfi.git
   cd hack-asu-etherfi
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment variables**

   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and fill in required values:

   ```env
   # Database
   DATABASE_URL="file:./dev.db"

   # Anthropic Claude AI
   ANTHROPIC_API_KEY="sk-ant-..."

   # Web3 (RainbowKit)
   NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID="your-project-id"

   # Network (Sepolia testnet)
   NEXT_PUBLIC_CHAIN_ID="11155111"

   # Smart Contracts (demo uses 0x0 placeholders)
   NEXT_PUBLIC_WEETH_ADDRESS="0x0000000000000000000000000000000000000000"
   NEXT_PUBLIC_VAULT_ADDRESS="0x0000000000000000000000000000000000000000"

   # Admin (your wallet address)
   ADMIN_ADDRESS="0x..."

   # Demo Configuration
   NEXT_PUBLIC_DEMO_MODE="true"
   NEXT_PUBLIC_SIMULATED_APR="5"
   ```

4. **Initialize database**

   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run development server**

   ```bash
   npm run dev
   ```

6. **Open browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm start            # Start production server
npm run lint         # Run ESLint
npm run populate-demo # Seed demo data
npm run verify-demo  # Verify demo data
```

---

## Usage Guide

### Getting Started

1. **Visit the Live Demo**: [https://yieldquest.ashwanthbk.com/](https://yieldquest.ashwanthbk.com/)

2. **Connect Your Wallet**: Click "Connect Wallet" and choose your preferred wallet provider

3. **Automatic Initialization**: Your profile is automatically created with:
   - 1000 YC starting balance
   - 1.5 weETH simulated principal
   - 2-3 starter achievements
   - Realistic demo stats

4. **Explore Markets**: Navigate to the "Play" page to see active prediction markets

### Making Your First Prediction

1. **Choose a Market**: Browse available markets and select one that interests you
2. **Analyze the Question**: Review difficulty, close time, and current odds
3. **Get Claude's Hint** (Optional): Click "Get AI Hint" for probability assessment
4. **Place Your Bet**: Choose YES or NO, enter YC amount, and confirm
5. **Track Your Position**: View active bets on your profile or play page
6. **Claim Winnings**: After market resolution, claim your winnings if you won

### Using Automated Mode

1. **Navigate to Play Page**: Find the "Game Mode" panel
2. **Toggle to Automated**: Switch from Manual to Automated mode
3. **Configure Settings**:
   - Risk Level: Low (conservative), Medium (balanced), or High (aggressive)
   - Max Bet Per Market: Set your maximum stake
   - Min Confidence: Claude only bets when confidence exceeds this threshold
4. **Enable Auto-Betting**: Toggle the "Enable Automated Predictions" switch
5. **Monitor Performance**: View stats on active bets, YC deployed, and estimated returns

### Earning Achievements

Achievements unlock automatically when you meet their requirements:

- Play your first game to earn "First Blood"
- Win 3 in a row for "Hat Trick"
- Maintain high accuracy for "Sharpshooter" and "Oracle"
- Complete Claude quests for "Quest Master"
- Stake for a week before withdrawing for "Diamond Hands"
- Deposit significant principal for "Whale"

### Climbing the Leaderboard

1. **Improve Your Stats**: Focus on accuracy and yield efficiency
2. **Complete Quests**: Earn bonus XP and boost your wisdom index
3. **Maintain Streaks**: Consecutive wins significantly boost your score
4. **Enable Visibility**: Opt-in to leaderboard display in your profile settings
5. **Compete in Categories**: Specialize in Accuracy, Wisdom Index, or Quest completion

---

## Current Status

**Demo-Ready**: ~80-85% feature-complete

### ✅ Fully Implemented

- Complete wallet integration with multi-provider support
- All prediction market functionality (browse, bet, claim)
- Both manual and automated game modes
- Claude AI integration (quests, hints, automated predictions)
- Full player progression system (XP, levels, streaks)
- 7 achievements with automatic checking
- Global leaderboards with privacy controls
- Comprehensive profile and analytics
- Admin panel for market management
- Demo mode for easy onboarding
- Responsive, accessible UI/UX
- Dark theme with EtherFi brand colors

### ⚠️ Limitations (Demo Environment)

- **Smart contracts written but not deployed** (addresses are placeholders)
- **Uses simulated YC accrual** instead of real EtherFi yield
- **SQLite database** (local, not production-grade)
- **Simple admin authentication** (address check, not signature verification)
- **No automated testing** (manual testing only)
- **MockWeETH** instead of real weETH contract integration

### 🎯 What Works Out of the Box

- Full gameplay loop (deposit → earn YC → bet → claim → withdraw)
- Real-time Claude AI integration for all features
- Accurate XP, level, and achievement tracking
- Functional leaderboards and social features
- Beautiful, accessible UI with smooth animations
- Proper state management and data persistence

---

## Future Enhancements

### Short-term (Post-Hackathon)

- Deploy GameVault and weETH contracts to Sepolia testnet
- Integrate real EtherFi weETH contract
- Implement signature-based admin authentication
- Add automated testing suite (unit, integration, E2E)
- Migrate to PostgreSQL for production database
- Implement proper secrets management

### Medium-term

- Oracle integration (Chainlink, UMA) for automated market resolution
- NFT minting for achievements
- Player class assignment based on behavior
- Enhanced analytics with historical time series
- Interactive onboarding flow
- Tournament mode with seasonal competitions
- Referral system

### Long-term

- Multi-chain support (Ethereum mainnet, L2s)
- Social features (comments, following, messaging)
- Mobile app or PWA
- Advanced portfolio analytics
- Gasless transactions via meta-transactions
- Prediction market creation by users
- Decentralized governance

---

## Security Considerations

**For Demo/Hackathon Use:**

- This is a demonstration application, not production-ready
- Smart contracts are unaudited
- Database is local and ephemeral (SQLite)
- Admin authentication is simplified
- No rate limiting on API endpoints

**Before Production:**

- Full smart contract audit required
- Implement signature verification for all admin actions
- Add rate limiting and DDoS protection
- Migrate to production database with backups
- Implement proper secrets management (AWS Secrets Manager, etc.)
- Add comprehensive logging and monitoring (Sentry, Datadog)
- Deploy to secure, scalable infrastructure

---

## Contributing & License

This project was created for **Hack ASU (EtherFi Track)** and is currently a private demonstration.

**Team**: Ashwanth Balakrishnan

For questions, feedback, or collaboration opportunities, please reach out through the hackathon platform.

---

## Acknowledgments

### Powered By

- **EtherFi**: For the innovative weETH liquid staking protocol that enables the no-loss mechanic
- **Anthropic**: For Claude AI, which brings adaptive intelligence to the game master role
- **Hack ASU**: For the opportunity to build and showcase this project

### Built With

Special thanks to the open-source projects and teams that made Yield Quest possible:

- Next.js team for the excellent App Router framework
- Wagmi and Viem for robust Web3 tooling
- RainbowKit for beautiful wallet UX
- Prisma for the powerful ORM
- OpenZeppelin for secure smart contract libraries
- Tailwind Labs for the amazing CSS framework
- Framer for the Motion animation library

---

## Conclusion

**Yield Quest** represents a new paradigm in DeFi gaming—one where users can engage with prediction markets without risking their capital. By leveraging EtherFi's liquid staking and Anthropic's Claude AI, we've created an experience that is:

- **Risk-Free**: Principal is always safe and withdrawable
- **Educational**: Learn prediction skills through AI-guided quests and feedback
- **Competitive**: Climb leaderboards and earn achievements
- **Adaptive**: AI difficulty scales with your skill level
- **Accessible**: Beautiful, responsive UI that anyone can use

Whether you're a DeFi veteran looking for a new way to put your yield to work, or a newcomer wanting to learn about prediction markets without risking capital, Yield Quest offers a unique and engaging experience.

**Try it now**: [https://yieldquest.ashwanthbk.com/](https://yieldquest.ashwanthbk.com/)

---

## Thank You

Thank you to the **Hack ASU organizers**, **EtherFi team**, and **Anthropic** for making this hackathon possible. Building Yield Quest has been an incredible learning experience, pushing the boundaries of what's possible when DeFi protocols meet cutting-edge AI.

To everyone who tests the demo, provides feedback, or contributes ideas—your input is invaluable in shaping the future of no-loss prediction markets.

Let's make DeFi safer, smarter, and more accessible together.

**Happy Predicting!** 🎯

---

_Built with ❤️ for Hack ASU 2025_
