# EtherFi Prediction Game - Setup Guide

## Quick Start

### 1. Install Dependencies

```bash
npm install
# or
yarn install
```

### 2. Configure Environment Variables

A `.env.local` file has been created for you. You need to update it with your wallet address:

```bash
# Open .env.local and replace YOUR_WALLET_ADDRESS_HERE with your actual wallet address
NEXT_PUBLIC_ADMIN_ADDRESSES=0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb  # Replace with YOUR address
```

**To find your wallet address:**
1. Connect your wallet to the app
2. Go to `/admin`
3. The access denied page will show your connected wallet address
4. Copy that address and paste it in `.env.local`

### 3. Initialize Database

```bash
npx prisma generate
npx prisma db push
```

### 4. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

---

## Using Demo Mode (No Smart Contracts Required)

You don't need to deploy smart contracts to test the app. Follow these steps:

### Step 1: Connect Your Wallet
1. Go to `http://localhost:3000`
2. Click "Connect Wallet"
3. Connect using MetaMask, WalletConnect, or your preferred wallet

### Step 2: Access Admin Panel
1. Make sure you added your wallet address to `.env.local` (see step 2 above)
2. Restart the dev server (`npm run dev`)
3. Go to `http://localhost:3000/admin`
4. You should see the admin panel

### Step 3: Initialize Demo Mode
1. In the admin panel, click **"Initialize Demo Mode"**
2. This will:
   - Give you 1000 YC (Yield Credits) instantly
   - Seed 8 diverse prediction markets
   - Set up your user profile
3. Now you can test all features without depositing real weETH!

---

## Optional: Claude AI Integration

To enable Claude AI quest generation and probability hints:

1. Get an API key from [console.anthropic.com](https://console.anthropic.com/)
2. Add it to `.env.local`:
   ```bash
   ANTHROPIC_API_KEY=sk-ant-your-key-here
   ```
3. Restart the dev server

**Features enabled with Claude:**
- Personalized quest generation
- Probability hints on bet tickets
- Post-resolution feedback

---

## Optional: Deploy Smart Contracts (Advanced)

If you want to deploy actual smart contracts to Sepolia testnet:

### 1. Add Required Environment Variables

```bash
SEPOLIA_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_KEY
PRIVATE_KEY=your_private_key_here  # WITHOUT 0x prefix
ETHERSCAN_API_KEY=your_etherscan_key  # For contract verification
```

### 2. Deploy Contracts

```bash
npx hardhat compile
npx hardhat run scripts/deploy.js --network sepolia
```

### 3. Update Contract Addresses

After deployment, update `.env.local` with the deployed addresses:

```bash
NEXT_PUBLIC_WEETH_ADDRESS=0x...  # Your deployed weETH address
NEXT_PUBLIC_VAULT_ADDRESS=0x...  # Your deployed GameVault address
```

---

## Features Overview

### Core Functionality
- ✅ **No-loss predictions**: Your principal (weETH) stays safe
- ✅ **Yield Credits**: Bet with yield, not principal
- ✅ **Claude AI**: Adaptive quest generation and hints
- ✅ **Player Progression**: XP, levels, and achievements
- ✅ **Leaderboards**: Compete on accuracy, wisdom, and quests

### Pages
- `/` - Home page with "How It Works"
- `/play` - Main gameplay (markets, quests, vault)
- `/profile` - User stats, achievements, analytics
- `/leaderboard` - Global rankings
- `/admin` - Admin panel (create/resolve markets, demo setup)

---

## Troubleshooting

### Issue: "Access Denied" on /admin
**Solution:** Make sure your wallet address is in `.env.local` and restart the dev server.

### Issue: Hydration errors
**Solution:** These have been fixed in the latest version. Make sure you pulled the latest code.

### Issue: No markets showing
**Solution:** Use the "Initialize Demo Mode" button in the admin panel.

### Issue: Claude features not working
**Solution:** Add your `ANTHROPIC_API_KEY` to `.env.local`.

### Issue: Database errors
**Solution:** Run `npx prisma db push` again.

---

## Project Structure

```
/app
  /admin         # Admin panel
  /play          # Main game page
  /profile       # User profile
  /leaderboard   # Rankings
  /api           # API routes (Claude, markets, users, etc.)

/components
  /markets       # Market cards, bet tickets, positions
  /vault         # Vault, deposits, withdrawals, YC meter
  /quests        # Quest panels, cards, feedback
  /profile       # Achievements, analytics, level badges
  /layout        # Header, footer
  /ui            # Base UI components

/lib
  /config.ts     # App configuration
  /types.ts      # TypeScript types
  /hooks         # Custom React hooks
  /stores        # State management

/prisma
  /schema.prisma # Database schema
  /dev.db        # SQLite database (local)
```

---

## Development Tips

### Hot Reload
The app supports hot reload. Changes to most files will reflect immediately.

### Database Changes
After modifying `prisma/schema.prisma`, run:
```bash
npx prisma generate
npx prisma db push
```

### Debugging
- Check browser console for errors
- Check terminal for server-side errors
- Use React DevTools for component inspection

---

## Production Deployment

### Vercel (Recommended)
1. Push code to GitHub
2. Connect repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Database for Production
For production, replace SQLite with PostgreSQL:
1. Update `prisma/schema.prisma`:
   ```prisma
   datasource db {
     provider = "postgresql"
     url      = env("DATABASE_URL")
   }
   ```
2. Add `DATABASE_URL` to environment variables
3. Run migrations: `npx prisma migrate deploy`

---

## Support

For issues or questions:
- Check `CLAUDE.md` for product specifications
- Check `README.md` for high-level overview
- File an issue on GitHub

---

## What's Been Fixed (Latest Updates)

### ✅ Critical Fixes
- Fixed admin page hydration error
- Fixed admin access denied issue
- Added comprehensive .env.local template

### ✅ UI/UX Improvements
- Fixed hardcoded text colors to use theme
- Added prominent YC balance display on play page
- Replaced console.log with toast notifications
- Added multiplier display in bet expected payout
- Active route indicators in navigation
- Dynamic copyright year
- Better null safety in profile rendering

### ✅ Design Consistency
- Replaced emoji info icons with proper Icon components
- Consistent icon sizing across tooltips
- Theme-aware colors throughout

---

Enjoy building with EtherFi Predictions! 🎮
