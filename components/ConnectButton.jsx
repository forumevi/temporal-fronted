import { useAccount, useDisconnect } from 'wagmi';

export function ConnectButton() {
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (!isConnected) {
    return (
      <button className="px-4 py-2 bg-indigo-700 hover:bg-indigo-800 rounded-full font-semibold transition shadow">
        Connect Wallet
      </button>
    );
  }
  return (
    <div className="flex items-center gap-2">
      <span className="font-mono text-sm bg-gray-800 px-2 py-1 rounded">{address.slice(0,6)}...{address.slice(-4)}</span>
      <button
        onClick={() => disconnect()}
        className="px-3 py-1 bg-gray-700 hover:bg-red-700 rounded-full text-xs font-semibold transition"
      >
        Logout
      </button>
    </div>
  );
}
