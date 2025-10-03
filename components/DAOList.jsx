'use client';

import { useReadContracts, useWriteContract } from 'wagmi';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const TEMPORAL_DAO_ADDRESS = '0x8e166334A7C23e20A0495ae4dF5a891C68b6D34E';
const ABI = [
  { name: 'daoCounter', type: 'function', stateMutability: 'view', inputs: [], outputs: [{ type: 'uint256' }] },
  { 
    name: 'daos', 
    type: 'function', 
    stateMutability: 'view', 
    inputs: [{ type: 'uint256' }], 
    outputs: [{ 
      type: 'tuple', 
      components: [
        { name: 'startTime', type: 'uint256' }, 
        { name: 'duration', type: 'uint256' }, 
        { name: 'finalized', type: 'bool' }
      ] 
    }] 
  },
  {
    name: 'finalizeDAO',
    type: 'function',
    stateMutability: 'nonpayable',
    inputs: [{ name: 'daoId', type: 'uint256' }],
    outputs: []
  }
];

function getRemainingTime(startTime, duration) {
  const now = Math.floor(Date.now() / 1000);
  const end = Number(startTime) + Number(duration);
  return Math.max(0, end - now);
}

export function DAOList() {
  const [daos, setDaos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [finalizing, setFinalizing] = useState({});
  const { writeContract } = useWriteContract();

  // Fetch DAO count and all DAOs
  const { data: counterData } = useReadContracts({
    contracts: [{ address: TEMPORAL_DAO_ADDRESS, abi: ABI, functionName: 'daoCounter' }]
  });

  useEffect(() => {
    async function fetchDaos() {
      setLoading(true);
      const count = counterData?.[0]?.result ? Number(counterData[0].result) : 0;
      if (count === 0) {
        setDaos([]);
        setLoading(false);
        return;
      }
      // Fetch all DAOs
      const daoPromises = [];
      for (let i = 0; i < count; i++) {
        daoPromises.push(fetchDAO(i));
      }
      const allDaos = await Promise.all(daoPromises);
      setDaos(allDaos.map((dao, idx) => ({ ...dao, id: idx })));
      setLoading(false);
    }

    async function fetchDAO(id) {
      // wagmi ile zincirden çekmek için optimize edebilirsin, şimdilik API ile örnek
      const res = await fetch(`/api/dao?id=${id}`);
      return res.json();
    }

    if (counterData) fetchDaos();
  }, [counterData]);

  // Live countdown
  useEffect(() => {
    if (!daos.length) return;
    const interval = setInterval(() => {
      setDaos((prev) =>
        prev.map((dao) => ({
          ...dao,
          remaining: getRemainingTime(dao.startTime, dao.duration),
        }))
      );
    }, 1000);
    return () => clearInterval(interval);
  }, [daos.length]);

  const handleFinalize = async (id) => {
    setFinalizing((prev) => ({ ...prev, [id]: true }));
    try {
      await writeContract({
        address: TEMPORAL_DAO_ADDRESS,
        abi: ABI,
        functionName: 'finalizeDAO',
        args: [BigInt(id)],
      });
      // Optionally, refetch DAOs here
    } catch (e) {
      // Handle error
    }
    setFinalizing((prev) => ({ ...prev, [id]: false }));
  };

  if (loading) return <div>Loading DAOs...</div>;
  if (!daos.length) return <div>No active DAOs yet.</div>;

  return (
    <div className="space-y-4">
      {daos
        .filter((dao) => !dao.finalized)
        .map((dao) => (
          <motion.div
            key={dao.id}
            className="bg-gradient-to-r from-indigo-800 via-purple-900 to-gray-900 rounded-xl p-6 flex flex-col md:flex-row md:items-center justify-between shadow-lg border border-indigo-700"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: dao.id * 0.05 }}
          >
            <div className="text-left">
              <div className="font-bold text-lg">DAO #{dao.id}</div>
              <div className="text-sm text-gray-300">Start: {new Date(Number(dao.startTime) * 1000).toLocaleString()}</div>
              <div className="text-sm text-gray-400">Duration: {Number(dao.duration) / 3600} hours</div>
              <div className="text-sm">
                Time left:{' '}
                <span className="font-mono text-yellow-300">
                  {getRemainingTime(dao.startTime, dao.duration) > 0
                    ? `${getRemainingTime(dao.startTime, dao.duration)}s`
                    : 'Expired'}
                </span>
              </div>
            </div>
            {getRemainingTime(dao.startTime, dao.duration) === 0 && !dao.finalized && (
              <motion.button
                onClick={() => handleFinalize(dao.id)}
                disabled={finalizing[dao.id]}
                className="mt-4 md:mt-0 px-5 py-2 bg-red-700 hover:bg-red-800 rounded-full font-semibold transition shadow"
                whileTap={{ scale: 0.95 }}
              >
                {finalizing[dao.id] ? 'Finalizing...' : 'Finalize'}
              </motion.button>
            )}
          </motion.div>
        ))}
    </div>
  );
}
