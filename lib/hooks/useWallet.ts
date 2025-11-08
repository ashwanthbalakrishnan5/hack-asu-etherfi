import { useAccount, useConnect, useDisconnect } from "wagmi";

/**
 * Custom hook that abstracts wallet connection state and actions
 */
export function useWallet() {
  const { address, isConnected, isConnecting, isDisconnected, chain } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  return {
    // State
    address,
    isConnected,
    isConnecting,
    isDisconnected,
    chain,

    // Actions
    connect,
    disconnect,
    connectors,
  };
}
