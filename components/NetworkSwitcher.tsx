import { useChainId, useSwitchChain } from 'wagmi';
import { baseSepolia, base } from 'wagmi/chains';
import { useEffect, useState } from 'react';

const SUPPORTED_CHAINS = {
  [baseSepolia.id]: baseSepolia,
  [base.id]: base,
};

export function NetworkSwitcher() {
  const chainId = useChainId();
  const { switchChain, isPending } = useSwitchChain();
  const [isWrongNetwork, setIsWrongNetwork] = useState(false);

  useEffect(() => {
    // Vérifie si on est sur un réseau supporté
    setIsWrongNetwork(!SUPPORTED_CHAINS[chainId]);
  }, [chainId]);

  if (!isWrongNetwork) {
    return (
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
        ✅ Connecté à {SUPPORTED_CHAINS[chainId].name}
      </div>
    );
  }

  return (
    <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
      <div className="flex flex-col gap-2">
        <p className="font-bold">⚠️ Réseau non supporté</p>
        <p className="text-sm">Veuillez vous connecter à Base Sepolia ou Base Mainnet</p>
        
        <div className="flex gap-2 mt-2">
          <button
            onClick={() => switchChain({ chainId: baseSepolia.id })}
            disabled={isPending}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isPending ? "Changement..." : "Base Sepolia"}
          </button>
          
          <button
            onClick={() => switchChain({ chainId: base.id })}
            disabled={isPending}
            className="bg-blue-700 hover:bg-blue-800 text-white px-4 py-2 rounded disabled:opacity-50"
          >
            {isPending ? "Changement..." : "Base Mainnet"}
          </button>
        </div>
      </div>
    </div>
  );
}
