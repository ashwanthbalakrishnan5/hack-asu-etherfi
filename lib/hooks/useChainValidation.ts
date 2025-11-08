import { useAccount, useChainId, useSwitchChain } from "wagmi";
import { config, defaultChain } from "@/lib/config";

/**
 * Hook to ensure user is on the correct network
 */
export function useChainValidation() {
  const { isConnected, chain } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  const isCorrectChain = chainId === config.chainId;
  const isWrongChain = isConnected && !isCorrectChain;

  const switchToCorrectChain = () => {
    if (switchChain) {
      switchChain({ chainId: defaultChain.id });
    }
  };

  return {
    isCorrectChain,
    isWrongChain,
    currentChain: chain,
    expectedChainId: config.chainId,
    switchToCorrectChain,
  };
}
