import { sepolia } from "viem/chains";
import type { Chain } from "viem";

// Environment Variables
export const config = {
  // Wallet Connect
  walletConnectProjectId: process.env.NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID || "",

  // Network
  chainId: parseInt(process.env.NEXT_PUBLIC_CHAIN_ID || "11155111", 10),

  // Contract Addresses
  contracts: {
    weETH: (process.env.NEXT_PUBLIC_WEETH_ADDRESS || "0x0") as `0x${string}`,
    vault: (process.env.NEXT_PUBLIC_VAULT_ADDRESS || "0x0") as `0x${string}`,
  },

  // RPC
  alchemyApiKey: process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "",

  // Claude AI
  anthropicApiKey: process.env.CLAUDE_API_KEY || "",

  // Demo Config
  simulatedAPR: parseFloat(process.env.NEXT_PUBLIC_SIMULATED_APR || "5"),

  // Admin
  adminAddresses: (process.env.NEXT_PUBLIC_ADMIN_ADDRESSES || "")
    .split(",")
    .filter(Boolean)
    .map((addr) => addr.toLowerCase()),
};

// Chain Configuration
export const supportedChains: Chain[] = [sepolia];

export const defaultChain = sepolia;

// RPC URL
export const getRpcUrl = () => {
  if (config.alchemyApiKey) {
    return `https://eth-sepolia.g.alchemy.com/v2/${config.alchemyApiKey}`;
  }
  return "https://rpc.sepolia.org";
};

// Helper functions
export const isAdmin = (address: string | undefined): boolean => {
  if (!address) return false;
  return config.adminAddresses.includes(address.toLowerCase());
};

export const formatAddress = (address: string, chars = 4): string => {
  return `${address.substring(0, chars + 2)}...${address.substring(address.length - chars)}`;
};

export const formatNumber = (num: number, decimals = 2): string => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};
