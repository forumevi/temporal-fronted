'use client';

import { useAccount } from 'wagmi';
import { useState } from 'react';
import { ConnectButton } from '../components/ConnectButton';
import { DAOCreator } from '../components/DAOCreator';
import { DAOList } from '../components/DAOList';
import { DAOTombstones } from '../components/DAOTombstones';
import { Leaderboard } from '../components/Leaderboard';
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  const { address } = useAccount();
  const [showCreator, setShowCreator] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-gray-900 to-black text-white p-6 relative overflow-hidden">
      {/* Starry animated background */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <Starfield />
      </div>
<div className="bg-red-500 text-white p-4">Tailwind çalışıyor mu?</div>
      <header className="flex justify-between items-center mb-12 z-10 relative">
        <h1 className="text-4xl md:text-5xl font-bold font-serif tracking-tight drop-shadow-lg">Temporal DAO</h1>
        <ConnectButton />
      </header>

      <main className="max-w-3xl mx-auto text-center z-10 relative">
        <motion.h2
          className="text-4xl md:text-5xl font-light mb-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          Ephemeral Collectives. Timed DAOs. Eternal Impact.
        </motion.h2>
        <p className="text-gray-400 mb-10">
          Create, live, and archive DAOs that burn bright and vanish. Time is the ultimate curator.
        </p>

        <motion.button
          onClick={() => setShowCreator(!showCreator)}
          className="mb-8 px-6 py-3 bg-purple-700 hover:bg-purple-800 rounded-full font-medium transition shadow-lg"
          whileTap={{ scale: 0.95 }}
        >
          {showCreator ? 'Hide DAO Creator' : 'Create New DAO'}
        </motion.button>

        <AnimatePresence>
          {showCreator && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-10"
            >
              <DAOCreator />
            </motion.div>
          )}
        </AnimatePresence>

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

// Simple starfield background (CSS-based)
function Starfield() {
  return (
    <div className="absolute inset-0 opacity-20">
      {[...Array(100)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-white"
          style={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
            width: `${Math.random() * 2 + 1}px`,
            height: `${Math.random() * 2 + 1}px`,
            opacity: Math.random(),
          }}
        />
      ))}
    </div>
  );
}
