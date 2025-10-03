'use client';

import { useAccount, useConnect } from 'wagmi';
import { injected } from 'wagmi/connectors';

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
      onClick={() => connect()}
      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-full text-sm transition"
    >
      Connect Wallet
    </button>
  );
}
