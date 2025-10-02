// src/components/DAOCreator.tsx
'use client';

import { useWriteContract } from 'wagmi';
import { useState } from 'react';

export function DAOCreator() {
  const { writeContract, isPending } = useWriteContract();
  const [startTime, setStartTime] = useState<string>('');
  const [duration, setDuration] = useState<string>('');

  const handleCreateDAO = () => {
    if (!startTime || !duration) return;

    writeContract({
      address: '0x8e166334A7C23e20A0495ae4dF5a891C68b6D34E', // Somnia contract adresi
      abi: [
        {
          name: 'createDAO',
          type: 'function',
          stateMutability: 'nonpayable',
          inputs: [
            { name: 'startTime', type: 'uint256' },
            { name: 'duration', type: 'uint256' }
          ],
          outputs: []
        }
      ],
      functionName: 'createDAO',
      args: [BigInt(startTime), BigInt(duration)]
    });
  };

  return (
    <div className="bg-gray-800 p-6 rounded-xl mb-8">
      <h3 className="text-xl font-semibold mb-4">Create New DAO</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Start Time (Unix Timestamp)</label>
          <input
            type="number"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            placeholder="1740000000"
            className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Duration (seconds)</label>
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            placeholder="86400" // 1 gün
            className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          onClick={handleCreateDAO}
          disabled={isPending}
          className={`w-full py-2 px-4 rounded-lg font-medium transition ${
            isPending
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {isPending ? 'Creating...' : 'Create DAO'}
        </button>
      </div>
    </div>
  );
}
