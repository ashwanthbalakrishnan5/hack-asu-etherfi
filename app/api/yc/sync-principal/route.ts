import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createPublicClient, http, formatEther } from "viem";
import { sepolia } from "viem/chains";
import { config } from "@/lib/config";
import GameVaultABI from "@/lib/contracts/GameVault.json";

/**
 * POST /api/yc/sync-principal
 * Syncs on-chain principal balance to database
 */
export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json();

    if (!address) {
      return NextResponse.json({ error: "Address required" }, { status: 400 });
    }

    // Create public client to read from blockchain
    const publicClient = createPublicClient({
      chain: sepolia,
      transport: http(
        config.alchemyApiKey
          ? `https://eth-sepolia.g.alchemy.com/v2/${config.alchemyApiKey}`
          : "https://rpc.sepolia.org"
      ),
    });

    // Read principal balance from vault contract
    const principalBalance = await publicClient.readContract({
      address: config.contracts.vault as `0x${string}`,
      abi: GameVaultABI.abi,
      functionName: "getPrincipalBalance",
      args: [address as `0x${string}`],
    });

    // Convert from Wei to Ether
    const principalInEther = parseFloat(formatEther(principalBalance as bigint));

    // Update or create user with on-chain principal
    const user = await prisma.user.upsert({
      where: { address: address.toLowerCase() },
      update: {
        principal: principalInEther,
      },
      create: {
        address: address.toLowerCase(),
        ycBalance: 1000, // Default YC balance for new users
        principal: principalInEther,
        lastAccrualTime: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      principal: principalInEther,
      address: user.address,
    });
  } catch (error) {
    console.error("Error syncing principal:", error);
    return NextResponse.json(
      { error: "Failed to sync principal balance" },
      { status: 500 }
    );
  }
}
