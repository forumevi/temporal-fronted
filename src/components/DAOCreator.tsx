// src/components/DAOCreator.tsx
'use client';

import { useWriteContract } from 'wagmi';

export function DAOCreator() {
  const { writeContract } = useWriteContract();

  return (
    <button
      onClick={() => writeContract({
        address: '0x8e166334A7C23e20A0495ae4dF5a891C68b6D34E',
        abi: [...],
        functionName: 'createDAO',
        args: [1000n, 86400n] // örn: 1000 token, 1 gün süre
      })}
      className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm transition"
    >
      Create New DAO
    </button>
  );
}
