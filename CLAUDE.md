# claude.md — Authoritative Build Instructions (No Code)

## Purpose

Create a polished, demo-ready dApp: a no-loss, yield-only prediction game built on EtherFi (weETH) with Claude as the adaptive Game Master. The **core emphasis is UI/UX perfection** and clear storytelling of “principal safe, yield plays.” Backend may be **basic or mocked**. Smart contracts may be minimal. Do not over-engineer.

**Strict rules for the AI agent**

- Do not hallucinate; if a fact is unknown, leave a TODO note for a human.
- Do not generate code inside this file.
- Do not add random files, boilerplate readmes, or non-essential docs.
- Prefer **Next.js** (App or Pages Router) for the frontend and API routes. If a separate server is necessary, use **Python FastAPI or Flask** else use Next.js itself for API routes. Do **not** introduce Node.js servers beyond Next.js API routes.
- Keep EtherFi and Claude integrations visible and central.
- Always **Use Context7 MCP server** to fetch up-to-date documentation for all frameworks, libraries, and tools being used (Next.js, Wagmi, Viem, Tailwind CSS, Framer Motion, etc.). This ensures accurate implementation patterns, avoids deprecated APIs, and reduces errors from outdated knowledge.
- Always **Use Sequential thinking MCP Server** to think through the tasks before implementing them.
- After completing work, **update this file with any new constraints or instructions only**. Do **not** add progress logs or test reports. Do **not** create md files other than this one.

---

## Product Narrative (What the UI must convey at a glance)

1. Users **stake weETH** (principal) → principal is **safe** and **never used** to bet.
2. A **Yield Credits** balance accrues from the principal (demo may simulate APR).
3. Users **spend Yield Credits only** to make predictions on real-world events.
4. **Claude** generates personalized quests, difficulty tuning, and learning hints.
5. Users **level up** and **earn achievements** (NFT-ready designs) for skill, accuracy, and consistency.
6. Users **withdraw principal anytime**; wins and losses only affect Yield Credits.

The UI must make this loop immediately obvious without reading documentation.

---

## Feature Specification (Complete, precise)

### A) Wallet + EtherFi Integration

- Connect wallet with a first-class, safe-feeling flow.
- Read and display **weETH** balance (mainnet read-only if needed).
- Clear separation of two balances, always visible:
  - **Principal (weETH)**: marked SAFE, non-spendable for bets, withdrawable.
  - **Yield Credits (YC)**: spendable in predictions, detachable from principal.
- APR panel:
  - If live APR not available, show **“Simulated APR for Demo”** and an information tooltip explaining it.
- EtherFi visual acknowledgment:
  - Small branded “Powered by EtherFi (weETH)” strip with brief explainer tooltip.

### B) Vault & Yield Credits (Conceptual, minimal logic)

- Deposit/Withdraw interactions:
  - Deposit: approves and deposits weETH to the “Game Vault” (mock/test deployment permissible).
  - Withdraw: returns weETH principal; YC unaffected.
- Yield Credits model:
  - YC accrues over time based on principal (can be simulated).
  - YC cannot be transferred; only spent in predictions and credited on wins.
  - UI shows a “flow” animation to reinforce accrual.

### C) Prediction Gameplay

- Market format: binary questions (YES/NO).
- Market card content:
  - Title, concise question, close time, difficulty (1–5), source/origin if relevant.
  - YC pools for YES and NO (visible, even if mocked).
- Bet ticket:
  - Shows user YC balance, input YC amount, selected side, implied expected payout (simple calculation).
  - Displays a **probability hint** and a **short educational tip** from Claude (see Claude section).
  - Confirm interaction with gentle haptics and micro-success animation.
- Resolution:
  - Admin tool or timed closure to set outcomes (mock acceptable).
  - Claim flow transfers YC winnings to the user’s YC balance.
  - Clean receipts/notifications with a link to the “My Quests” view.

### D) Quests by Claude (Adaptive Game Master)

- “Get Quests” surface shows 3 live quests curated for the user.
- For each quest:
  - Title and clear question.
  - Suggested YC stake.
  - Difficulty (1–5).
  - One-sentence learning outcome (what the user will practice).
  - Deadline/close time.
- Accepting a quest:
  - Pre-configures a binary market card.
  - Prefills bet ticket with suggested YC (user editable).
- Post-resolution feedback (from Claude):
  - One short paragraph of guidance based on outcome pattern (e.g., “you over-weight momentum… try setting a cap on stake variance”).
  - One suggested micro-quest or practice tip (non-binding).
- Deterministic JSON requirements outlined in “Claude Integration” below.

### E) Player Progression & Achievements

- XP and Level:
  - XP rules: award for placing bets, additional for correct outcomes, bonus for streaks and completing Claude quests.
  - Display: smooth progress bar; show next reward threshold clearly.
- Achievements (NFT-ready designs):
  - First Bet, 3 Wins in a Row, >60% Accuracy, First Claude Quest Completed, First Withdraw, etc.
  - Each achievement has a name, icon, rarity tag, and a one-line meaning (“Proof of Consistency: 3 consecutive wins”).
  - Earn animation: badge pop-in with subtle celebratory confetti.
- Accuracy & Skill indices:
  - Accuracy (% correct).
  - Yield Efficiency (YC profit relative to YC spent).
  - Wisdom Index (weighted composite of accuracy, streaks, and time horizon participation). Formula can be mock but must be consistent.

### F) Leaderboards

- Tabs:
  - Accuracy Leaders.
  - Wisdom Index Leaders.
  - Quest Masters (most Claude quests completed).
- Row contents: avatar, ENS or shortened address, key metric, subtle change indicator.
- Anti-spam: ignore accounts with insufficient sample size; include a note about minimum participation.
- Privacy: make ranking optional; allow opt-out toggle in profile.

### G) Portfolio Analytics (Concise and meaningful)

- Time series mini-chart: Principal vs YC over time.
- Allocation chart: YC deployed YES vs NO in the current period.
- Outcomes summary: total YC spent, redeemed, net change.
- “Insights” slot: 1–2 AI-generated hints aligned with recent behavior (no financial advice).

### H) Education Layer

- Tooltips and help:
  - Principal vs YC separation explained succinctly.
  - “No-loss” caveat: contracts/protocol risk exists in real life; demo uses simplified logic.
- Onboarding checklist:
  - Connect wallet → Deposit weETH → Generate quests → Place first YC bet → Resolve → Claim YC → Withdraw principal.
- Inline, non-patronizing, consistent tone.

---

## Page-Level UX Requirements (Exact)

### 1) Home

- Hero statement expressing the loop in one sentence.
- Two primary actions: Connect Wallet, Go to Play.
- A compact “How it Works” strip diagram (Principal → YC → Quests → XP/Badges → Withdraw).
- EtherFi + Claude badges with brief one-line descriptions.

### 2) Play

- Left column: Vault Card, YC Meter, Deposit/Withdraw.
- Right column: Claude Quests (3 cards max), Active Markets, Resolved Markets.
- Bet Ticket slides in from right; dismissible with ESC/backdrop click.
- Always show current YC prominently near action buttons.

### 3) Profile

- Header: ENS/avatar, address, class badge (Oracle/Degen/Analyst/Whale).
- Subheader: Level, XP, Accuracy, Wisdom Index.
- Sections:
  - Achievements grid with hover tooltips.
  - History timeline of accepted quests and outcomes (concise).
  - Preferences: leaderboard opt-out, notifications, display name.

### 4) Leaderboard

- Tabs for each metric.
- Search by address/ENS.
- Pagination or lazy load.
- Highlight current user row.

### 5) Admin (hidden or gated)

- Create/close/resolve markets.
- Seed demo data.
- Toggle “Simulated APR” rate.

---

## Design System (No compromises)

### Visual Theme

- Aesthetic: modern DeFi + RPG hints. Minimalist, high-contrast, calm energy.
- Palette:
  - Background: near-black or deep navy.
  - Surface cards: slightly lighter dark.
  - Primary accent: vivid cyan/teal for EtherFi tie-in.
  - Success: soft green.
  - Warning: amber.
  - Error: controlled red.
  - Claude hint elements: subtle lavender highlights.
- Gradients: reserved, linear and soft; never overpower core content.

### Typography

- Headings: geometric, modern sans. Clear hierarchy (H1-H5).
- Body: highly legible sans with generous line-height.
- Numerics: tabular numerals for balances, pools, odds.
- Never use more than 2 font families. Maintain consistent sizes and spacing.

### Layout & Spacing

- 12-column responsive grid.
- Base spacing unit: 8px scale.
- Card padding minimum: 16–24px.
- Max content width: 1200–1280px for readability.

### Components & States

- Cards: rounded medium radius, subtle shadow on hover, consistent header and body sections.
- Buttons: primary (accent), secondary (outline), subtle (text). All with focus rings.
- Inputs: clear labels, helper text, error text; numeric keypad for YC amounts on mobile.
- Tabs: underline/indicator consistent; keyboard navigable.
- Tooltips: concise, 1–2 lines, delay on hover.
- Toasts: brief, bottom-center or top-right, dismissible.

### Motion & Micro-interactions

- Duration: 150–250ms, eased transitions.
- YC accrual: breathing shimmer on meter.
- Bet placement: subtle confirmation pulse on the market card.
- Achievements: short confetti + badge scale-in; must be skippable.
- Reduce motion preference respected.

### Accessibility

- Meet or exceed WCAG AA contrast.
- Full keyboard navigation.
- Focus states always visible.
- Live regions for dynamic updates (toasts, accrual changes).

### Empty States & Skeletons

- Provide instructive empty states with a single primary action.
- Use animated skeletons for market lists and cards on initial load.

### Copy & Tone

- Short, confident, instructive.
- Avoid jargon; when unavoidable, provide a tooltip.
- No financial advice disclaimers where appropriate.

---

## Claude Integration (Deterministic, JSON-only)

- Endpoints to generate:
  - Quests feed: returns an array of exactly 3 quests.
  - Probability hint (optional): returns a float 0–1 and a 1-paragraph rationale.
  - Post-resolution feedback: returns a short paragraph and one suggestion string.
- Output contract:
  - Always JSON, fixed fields, no prose outside JSON.
  - Reject and retry if the format deviates.
- Inputs:
  - Minimal user profile stats (wins/losses/accuracy/stakes).
  - Never pass secrets or PII.
- Safety:
  - Instruct Claude not to provide financial advice; it may provide educational hints only.

---

## Backend & Data (Basic / Mock acceptable)

### Backend Choice

- Use **Next.js API routes** for all backend endpoints where possible.
- If a separate server is required, use **Python FastAPI or Flask**. Keep it minimal.
- No custom Node.js servers beyond Next.js defaults.

### Data Handling

- Temporary storage acceptable (in-memory or lightweight DB).
- Suggested logical entities (names only, not schemas):
  - Users, Stats, Quests, Markets, Positions, Achievements.
- Keep all write paths minimal and predictable.
- Never store Claude prompts/responses containing secrets.

### Market Resolution

- Demo: Admin or scheduled mock resolution is acceptable.
- Indicate in UI that demo outcomes may be mocked.
- Production note: oracles (Pyth/Chainlink/UMA) are future work; do not implement now.

---

## Non-Goals (Explicitly avoid)

- Do not build complex AMMs or pricing engines.
- Do not implement full NFT minting on-chain; design visuals and stubs only.
- Do not integrate external wallets beyond the chosen connector set.
- Do not add complex analytics beyond what is listed.
- Do not add themes or skins beyond the primary theme.

---

## Quality Criteria (What “done” looks like)

- Users can connect a wallet, see real or read-only **weETH** balances, and deposit/withdraw to a demo vault.
- YC accrues visually and is spendable; principal remains clearly separate and safe.
- Claude provides 3 tailored quests, each fully formed and selectable.
- Users can place a YC bet, see it in Active Markets, and later see a resolved outcome with the ability to claim YC.
- Profile shows level, XP, accuracy, achievements grid with designed badges.
- Leaderboards display top users by Accuracy and Wisdom Index.
- The interface is modern, consistent, accessible, and visually refined per this file.

---

## After Completing Work

- Update this file **only** with any new constraints or next-step instructions required for future development.
- Do **not** add status logs, test reports, or progress diaries.
- Keep this file as the single source of truth for product requirements and UX standards.

---

## Phase-Wise Implementation Plan

### Overview

This plan breaks down the entire project into 6 logical phases, each building upon the previous. Phases are designed to deliver incremental value and allow for early testing of core mechanics. Total estimated timeline: 4-6 weeks for a 2-3 person team.

---

### **PHASE 0: Project Bootstrap & Foundation** (Days 1-2)

**Goal:** Set up development environment, tooling, and basic project structure.

#### Tasks:

1. **Initialize Next.js Project**
   - Create Next.js 14+ project with App Router
   - Configure TypeScript with strict mode
   - Set up ESLint and Prettier

2. **Install Core Dependencies**
   - Web3 libraries: `wagmi`, `viem`, `@rainbow-me/rainbowkit` or `@web3modal/wagmi`
   - UI framework: `tailwindcss`, `framer-motion`, `lucide-react` or `heroicons`
   - State management: `zustand` or React Context
   - Charts: `recharts` or `chart.js`
   - Form handling: `react-hook-form`, `zod`
   - HTTP client: built-in `fetch` or `axios`

3. **Project Structure Setup**

   ```
   /app
     /api
       /claude        # Claude AI endpoints
       /markets       # Market CRUD
       /quests        # Quest generation
       /vault         # Deposit/withdraw logic
     /(routes)
       /page.tsx      # Home
       /play
       /profile
       /leaderboard
       /admin
   /components
     /ui              # Base components (Button, Card, Input, etc.)
     /wallet          # Wallet connection components
     /vault           # Vault and YC components
     /markets         # Market cards, bet tickets
     /quests          # Quest cards and flows
     /profile         # Profile sections
     /leaderboard     # Leaderboard tables
   /lib
     /contracts       # Smart contract ABIs and addresses
     /utils           # Helper functions
     /hooks           # Custom React hooks
     /stores          # State management
     /types           # TypeScript types
   /public
     /images
     /icons
   /styles
   ```

4. **Design System Foundation**
   - Configure Tailwind with custom color palette (cyan/teal primary, dark theme)
   - Create base component library: Button, Card, Input, Badge, Tooltip, Toast
   - Set up typography scale and spacing system (8px base)
   - Configure animation variants for framer-motion

5. **Environment Configuration**
   - Create `.env.local` template with required variables:
     - `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`
     - `NEXT_PUBLIC_CHAIN_ID` (Sepolia testnet for demo)
     - `ANTHROPIC_API_KEY` (for Claude integration)
     - `NEXT_PUBLIC_WEETH_ADDRESS`
     - `NEXT_PUBLIC_VAULT_ADDRESS`
   - Set up RPC providers (Alchemy, Infura, or public)

**Deliverable:** Empty Next.js app runs locally, design system components render correctly, wallet connection modal appears.

---

### **PHASE 1: Wallet Integration & Basic UI Shell** (Days 3-5)

**Goal:** Users can connect wallet, see basic navigation, and view placeholder pages.

#### Tasks:

1. **Wallet Connection System**
   - Implement RainbowKit or Web3Modal provider wrapper
   - Create `WalletButton` component with connection states (disconnected, connecting, connected)
   - Show connected address with ENS resolution (if available)
   - Display network indicator and switch network functionality
   - Handle wallet disconnection gracefully

2. **Layout & Navigation**
   - Create root layout with header/navigation
   - Navigation links: Home, Play, Profile, Leaderboard
   - Mobile-responsive hamburger menu
   - Persistent wallet connection status in header
   - Footer with EtherFi and Claude branding

3. **Home Page (Static)**
   - Hero section with tagline: "Predict with Yield, Keep Your Principal Safe"
   - Two CTAs: "Connect Wallet" and "Enter Play"
   - "How It Works" diagram (static SVG or images):
     - Step 1: Deposit weETH → Step 2: Earn YC → Step 3: Predict & Win → Step 4: Withdraw Anytime
   - EtherFi + Claude partner badges with tooltips
   - Empty state: prompt to connect wallet

4. **Page Shells (Empty States)**
   - `/play`: Show skeleton layout (left column for vault, right for markets)
   - `/profile`: Show disconnected state with "Connect Wallet" prompt
   - `/leaderboard`: Show empty table structure with tabs
   - `/admin`: Hidden route, basic auth check (hardcoded admin address)

5. **Basic Hooks**
   - `useWallet`: Abstract wallet connection state
   - `useWeETHBalance`: Read weETH token balance from contract
   - `useChainValidation`: Ensure user is on correct network

**Deliverable:** Users can navigate the app, connect/disconnect wallet, see their weETH balance, and view empty page structures.

---

### **PHASE 2: Smart Contracts & Vault Integration** (Days 6-10)

**Goal:** Deploy minimal smart contracts, enable deposit/withdraw of weETH, mock YC accrual.

#### Tasks:

1. **Smart Contract Development**
   - **GameVault.sol** (minimal, ~100 lines):
     - Accept weETH deposits (ERC-20 transferFrom)
     - Track user principal balances (mapping)
     - Allow withdrawals of principal only
     - Emit events: Deposit, Withdraw
     - Include emergency pause mechanism
   - **YieldCredits.sol** (off-chain friendly):
     - Can be entirely off-chain for demo, or minimal on-chain ledger
     - Store YC balances (mapping address => uint256)
     - Functions: mint (admin only), burn (on bet placement), transfer (internal only)
   - Deploy to Sepolia testnet using Hardhat or Foundry
   - Verify contracts on Etherscan

2. **Contract Integration (Frontend)**
   - Add contract ABIs to `/lib/contracts`
   - Create `useVault` hook:
     - `deposit(amount)`: approve weETH, call vault deposit
     - `withdraw(amount)`: call vault withdraw, update UI
     - `getPrincipalBalance()`: read user's deposited weETH
   - Create `useYieldCredits` hook:
     - `getYCBalance()`: read from API or contract
     - `ycAccrualRate`: calculated from principal (mock 5% APR for demo)
   - Handle transaction states: idle, pending, success, error
   - Toast notifications for transaction lifecycle

3. **Vault UI Components**
   - **VaultCard** component:
     - Display Principal (weETH) balance with "SAFE" badge
     - Display YC balance with accrual animation (shimmer effect)
     - APR indicator: "Simulated APR: 5% for Demo" with info tooltip
     - Deposit button: opens modal with amount input
     - Withdraw button: opens modal with max principal amount
   - **DepositModal**:
     - Input weETH amount (with max button)
     - Show approval step if needed
     - Show deposit confirmation
     - Display gas estimate
   - **WithdrawModal**:
     - Input weETH amount (max = deposited principal)
     - Confirm withdrawal
     - Warn user: "YC balance unaffected"
   - YC meter: circular progress or linear bar with breathing animation

4. **YC Accrual Logic (Simulated)**
   - API route: `POST /api/vault/accrue`
     - Calculate YC based on: `principal * APR * timeElapsed / 31536000`
     - Store in database or in-memory store
     - Return updated YC balance
   - Frontend: poll or use interval to update YC display every 10 seconds
   - Store `lastAccrualTime` to calculate delta correctly

5. **Database Setup (Lightweight)**
   - Choose: SQLite (local), PostgreSQL (Vercel), or in-memory (Redis/Upstash)
   - Schema:
     - `users`: address, ycBalance, principal, lastAccrualTime, xp, level, stats
     - `markets`: id, question, closeTime, difficulty, yesPool, noPool, resolved, outcome
     - `positions`: id, userId, marketId, side, amount, claimed
     - `quests`: id, userId, marketId, difficulty, accepted, completed
     - `achievements`: id, userId, type, earnedAt

**Deliverable:** Users can deposit weETH, see YC accruing in real-time, and withdraw principal. Vault card displays both balances clearly.

---

### **PHASE 3: Markets & Prediction Gameplay** (Days 11-16)

**Goal:** Create, display, and interact with prediction markets. Users can place YC bets.

#### Tasks:

1. **Market Data Management**
   - API routes:
     - `GET /api/markets`: List all markets (filter: active, resolved)
     - `POST /api/markets`: Admin creates market (question, closeTime, difficulty)
     - `PATCH /api/markets/:id/resolve`: Admin resolves market (outcome: YES/NO)
   - Seed 5-10 demo markets with varied topics and difficulties

2. **Market UI Components**
   - **MarketCard** component:
     - Question title (truncated with tooltip)
     - Difficulty indicator (1-5 stars or badges)
     - Close time countdown
     - YES/NO pool sizes (mocked or real)
     - Implied odds display (e.g., "YES: 65% | NO: 35%")
     - "Place Bet" button
     - Status badge: Active (green), Closing Soon (amber), Resolved (gray)
   - **MarketsList**:
     - Tabs: Active Markets, Resolved Markets
     - Skeleton loaders on initial fetch
     - Empty state: "No markets available. Check back soon!"

3. **Bet Placement Flow**
   - **BetTicket** component (slide-in panel from right):
     - Market question summary
     - User's current YC balance (large, prominent)
     - Side selector: YES / NO (radio buttons or toggle)
     - Amount input (numeric, validate <= YC balance)
     - Expected payout calculation: `amount * (totalPool / sidePool)`
     - Claude hint section (fetch on open):
       - Probability estimate (e.g., "58% YES")
       - Educational tip (1 sentence, e.g., "Consider recent trends in similar events")
     - Confirm button with loading state
     - Dismiss on ESC or backdrop click
   - API: `POST /api/positions`
     - Validate YC balance
     - Deduct YC from user
     - Create position record
     - Update market pools
     - Award XP (+10 for placing bet)

4. **Market Resolution & Claiming**
   - Admin panel: `/admin/markets`
     - List all markets with resolve buttons
     - Resolve modal: select outcome (YES/NO/CANCEL)
     - Trigger resolution, calculate winners
   - API: `POST /api/positions/:id/claim`
     - Check if market resolved
     - Check if user won
     - Calculate payout: `stakedAmount * (totalPool / winningSidePool)`
     - Credit YC to user
     - Mark position as claimed
     - Award XP (+20 for correct prediction, +5 for streak bonus)
   - **ClaimButton** on resolved market cards:
     - Show "Claim YC" if won and unclaimed
     - Show "Lost" if lost (disabled)
     - Show confetti animation on claim success

5. **Probability Hints (Claude Integration - Basic)**
   - API: `POST /api/claude/probability-hint`
     - Input: market question, difficulty, user stats (optional)
     - Call Anthropic API with structured prompt:
       ```
       Return JSON only:
       {
         "probability": 0.0-1.0,
         "rationale": "one sentence",
         "tip": "one educational sentence"
       }
       ```
     - Cache response for 5 minutes per market
   - Display in BetTicket with subtle lavender highlight

**Deliverable:** Users can browse markets, place YC bets, see active positions, and claim winnings after resolution. Admin can create and resolve markets.

---

### **PHASE 4: Claude Quests & Adaptive Gameplay** (Days 17-21)

**Goal:** Claude generates personalized quests. Users can accept quests and receive post-resolution feedback.

#### Tasks:

1. **Quest Generation System**
   - API: `POST /api/quests/generate`
     - Input: user stats (wins, losses, accuracy, recentStakes, level)
     - Call Anthropic API with structured prompt:
       ```
       Return JSON only with exactly 3 quests:
       [
         {
           "title": "string",
           "question": "string",
           "suggestedStake": number,
           "difficulty": 1-5,
           "learningOutcome": "one sentence",
           "closeTime": "ISO timestamp"
         },
         ...
       ]
       Rules:
       - Adapt difficulty to user's accuracy (if >70%, harder quests)
       - Vary topics (finance, sports, politics, tech, culture)
       - Ensure closeTime is 1-7 days out
       - No financial advice
       ```
     - Validate JSON structure, retry once if malformed
     - Store quests with userId, status: generated

2. **Quest UI Components**
   - **QuestsPanel** on `/play` page:
     - "Get Quests" button (calls generate API)
     - Display 3 quest cards in vertical or grid layout
   - **QuestCard** component:
     - Title and question
     - Difficulty (color-coded: easy=green, hard=red)
     - Suggested YC stake (editable)
     - Learning outcome in italics
     - Countdown to close time
     - "Accept Quest" button
   - **AcceptQuest** flow:
     - Creates a market (or links to existing market with same question)
     - Pre-fills BetTicket with quest details
     - Marks quest as accepted
     - User completes bet as normal
     - Track quest completion separately from regular bets

3. **Post-Resolution Feedback**
   - API: `POST /api/quests/:id/feedback`
     - Input: questId, outcome (won/lost), user stats
     - Call Anthropic API:
       ```
       Return JSON only:
       {
         "feedback": "one paragraph analyzing user's decision",
         "suggestion": "one micro-quest or tip"
       }
       ```
     - Store feedback with quest record
   - Display in **QuestFeedbackModal** after user claims or views resolved quest:
     - Show outcome (won/lost)
     - Claude's feedback paragraph
     - Suggested next step
     - "Got it" button to dismiss

4. **Quest Tracking**
   - Profile page: "My Quests" section
     - Timeline view: accepted → in progress → resolved → completed
     - Show feedback for completed quests
     - Stats: total quests completed, success rate

**Deliverable:** Users can generate 3 personalized quests, accept them, and receive Claude's feedback after resolution. Quests feel adaptive and educational.

---

### **PHASE 5: Player Progression & Social Features** (Days 22-27)

**Goal:** Implement XP, levels, achievements, and leaderboards.

#### Tasks:

1. **XP & Leveling System**
   - XP awards:
     - Place bet: +10 XP
     - Win bet: +20 XP
     - 3-win streak: +50 XP bonus
     - Complete Claude quest: +30 XP
     - First deposit: +15 XP
     - First withdrawal: +10 XP
   - Level formula: `level = floor(sqrt(xp / 100))`
   - Level thresholds: 0, 100, 400, 900, 1600, 2500... (quadratic)
   - API: `PATCH /api/users/:address/xp`
     - Add XP, recalculate level
     - Check for level-up, trigger achievement check
   - **LevelBadge** component:
     - Display current level with icon
     - Progress bar to next level
     - Tooltip: "Next level at X XP"

2. **Achievement System**
   - Define achievements:
     - "First Blood": Place first bet (Common)
     - "Hat Trick": 3 wins in a row (Rare)
     - "Sharpshooter": >60% accuracy with 10+ bets (Epic)
     - "Quest Master": Complete 5 Claude quests (Rare)
     - "Diamond Hands": Withdraw after 7 days (Uncommon)
     - "Whale": Deposit >1 weETH (Rare)
     - "Oracle": >75% accuracy with 20+ bets (Legendary)
   - API: `POST /api/achievements/check`
     - Run after each XP-awarding action
     - Check conditions for all achievements
     - Award if conditions met, mark earnedAt
   - **AchievementBadge** component:
     - Icon (unique per achievement)
     - Rarity color: Common (gray), Uncommon (green), Rare (blue), Epic (purple), Legendary (gold)
     - Name and description
     - Earned timestamp
   - **AchievementEarnedModal**:
     - Confetti animation
     - Badge scale-in effect
     - "You earned [name]!" message
     - Click to dismiss (also skippable after 3 seconds)

3. **Skill Metrics**
   - Calculate on each bet resolution:
     - Accuracy: `correctBets / totalBets * 100`
     - Yield Efficiency: `(ycWon - ycSpent) / ycSpent * 100`
     - Wisdom Index: `(accuracy * 0.5) + (yieldEfficiency * 0.3) + (streakBonus * 0.2)`
   - Display on profile and leaderboard
   - Store in user record, update after each claim

4. **Profile Page**
   - Header:
     - ENS name or shortened address
     - Avatar (Jazzicon or ENS avatar)
     - Class badge (auto-assigned based on behavior):
       - Oracle: high accuracy, moderate stakes
       - Degen: high stakes, lower accuracy
       - Analyst: high wisdom index
       - Whale: high principal deposited
   - Stats section:
     - Level, XP, Accuracy, Wisdom Index
     - Total bets, wins, losses
     - YC profit/loss
   - Achievements grid:
     - Show earned achievements with full color
     - Show locked achievements as grayscale with "???"
     - Hover for tooltips
   - History timeline:
     - List of completed quests and bets
     - Show outcome, YC change, XP earned
     - Pagination or infinite scroll
   - Preferences:
     - Toggle: Show on leaderboard (default: true)
     - Toggle: Email notifications (if email collected)
     - Input: Display name (optional)

5. **Leaderboard Page**
   - Three tabs:
     - Accuracy Leaders: sort by accuracy (min 10 bets)
     - Wisdom Index Leaders: sort by wisdom index (min 10 bets)
     - Quest Masters: sort by completed quests count
   - Table columns:
     - Rank (#1, #2, ...)
     - Avatar
     - Address (ENS or shortened)
     - Metric value
     - Change indicator (up/down/same since last period)
   - Search bar: filter by address or ENS
   - Highlight current user row (if opted in)
   - Pagination: 20 per page
   - Empty state: "Not enough participants yet. Be the first!"

**Deliverable:** Users level up, earn animated achievement badges, view detailed stats on profile, and compete on leaderboards.

---

### **PHASE 6: Portfolio Analytics & Final Polish** (Days 28-32)

**Goal:** Add portfolio analytics, onboarding checklist, final UI polish, and demo readiness.

#### Tasks:

1. **Portfolio Analytics**
   - Data collection:
     - Track principal and YC balances over time (snapshot daily or on each action)
     - Track bet allocation (YES vs NO) per day/week
   - API: `GET /api/analytics/:address`
     - Return time series: `[{ date, principal, yc }, ...]`
     - Return allocation: `{ yes: X, no: Y }`
     - Return outcomes summary: `{ spent, won, net }`
   - **AnalyticsPanel** on `/profile`:
     - Line chart: Principal vs YC over time (recharts)
     - Pie/donut chart: YC allocation YES vs NO
     - Summary cards: Total Spent, Total Won, Net YC Change
     - "Insights" box:
       - Call Claude API with user behavior data
       - Display 1-2 hints (e.g., "You tend to favor YES bets. Try diversifying.")
       - Educational, not financial advice

2. **Onboarding Checklist**
   - Show modal on first visit (localStorage flag: `hasSeenOnboarding`)
   - Checklist items (track completion in user record):
     - Connect wallet ✓
     - Deposit weETH ✓
     - Generate quests ✓
     - Place first YC bet ✓
     - Resolve a market (wait) ✓
     - Claim YC winnings ✓
     - Withdraw principal ✓
   - Each completed step shows green checkmark
   - "Skip Tutorial" option
   - Re-accessible from Help menu

3. **Education Layer (Tooltips & Help)**
   - Add tooltips throughout:
     - Principal: "Your deposited weETH. Always safe and withdrawable."
     - YC: "Yield Credits from your principal. Spend on predictions, never lose principal."
     - Wisdom Index: "Composite score: accuracy, efficiency, and consistency."
     - Simulated APR: "Demo uses mocked 5% APR. Real APR varies by market conditions."
   - Help icon in header: opens modal with FAQ:
     - "What is no-loss prediction?"
     - "How do Yield Credits work?"
     - "Can I lose my principal?"
     - "What happens if I win/lose?"
   - Inline hints on empty states and first-time flows

4. **UI/UX Polish**
   - Responsive design audit:
     - Test on mobile (375px), tablet (768px), desktop (1280px+)
     - Ensure all modals, panels, and tables adapt correctly
   - Accessibility audit:
     - Run axe-core or Lighthouse accessibility check
     - Ensure WCAG AA contrast (4.5:1 for text)
     - Full keyboard navigation (Tab, Enter, Esc)
     - Focus rings visible and styled
     - ARIA labels on interactive elements
   - Motion preferences:
     - Respect `prefers-reduced-motion` media query
     - Disable confetti and shimmer animations if set
   - Loading states:
     - Skeleton loaders for markets, quests, leaderboard
     - Spinner for transactions and API calls
     - Disable buttons during pending states
   - Error handling:
     - User-friendly error messages (not raw contract errors)
     - Retry buttons on failed API calls
     - Network error banner if offline

5. **Demo Readiness**
   - Seed realistic demo data:
     - 10 active markets (varied topics and difficulties)
     - 5 resolved markets with outcomes
     - 3 demo users on leaderboard (if needed)
   - Create demo wallet with testnet weETH:
     - Document faucet process or provide pre-funded address
   - Admin panel polish:
     - Clean UI for creating/resolving markets
     - Bulk seed data button
     - APR rate adjustment slider
   - Performance optimization:
     - Optimize images (next/image)
     - Lazy load non-critical components
     - Minimize API calls (caching, SWR/React Query)
   - Branding:
     - EtherFi logo in header and footer
     - "Powered by EtherFi (weETH)" banner on home and play
     - Claude logo in quest sections
     - Consistent visual identity

6. **Testing & QA**
   - Manual testing checklist:
     - Complete onboarding flow
     - Deposit/withdraw cycle
     - Place bet, resolve, claim
     - Generate quests, accept, complete
     - Level up, earn achievement
     - View leaderboard and profile
     - Mobile responsiveness
     - Keyboard navigation

**Deliverable:** Fully polished dApp with analytics, onboarding, comprehensive tooltips, responsive design, and demo-ready state. Ready for presentation.

---

### **Post-Launch: Future Enhancements** (Not in MVP)

- Real oracle integration (Chainlink, Pyth, UMA) for market resolution
- On-chain NFT minting for achievements
- Social features: comments on markets, user profiles, following
- Mobile app (React Native or PWA)
- Multi-chain support (Arbitrum, Optimism, Base)
- Advanced analytics: heatmaps, correlation analysis
- Tournament mode: time-boxed competitions with prizes
- Referral system: invite friends, earn bonus YC
- Live APR from EtherFi protocol contracts
- Gasless transactions (meta-transactions or account abstraction)

---

## Technology Stack Summary

**Frontend:**

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Framer Motion
- Wagmi + Viem
- RainbowKit or Web3Modal
- Recharts
- React Hook Form + Zod
- Zustand or Context API

**Backend:**

- Next.js API Routes (primary)
- Python FastAPI/Flask (if needed for complex Claude logic)

**Smart Contracts:**

- Solidity 0.8.x
- Hardhat or Foundry
- OpenZeppelin contracts
- Deployed on Sepolia testnet

**Database:**

- PostgreSQL (Vercel Postgres) or SQLite (local dev)
- Prisma ORM (optional)

**External APIs:**

- Anthropic Claude API (quest generation, hints, feedback)
- Alchemy or Infura (RPC provider)
- Etherscan API (ENS resolution, contract verification)

**Deployment:**

- Vercel (frontend + API routes)
- Sepolia testnet (smart contracts)

---

## Key Risks & Mitigations

**Risk 1: Claude API rate limits or latency**

- Mitigation: Cache responses aggressively (5-15 min), implement retry logic, have fallback static content

**Risk 2: Smart contract bugs in vault**

- Mitigation: Use battle-tested OpenZeppelin patterns, thorough testing, emergency pause function, testnet only for demo

**Risk 3: YC accrual logic complexity**

- Mitigation: Keep it simple (linear APR), clearly document as "demo simulation", use time-based snapshots

**Risk 4: Responsive design issues**

- Mitigation: Mobile-first approach, continuous testing on real devices, use Tailwind responsive utilities consistently

**Risk 5: User confusion about no-loss mechanic**

- Mitigation: Prominent tooltips, onboarding checklist, clear visual separation of Principal vs YC, educational layer throughout

**Risk 6: Leaderboard spam or gaming**

- Mitigation: Minimum participation threshold (10 bets), optional opt-out, rate limiting on bet placement

---

## Success Metrics (Demo Evaluation)

1. **User Flow Completion:**
   - 90%+ of demo users complete onboarding checklist
   - 80%+ place at least one YC bet
   - 70%+ generate and accept a Claude quest

2. **UI/UX Quality:**
   - Zero WCAG AA violations
   - <3 second page load times
   - Zero critical bugs during demo

3. **Feature Completeness:**
   - All 8 feature specifications (A-H) implemented
   - All 5 pages (Home, Play, Profile, Leaderboard, Admin) functional
   - Claude integration working for quests, hints, and feedback

4. **Polish:**
   - Consistent design system across all pages
   - Smooth animations (no jank)
   - Helpful empty states and error messages
   - Mobile-responsive on all screens

5. **Story Clarity:**
   - Demo viewers understand "no-loss" mechanic within 30 seconds
   - Principal vs YC distinction is immediately clear
   - EtherFi and Claude branding visible and explained

## Implementation Status

- [x] Phase 0: Project Bootstrap & Foundation
- [x] Phase 1: Wallet Integration & Basic UI Shell
- [x] Phase 2: Smart Contracts & Vault Integration
- [x] Phase 3: Markets & Prediction Gameplay
- [x] Phase 4: Claude Quests & Adaptive Gameplay
- [ ] Phase 5: Player Progression & Social Features
- [ ] Phase 6: Portfolio Analytics & Final Polish
- [ ] Post-Launch: Future Enhancements (Not in MVP)

## Implementation Notes for future developers

### Phase 2 & 3 - Key Implementation Details

**Database Schema (Prisma/SQLite):**

- `users`: address, ycBalance, principal, lastAccrualTime, xp, level, wins, losses, accuracy
- `markets`: id, question, closeTime, difficulty, yesPool, noPool, resolved, outcome
- `positions`: id, userId, marketId, side, amount, claimed
- `quests`: id, userId, marketId, difficulty, accepted, completed (ready for Phase 4)

**Existing API Routes:**

- YC: GET /api/yc/balance, POST /api/yc/accrue, POST /api/yc/update-principal
- Markets: GET/POST /api/markets, PATCH /api/markets/:id/resolve, POST/DELETE /api/markets/seed
- Positions: GET/POST /api/positions, POST /api/positions/:id/claim
- Claude: POST /api/claude/probability-hint (returns {probability, rationale, tip})

**Key Technical Notes:**

- @anthropic-ai/sdk installed and working
- Next.js 15+ requires async params in dynamic routes
- Toast store: use toast.success/error (not useToast hook)
- XP system: +10 bet, +20 win, +50 streak
- User stats (wins, losses, accuracy) tracked in users table
- Tooltip component: uses isMounted check to prevent hydration issues, properly cleans up setTimeout
- Web3Provider: QueryClient uses useState with lazy initialization for stability across renders

**Phase 4 - Claude Quests Implementation:**

- Quest generation API (/api/quests/generate): Generates 3 personalized quests with adaptive difficulty
- Quest acceptance API (/api/quests/accept): Creates/links markets, marks quest as accepted
- Quest feedback API (/api/quests/feedback): Generates post-resolution educational feedback using Claude
- Quest user API (/api/quests/user): Fetches user's quest history
- QuestCard, QuestsPanel, QuestFeedbackModal, QuestHistory UI components
- Quest tracking on profile page with status indicators (Generated, In Progress, Completed)
- XP rewards: +30 XP for completing quests
- Adaptive difficulty: >70% accuracy = harder quests (4-5), <50% = easier (1-3)
- Quest schema: includes marketId, feedback, suggestion fields

**Phase 5 Requirements:**

- Implement XP and leveling system (level = floor(sqrt(xp / 100)))
- Create achievement system with 7 core achievements (First Bet, Hat Trick, Sharpshooter, etc.)
- Build achievement badges with NFT-ready designs
- Add accuracy, yield efficiency, and wisdom index calculations
- Create leaderboard with three tabs (Accuracy, Wisdom Index, Quest Masters)
- Build profile page with stats, achievements grid, and history timeline
- Implement class badges (Oracle, Degen, Analyst, Whale)
