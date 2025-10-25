import { http, createConfig } from 'wagmi';
import { base, baseSepolia } from 'wagmi/chains';
import { injected } from 'wagmi/connectors';

export const config = createConfig({
  chains: [baseSepolia, base], // Supporte Base Sepolia et Base Mainnet
  connectors: [
    injected(), // Warpcast Wallet
  ],
  transports: {
    [baseSepolia.id]: http('https://sepolia.base.org'),
    [base.id]: http('https://mainnet.base.org'),
  },
});

// Chain par défaut pour ton app
export const DEFAULT_CHAIN = baseSepolia; // Ou 'base' pour mainnet
