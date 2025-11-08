# EtherFi Prediction Game

A no-loss, yield-only prediction game built on EtherFi (weETH) with Claude as the adaptive Game Master.

## 🎯 Product Vision

Users stake weETH (principal is safe), earn Yield Credits from the yield, and use only those credits to make predictions on real-world events. Claude AI acts as an adaptive game master, providing personalized quests, probability hints, and learning feedback.

## 🚀 Quick Start

### Prerequisites

1. **Node.js** 18+ and npm
2. **WalletConnect Project ID**: Get from [cloud.walletconnect.com](https://cloud.walletconnect.com)
3. **Alchemy API Key** (optional): Get from [alchemy.com](https://www.alchemy.com)
4. **Anthropic API Key**: Get from [console.anthropic.com](https://console.anthropic.com)

### Installation

```bash
# Install dependencies
npm install

# Copy environment file
cp .env.example .env.local

# Fill in required variables in .env.local
# - NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID (required)
# - NEXT_PUBLIC_ALCHEMY_API_KEY (optional)
# - ANTHROPIC_API_KEY (for Claude features)

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

## 📁 Project Structure

```
/app                    # Next.js App Router pages and API routes
  /api                  # API endpoints (Claude, markets, quests, vault)
  /play                 # Main gameplay page
  /profile              # User profile and stats
  /leaderboard          # Global leaderboards
  /admin                # Admin panel (market management)

/components
  /ui                   # Base design system components
  /wallet               # Wallet connection components
  /vault                # Vault and YC components
  /markets              # Market cards and bet tickets
  /quests               # Claude quest components
  /profile              # Profile sections
  /leaderboard          # Leaderboard tables

/lib
  /contracts            # Smart contract ABIs and addresses
  /utils                # Helper functions
  /hooks                # Custom React hooks
  /stores               # Zustand state management
  /types                # TypeScript type definitions
  config.ts             # App configuration
  wagmi.ts              # Web3 configuration
```

## 🎨 Design System

### Colors

- **Background**: Deep navy (#0a0f1a)
- **Surface**: Lighter navy (#131b2e)
- **Primary**: Vivid cyan (#00d4ff) - EtherFi branding
- **Success**: Soft green (#4ade80)
- **Warning**: Amber (#fbbf24)
- **Error**: Red (#ef4444)
- **Claude**: Lavender (#c4b5fd)

### Components

All base components are in `/components/ui`:
- Button (primary, secondary, subtle)
- Card (with Header, Body, Footer)
- Input (with validation states)
- Badge (status indicators)
- Tooltip (contextual help)
- Toast (notifications)

## 🔧 Tech Stack

- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Web3**: Wagmi + Viem + RainbowKit
- **State**: Zustand
- **Animations**: Framer Motion
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod
- **AI**: Anthropic Claude API

## 📋 Development Phases

- ✅ **Phase 0**: Project Bootstrap & Foundation (COMPLETED)
- 🔄 **Phase 1**: Wallet Integration & UI Shell (Next)
- ⏳ **Phase 2**: Smart Contracts & Vault Integration
- ⏳ **Phase 3**: Markets & Prediction Gameplay
- ⏳ **Phase 4**: Claude Quests & Adaptive Gameplay
- ⏳ **Phase 5**: Player Progression & Social Features
- ⏳ **Phase 6**: Portfolio Analytics & Final Polish

See `PHASE_0_COMPLETE.md` for Phase 0 details and `CLAUDE.md` for complete specifications.

## 🔑 Environment Variables

Required variables in `.env.local`:

```env
# Wallet Connect (required for wallet connection)
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=

# Network (Sepolia testnet)
NEXT_PUBLIC_CHAIN_ID=11155111

# Contract Addresses (fill after deployment)
NEXT_PUBLIC_WEETH_ADDRESS=
NEXT_PUBLIC_VAULT_ADDRESS=

# RPC Provider (optional, public RPC used as fallback)
NEXT_PUBLIC_ALCHEMY_API_KEY=

# Claude AI (required for quest features)
ANTHROPIC_API_KEY=

# Demo Config
NEXT_PUBLIC_SIMULATED_APR=5
NEXT_PUBLIC_ADMIN_ADDRESSES=
```

## 🧪 Available Scripts

```bash
# Development
npm run dev          # Start dev server

# Production
npm run build        # Build for production
npm start            # Start production server

# Code Quality
npm run lint         # Run ESLint
```

## 📖 Key Features

### No-Loss Mechanics
- Stake weETH (principal is safe and withdrawable)
- Earn Yield Credits (YC) from yield accrual
- Spend only YC on predictions
- Never risk principal

### Claude AI Game Master
- Personalized quest generation
- Adaptive difficulty based on performance
- Probability hints and educational tips
- Post-resolution feedback and guidance

### Player Progression
- XP and leveling system
- Achievements with NFT-ready designs
- Player classes (Oracle, Degen, Analyst, Whale)
- Skill metrics (Accuracy, Yield Efficiency, Wisdom Index)

### Social & Competition
- Global leaderboards
- Quest masters ranking
- Privacy controls (opt-out available)

## 🛠️ Next Steps

1. Fill in `.env.local` with required API keys
2. Run `npm run dev` to start development server
3. Begin Phase 1: Wallet connection and navigation
4. Deploy smart contracts for Phase 2
5. Integrate Claude API for Phase 4

## 📝 License

Private project for Hack ASU (EtherFi)

## 🤝 Contributing

See `CLAUDE.md` for strict development guidelines and product requirements.
