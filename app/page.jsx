'use client';

import { ConnectButton } from '../components/ConnectButton';
import { DAOCreator } from '../components/DAOCreator';
import { useState, useEffect } from 'react';
import { useReadContracts } from 'wagmi';
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

export default function Home() {
  const [daoCount, setDaoCount] = useState(0n);
  const { data: counterData } = useReadContracts({
    contracts: [{ address: TEMPORAL_DAO_ADDRESS, abi: ABI, functionName: 'daoCounter' }]
  });

  useEffect(() => {
    if (counterData?.[0]?.result) {
      setDaoCount(BigInt(counterData[0].result));
    }
  }, [counterData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-6">
      <header className="flex justify-between items-center mb-12">
        <h1 className="text-3xl font-serif">Temporal DAO</h1>
        <ConnectButton />
      </header>

      <main className="max-w-2xl mx-auto text-center">
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-5xl font-light mb-6"
        >
          Ephemeral Collectives
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-gray-400 mb-10"
        >
          Create a self-destructing DAO. Live intensely. Vanish gracefully.
        </motion.p>

        <DAOCreator />

        <div className="mt-12 text-sm text-gray-500">
          {daoCount.toString()} collectives born so far.
        </div>
      </main>
    </div>
  );
}
