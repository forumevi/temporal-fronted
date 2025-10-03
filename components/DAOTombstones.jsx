'use client';

import { useReadContracts } from 'wagmi';
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
  }
];

export function DAOTombstones() {
  const [daos, setDaos] = useState([]);
  const [loading, setLoading] = useState(true);

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
      const res = await fetch(`/api/dao?id=${id}`);
      return res.json();
    }

    if (counterData) fetchDaos();
  }, [counterData]);

  if (loading) return <div>Loading finalized DAOs...</div>;
  if (!daos.length) return <div>No finalized DAOs yet.</div>;

  return (
    <div className="space-y-4">
      {daos
        .filter((dao) => dao.finalized)
        .map((dao) => (
          <motion.div
            key={dao.id}
            className="bg-gradient-to-r from-gray-800 via-gray-900 to-black rounded-xl p-6 text-gray-400 italic shadow border border-gray-700"
            initial={{ opacity: 0.5, y: 20 }}
            animate={{ opacity: 0.7, y: 0 }}
            transition={{ delay: dao.id * 0.05 }}
          >
            <div className="font-bold text-lg">DAO #{dao.id}</div>
            <div className="text-sm">Start: {new Date(Number(dao.startTime) * 1000).toLocaleString()}</div>
            <div className="text-sm">Duration: {Number(dao.duration) / 3600} hours</div>
            <div className="text-sm">Finalized</div>
          </motion.div>
        ))}
    </div>
  );
}
