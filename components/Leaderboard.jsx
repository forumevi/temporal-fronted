import { motion } from 'framer-motion';

export function Leaderboard() {
  // Placeholder, can be made dynamic later
  return (
    <motion.div
      className="bg-gradient-to-r from-purple-800 via-indigo-900 to-gray-900 rounded-xl p-6 text-gray-200 shadow border border-purple-700"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="font-bold text-lg mb-2">Leaderboard</div>
      <ul className="space-y-1 text-left">
        <li>🏆 Most Active User: <span className="font-mono">0x123...abcd</span></li>
        <li>⏱️ Fastest Finalized DAO: <span className="font-mono">DAO #7 (2m 13s)</span></li>
        <li>⏳ Longest Living DAO: <span className="font-mono">DAO #2 (48h)</span></li>
      </ul>
      <div className="mt-2 text-xs text-gray-400">* This is a static example. Will be dynamic soon.</div>
    </motion.div>
  );
}
