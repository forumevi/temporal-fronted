'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useReadContracts, useWriteContract } from 'wagmi';
import Link from 'next/link';

const TEMPORAL_DAO_ADDRESS = '0x8e166334A7C23e20A0495ae4dF5a891C68b6D34E';
const ABI = [
  { name: 'daos', type: 'function', stateMutability: 'view', inputs: [{ type: 'uint256' }], outputs: [{ type: 'tuple', components: [
    { name: 'startTime', type: 'uint256' }, 
    { name: 'duration', type: 'uint256' }, 
    { name: 'finalized', type: 'bool' }
  ] }] },
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

export default function DAODetail() {
  const { id } = useParams();
  const [dao, setDao] = useState(null);
  const [loading, setLoading] = useState(true);
  const [finalizing, setFinalizing] = useState(false);
  const { writeContract } = useWriteContract();

  useEffect(() => {
    async function fetchDAO() {
      setLoading(true);
      const res = await fetch(`/api/dao?id=${id}`);
      const data = await res.json();
      setDao(data);
      setLoading(false);
    }
    fetchDAO();
  }, [id]);

  const handleFinalize = async () => {
    setFinalizing(true);
    try {
      await writeContract({
        address: TEMPORAL_DAO_ADDRESS,
        abi: ABI,
        functionName: 'finalizeDAO',
        args: [BigInt(id)],
      });
    } catch (e) {}
    setFinalizing(false);
  };

  if (loading) return <div>Loading DAO...</div>;
  if (!dao) return <div>DAO not found.</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-gray-900 rounded-xl p-8 shadow-lg border border-gray-700 text-white">
      <h2 className="text-3xl font-bold mb-4">DAO #{id}</h2>
      <div className="mb-2">Start: {new Date(Number(dao.startTime) * 1000).toLocaleString()}</div>
      <div className="mb-2">Duration: {Number(dao.duration) / 3600} hours</div>
      <div className="mb-2">Status: {dao.finalized ? 'Finalized' : 'Active'}</div>
      <div className="mb-2">
        Time left: <span className="font-mono text-yellow-300">{getRemainingTime(dao.startTime, dao.duration)}s</span>
      </div>
      {!dao.finalized && getRemainingTime(dao.startTime, dao.duration) === 0 && (
        <button
          onClick={handleFinalize}
          disabled={finalizing}
          className="mt-4 px-5 py-2 bg-red-700 hover:bg-red-800 rounded-full font-semibold transition shadow"
        >
          {finalizing ? 'Finalizing...' : 'Finalize'}
        </button>
      )}
      <div className="mt-6">
        <Link href="/" className="text-indigo-400 hover:underline">← Back to Home</Link>
      </div>
      <MemoryBook daoId={id} />
    </div>
  );
}

// Anı Defteri (Memory Book)
function MemoryBook({ daoId }) {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState('');
  useEffect(() => {
    // LocalStorage ile örnek, backend ile entegre edebilirsin
    setMessages(JSON.parse(localStorage.getItem(`dao-memories-${daoId}`) || '[]'));
  }, [daoId]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const newMessages = [...messages, msg];
    setMessages(newMessages);
    localStorage.setItem(`dao-memories-${daoId}`, JSON.stringify(newMessages));
    setMsg('');
  };
  return (
    <div className="mt-8">
      <h3 className="text-xl font-semibold mb-2">Memory Book</h3>
      <form onSubmit={handleSubmit} className="flex gap-2 mb-2">
        <input
          value={msg}
          onChange={e => setMsg(e.target.value)}
          className="flex-1 px-3 py-1 rounded bg-gray-800 border border-gray-700 text-white"
          placeholder="Leave a message..."
          maxLength={120}
        />
        <button type="submit" className="px-4 py-1 bg-purple-700 rounded">Send</button>
      </form>
      <ul className="space-y-1 text-left text-gray-300">
        {messages.map((m, i) => <li key={i} className="border-l-4 border-purple-700 pl-2">{m}</li>)}
      </ul>
    </div>
  );
}
