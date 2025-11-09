import GameVaultABI from "./GameVault.json";
import MockWeETHABI from "./MockWeETH.json";

export const CONTRACTS = {
  weETH: {
    address: (process.env.NEXT_PUBLIC_WEETH_ADDRESS ||
      "0x0000000000000000000000000000000000000000") as `0x${string}`,
    abi: MockWeETHABI.abi,
  },
  vault: {
    address: (process.env.NEXT_PUBLIC_VAULT_ADDRESS ||
      "0x0000000000000000000000000000000000000000") as `0x${string}`,
    abi: GameVaultABI.abi,
  },
} as const;

export { GameVaultABI, MockWeETHABI };
