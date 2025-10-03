import { http, createConfig } from 'wagmi';
import { injected, coinbaseWallet, walletConnect } from 'wagmi/connectors';

export const somnia = {
  id: 5031,
  name: 'Somnia Mainnet',
  network: 'somnia',
  nativeCurrency: { name: 'SOMNIA', symbol: 'SOMI', decimals: 18 },
  rpcUrls: {
    default: { http: ['https://api.infra.mainnet.somnia.network'] },
    public: { http: ['https://api.infra.mainnet.somnia.network'] },
  },
  blockExplorers: {
    default: { name: 'Somnia Explorer', url: 'https://explorer.somnia.network' },
  },
}; // ← "as const" KALDIRILDI

export const config = createConfig({
  chains: [somnia],
  connectors: [
    injected(),
    coinbaseWallet({ appName: 'Temporal DAO' }),
    walletConnect({ projectId: 'YOUR_WALLETCONNECT_PROJECT_ID' }),
  ],
  transports: {
    [somnia.id]: http(),
  },
});
