import { http, createConfig } from "wagmi";
import { sepolia } from "wagmi/chains";
import { injected, walletConnect } from "wagmi/connectors";
import { config as appConfig } from "./config";

export const wagmiConfig = createConfig({
  chains: [sepolia],
  connectors: [
    injected({
      target: "metaMask",
    }),
    walletConnect({
      projectId: appConfig.walletConnectProjectId,
      metadata: {
        name: "EtherFi Prediction Game",
        description: "No-loss prediction game powered by EtherFi weETH yield",
        url: typeof window !== "undefined" ? window.location.origin : "",
        icons: ["https://avatars.githubusercontent.com/u/37784886"],
      },
    }),
  ],
  transports: {
    [sepolia.id]: http(
      appConfig.alchemyApiKey
        ? `https://eth-sepolia.g.alchemy.com/v2/${appConfig.alchemyApiKey}`
        : undefined
    ),
  },
});
