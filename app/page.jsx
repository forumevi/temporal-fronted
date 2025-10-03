'use client';

import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import { ConnectButton } from '../components/ConnectButton';
import { DAOCreator } from '../components/DAOCreator';
import { DAOList } from '../components/DAOList';
import { DAOTombstones } from '../components/DAOTombstones';
import { Leaderboard } from '../components/Leaderboard';
import { motion } from 'framer-motion';

export default function Home() {
  const { address } = useAccount();
  const [showCreator, setShowCreator] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-gray-900 to-black text-white p-6 relative overflow-hidden">
      {/* Arka plan animasyonu */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* Buraya yıldızlı gece veya saat animasyonu eklenebilir */}
      </div>

      <header className="flex justify-between items-center mb-12 z-10 relative">
        <h1 className="text-4xl font-bold font-serif tracking-tight">Temporal DAO</h1>
        <ConnectButton />
      </header>

      <main className="max-w-3xl mx-auto text-center z-10 relative">
        <motion.h2
          className="text-5xl font-light mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Ephemeral Collectives. Timed DAOs. Eternal Impact.
        </motion.h2>
        <p className="text-gray-400 mb-10">
          Create, live, and archive DAOs that burn bright and vanish. Time is the ultimate curator.
        </p>

        <button
          onClick={() => setShowCreator(!showCreator)}
          className="mb-8 px-6 py-3 bg-purple-700 hover:bg-purple-800 rounded-full font-medium transition"
        >
          {showCreator ? 'Hide DAO Creator' : 'Create New DAO'}
        </button>

        {showCreator && <DAOCreator />}

        <section className="mb-12">
          <h3 className="text-2xl font-semibold mb-4">Active DAOs</h3>
          <DAOList onlyActive />
        </section>

        <section className="mb-12">
          <h3 className="text-2xl font-semibold mb-4">DAO Tombstones</h3>
          <DAOTombstones />
        </section>

        <section>
          <h3 className="text-2xl font-semibold mb-4">Leaderboard</h3>
          <Leaderboard />
        </section>
      </main>
    </div>
  );
}
