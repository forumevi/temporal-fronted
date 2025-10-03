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

// Simple starfield background
function Starfield() {
  return (
    <svg className="w-full h-full absolute inset-0" style={{ opacity: 0.25 }}>
      {[...Array(120)].map((_, i) => (
        <circle
          key={i}
          cx={Math.random() * 1920}
          cy={Math.random() * 1080}
          r={Math.random() * 1.2 + 0.2}
          fill="white"
          opacity={Math.random() * 0.7 + 0.2}
        />
      ))}
    </svg>
  );
}
