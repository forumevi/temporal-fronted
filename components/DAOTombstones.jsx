'use client';

import { useReadContracts } from 'wagmi';
import { useEffect, useState } from 'react';

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
        daoPromises.push(
          fetchDAO(i)
        );
      }
      const allDaos = await Promise.all(daoPromises);
      setDaos(allDaos.map((dao, idx) => ({ ...dao, id: idx })));
      setLoading(false);
    }

    async function fetchDAO(id) {
      // Use wagmi or viem to call the contract
      // For now, we use wagmi's useReadContracts, but you can optimize this
      const res = await fetch(`/api/dao?id=${id}`); // You can implement this API route or use wagmi directly
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
          <div key={dao.id} className="bg-gray-900 rounded-lg p-4 text-gray-400 italic">
            <div className="font-bold">DAO #{dao.id}</div>
            <div>Start: {new Date(Number(dao.startTime) * 1000).toLocaleString()}</div>
            <div>Duration: {Number(dao.duration) / 3600} hours</div>
            <div>Finalized</div>
          </div>
        ))}
    </div>
  );
}
