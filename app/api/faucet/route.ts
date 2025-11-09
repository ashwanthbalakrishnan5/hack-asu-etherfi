import { NextRequest, NextResponse } from "next/server";
import { createWalletClient, http, parseEther } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { sepolia } from "viem/chains";
import { config } from "@/lib/config";
import MockWeETHABI from "@/lib/contracts/MockWeETH.json";

/**
 * POST /api/faucet
 * Sends test weETH to a user's wallet
 * This is a demo-only feature
 */
export async function POST(req: NextRequest) {
  try {
    const { address } = await req.json();

    if (!address) {
      return NextResponse.json({ error: "Address required" }, { status: 400 });
    }

    // Validate address format
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) {
      return NextResponse.json({ error: "Invalid address format" }, { status: 400 });
    }

    // Get private key from environment
    const privateKey = process.env.PRIVATE_KEY;
    if (!privateKey) {
      return NextResponse.json(
        { error: "Faucet not configured" },
        { status: 500 }
      );
    }

    // Create wallet client
    const account = privateKeyToAccount(privateKey as `0x${string}`);
    const walletClient = createWalletClient({
      account,
      chain: sepolia,
      transport: http(
        config.alchemyApiKey
          ? `https://eth-sepolia.g.alchemy.com/v2/${config.alchemyApiKey}`
          : "https://rpc.sepolia.org"
      ),
    });

    // Transfer 10 weETH from the faucet wallet to the user
    const hash = await walletClient.writeContract({
      address: config.contracts.weETH as `0x${string}`,
      abi: MockWeETHABI.abi,
      functionName: "transfer",
      args: [address as `0x${string}`, parseEther("10")],
      account,
    });

    return NextResponse.json({
      success: true,
      txHash: hash,
      amount: "10 weETH",
      message: "Faucet request successful! 10 weETH will be sent to your wallet.",
    });
  } catch (error: any) {
    console.error("Faucet error:", error);

    // Check if user already claimed recently
    if (error.message?.includes("revert")) {
      return NextResponse.json(
        { error: "Faucet cooldown active. Try again later." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: "Faucet request failed" },
      { status: 500 }
    );
  }
}
