// components/DAOCreator.tsx
'use client';

import { useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { useState } from 'react';
import { motion } from 'framer-motion';

export function DAOCreator() {
  const { writeContract, data: hash, isPending, error: writeError } = useWriteContract();
  const { isLoading: isConfirming, isSuccess } = useWaitForTransactionReceipt({ hash });
  const [startTime, setStartTime] = useState<string>('');
  const [duration, setDuration] = useState<string>('');
  const [error, setError] = useState<string | null>(null);

  const handleCreateDAO = () => {
    setError(null);
    if (!startTime || !duration) {
      setError('Both fields are required.');
      return;
    }

    writeContract({
      address: '0x8e166334A7C23e20A0495ae4dF5a891C68b6D34E',
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800 p-6 rounded-xl mb-8"
    >
      <h3 className="text-xl font-semibold mb-4">Create New DAO</h3>

      {isSuccess && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 p-3 bg-green-900 text-green-300 rounded text-sm"
        >
          ✅ DAO created successfully!{' '}
          <a
            href={`https://explorer.somnia.network/tx/${hash}`}
            target="_blank"
            rel="noopener noreferrer"
            className="underline"
          >
            View on Explorer
          </a>
        </motion.div>
      )}

      {(writeError || error) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-4 p-3 bg-red-900 text-red-300 rounded text-sm"
        >
          ❌ {writeError?.message || error}
        </motion.div>
      )}

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
            placeholder="86400"
            className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>

        <button
          onClick={handleCreateDAO}
          disabled={isPending || isConfirming}
          className={`w-full py-2 px-4 rounded-lg font-medium transition ${
            isPending || isConfirming
              ? 'bg-gray-600 cursor-not-allowed'
              : 'bg-purple-600 hover:bg-purple-700'
          }`}
        >
          {isConfirming ? 'Confirming...' : isPending ? 'Creating...' : 'Create DAO'}
        </button>
      </div>
    </motion.div>
  );
}
