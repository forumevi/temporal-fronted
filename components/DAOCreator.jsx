import { useState } from 'react';
import { motion } from 'framer-motion';

export function DAOCreator() {
  const [creating, setCreating] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    setCreating(true);
    setTimeout(() => {
      setCreating(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 2000);
    }, 1200);
  };

  return (
    <motion.form
      onSubmit={handleCreate}
      className="bg-gray-900 rounded-xl p-6 mb-6 shadow-lg border border-gray-700 flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      <div className="mb-4 w-full">
        <input
          type="text"
          placeholder="DAO Name"
          className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-700"
          required
        />
      </div>
      <div className="mb-4 w-full">
        <input
          type="number"
          placeholder="Duration (seconds)"
          className="w-full px-4 py-2 rounded bg-gray-800 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-700"
          required
        />
      </div>
      <motion.button
        type="submit"
        className="px-6 py-2 bg-purple-700 hover:bg-purple-800 rounded-full font-semibold transition shadow"
        disabled={creating}
        whileTap={{ scale: 0.95 }}
      >
        {creating ? 'Creating...' : 'Create DAO'}
      </motion.button>
      {success && (
        <motion.div
          className="mt-4 text-green-400 font-bold"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          DAO Created! ✨
        </motion.div>
      )}
    </motion.form>
  );
}
