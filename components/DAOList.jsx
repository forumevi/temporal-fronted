// components/DAOList.jsx
'use client';

import { useReadContracts } from 'wagmi';
import { useEffect, useState } from 'react';
import { useAccount } from 'wagmi';

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

export function DAOList({ onlyActive = false, onlyMine = false }) {
  const [daos, setDaos] = useState([]);
  const [loading, setLoading] = useState(true);
  const { address } = useAccount();

  const { data: counterData } = useReadContracts({
    contracts: [{ address: TEMPORAL_DAO_ADDRESS, abi: ABI, functionName: 'daoCounter' }]
  });

  useEffect(() => {
    if (!counterData?.[0]?.result) {
      setLoading(false);
      return;
    }

    const count = Number(counterData[0].result);
    const fetchAllDaos = async () => {
      const fetchedDaos = [];
      for (let i = 0n; i < counterData[0].result; i++) {
        const { data } = await useReadContracts({
          contracts: [{ address: TEMPORAL_DAO_ADDRESS, abi: ABI, functionName: 'daos', args: [i] }]
        });
        if (data?.[0]?.result) {
          fetchedDaos.push({ id: i, ...data[0].result });
        }
      }
      setDaos(fetchedDaos);
      setLoading(false);
    };

    fetchAllDaos();
  }, [counterData]);

  if (loading) return <div className="text-gray-400">Loading DAOs...</div>;
  if (daos.length === 0) return <div className="text-gray-500 italic">No DAOs found.</div>;

  return (
    <div className="space-y-4">
      {daos
        .filter(dao => !onlyActive || !dao.finalized)
        .filter(dao => !onlyMine || (dao.owner && dao.owner.toLowerCase() === address?.toLowerCase()))
        .map(dao => (
          <div key={dao.id.toString()} className="bg-gray-800 p-4 rounded-lg">
            <div className="font-bold">DAO #{dao.id.toString()}</div>
            <div className="text-sm text-gray-400">
              Start: {new Date(Number(dao.startTime) * 1000).toLocaleString()}
            </div>
            <div className="text-sm text-gray-400">
              Duration: {Math.floor(Number(dao.duration) / 3600)} hours
            </div>
            <div className="text-sm">
              Status: {dao.finalized ? 'Finalized' : 'Active'}
            </div>
          </div>
        ))}
    </div>
  );
}
