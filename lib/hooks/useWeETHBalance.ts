import { useAccount, useReadContract, useBalance } from "wagmi";
import { config } from "@/lib/config";
import { formatUnits } from "viem";

// Basic ERC20 ABI for balanceOf
const ERC20_ABI = [
  {
    constant: true,
    inputs: [{ name: "_owner", type: "address" }],
    name: "balanceOf",
    outputs: [{ name: "balance", type: "uint256" }],
    type: "function",
  },
] as const;

/**
 * Hook to read weETH token balance from contract
 */
export function useWeETHBalance() {
  const { address } = useAccount();

  // Read weETH balance
  const {
    data: balance,
    isLoading,
    isError,
    refetch,
  } = useReadContract({
    address: config.contracts.weETH,
    abi: ERC20_ABI,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address && config.contracts.weETH !== "0x0",
    },
  });

  // Format balance (weETH uses 18 decimals)
  const formattedBalance = balance ? parseFloat(formatUnits(balance, 18)) : 0;

  return {
    balance: formattedBalance,
    rawBalance: balance,
    isLoading,
    isError,
    refetch,
  };
}
