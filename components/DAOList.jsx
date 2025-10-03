// DAOList.jsx
import { useAccount } from 'wagmi';
// ...diğer kodlar
export function DAOList({ onlyActive, onlyMine }) {
  const { address } = useAccount();
  // ...fetch logic
  // DAOnun owner'ı varsa, örn: { owner: '0x...' } şeklinde
  return (
    <div>
      {daos
        .filter(dao => (onlyActive ? !dao.finalized : true))
        .filter(dao => (onlyMine ? dao.owner?.toLowerCase() === address?.toLowerCase() : true))
        .map(dao => /* ... */)
      }
    </div>
  );
}
