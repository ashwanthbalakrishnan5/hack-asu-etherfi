import { useState, useEffect } from "react";
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseEther, formatEther } from "viem";
import { CONTRACTS } from "@/lib/contracts";

export function useVault() {
  const { address } = useAccount();
  const { writeContract, data: hash, isPending } = useWriteContract();
  const { isSuccess, isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  // Read principal balance from vault
  const { data: principalBalance, refetch: refetchPrincipal } = useReadContract({
    address: CONTRACTS.vault.address,
    abi: CONTRACTS.vault.abi,
    functionName: "getPrincipalBalance",
    args: address ? [address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Read weETH allowance
  const { data: allowance, refetch: refetchAllowance } = useReadContract({
    address: CONTRACTS.weETH.address,
    abi: CONTRACTS.weETH.abi,
    functionName: "allowance",
    args: address ? [address, CONTRACTS.vault.address] : undefined,
    query: {
      enabled: !!address,
    },
  });

  // Approve weETH spending
  const approve = async (amount: string) => {
    if (!address) throw new Error("No wallet connected");

    writeContract({
      address: CONTRACTS.weETH.address,
      abi: CONTRACTS.weETH.abi,
      functionName: "approve",
      args: [CONTRACTS.vault.address, parseEther(amount)],
    });
  };

  // Deposit weETH to vault
  const deposit = async (amount: string) => {
    if (!address) throw new Error("No wallet connected");

    writeContract({
      address: CONTRACTS.vault.address,
      abi: CONTRACTS.vault.abi,
      functionName: "deposit",
      args: [parseEther(amount)],
    });
  };

  // Withdraw weETH from vault
  const withdraw = async (amount: string) => {
    if (!address) throw new Error("No wallet connected");

    writeContract({
      address: CONTRACTS.vault.address,
      abi: CONTRACTS.vault.abi,
      functionName: "withdraw",
      args: [parseEther(amount)],
    });
  };

  // Refetch data and sync to database when transaction is successful
  useEffect(() => {
    if (isSuccess && address) {
      refetchPrincipal();
      refetchAllowance();

      // Sync principal balance to database
      fetch("/api/yc/sync-principal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address }),
      }).catch((error) => console.error("Failed to sync principal:", error));
    }
  }, [isSuccess, address, refetchPrincipal, refetchAllowance]);

  const formattedPrincipal = principalBalance
    ? formatEther(principalBalance as bigint)
    : "0";
  const formattedAllowance = allowance ? formatEther(allowance as bigint) : "0";

  return {
    principalBalance: formattedPrincipal,
    allowance: formattedAllowance,
    needsApproval: (amount: string) => {
      if (!allowance) return true;
      return parseEther(amount) > (allowance as bigint);
    },
    approve,
    deposit,
    withdraw,
    isPending,
    isConfirming,
    isSuccess,
    refetchPrincipal,
  };
}
