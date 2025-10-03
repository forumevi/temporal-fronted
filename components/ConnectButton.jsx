'use client';

import { useAccount, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

const somniaChain = {
  chainId: '0x13A7', // 5031'in hex karşılığı
  chainName: 'Somnia Mainnet',
  nativeCurrency: { name: 'SOMNIA', symbol: 'SOMI', decimals: 18 },
  rpcUrls: ['https://api.infra.mainnet.somnia.network'],
  blockExplorerUrls: ['https://explorer.somnia.network'],
};

async function switchToSomnia() {
  if (window.ethereum) {
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: somniaChain.chainId }],
      });
    } catch (switchError) {
      // Eğer ağ ekli değilse, ekle
      if (switchError.code === 4902) {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [somniaChain],
        });
      }
    }
  }
}

export function ConnectButton() {
  const { address } = useAccount();
  const { connect } = useConnect({ connector: injected() });

  if (address)
    return (
      <div className="px-4 py-2 bg-gray-800 rounded-full text-sm">
        {address.slice(0, 6)}...{address.slice(-4)}
      </div>
    );

  return (
    <button
      onClick={async () => {
        await switchToSomnia();
        connect();
      }}
      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-full text-sm transition"
    >
      Connect Wallet
    </button>
  );
}
