import { useEffect, useState } from 'react';

export function Leaderboard() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    // API veya zincirden çek
    setStats({
      mostActive: '0x123...abcd',
      fastest: { id: 7, time: 133 },
      longest: { id: 2, time: 172800 }
    });
  }, []);
  if (!stats) return <div>Loading leaderboard...</div>;
  return (
    <div className="bg-gradient-to-r from-purple-800 via-indigo-900 to-gray-900 rounded-xl p-6 text-gray-200 shadow border border-purple-700">
      <div className="font-bold text-lg mb-2">Leaderboard</div>
      <ul className="space-y-1 text-left">
        <li>🏆 Most Active User: <span className="font-mono">{stats.mostActive}</span></li>
        <li>⏱️ Fastest Finalized DAO: <span className="font-mono">DAO #{stats.fastest.id} ({stats.fastest.time}s)</span></li>
        <li>⏳ Longest Living DAO: <span className="font-mono">DAO #{stats.longest.id} ({Math.round(stats.longest.time/3600)}h)</span></li>
      </ul>
    </div>
  );
}
