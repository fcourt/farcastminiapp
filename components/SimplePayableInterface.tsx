import { useState } from 'react';
import { useAccount, useReadContract, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther, formatEther } from 'viem';
//import { NetworkSwitcher } from './NetworkSwitcher';

// Remplace par l'adresse de ton contrat déployé sur Base
const CONTRACT_ADDRESS = '0xaE2Ad77Ba2f08AdBf2591b5d06500fafbD42300B' as const;

// ABI de ton contrat SimplePayable
const SIMPLE_PAYABLE_ABI = [
  {
    inputs: [{ name: '_message', type: 'string' }],
    name: 'pay',
    outputs: [],
    stateMutability: 'payable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'withdraw',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [{ name: '_account', type: 'address' }],
    name: 'getPendingWithdrawal',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'getContractBalance',
    outputs: [{ name: '', type: 'uint256' }],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [{ name: '', type: 'address' }],
    stateMutability: 'view',
    type: 'function',
  },
] as const;

export function SimplePayableInterface() {
  const { address } = useAccount();
  const [message, setMessage] = useState('');
  const [amount, setAmount] = useState('0.001');

  // Lecture du solde du contrat
  const { data: contractBalance } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SIMPLE_PAYABLE_ABI,
    functionName: 'getContractBalance',
  });

  // Lecture du solde disponible pour l'utilisateur
  const { data: pendingWithdrawal } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SIMPLE_PAYABLE_ABI,
    functionName: 'getPendingWithdrawal',
    args: address ? [address] : undefined,
  });

  // Lecture de l'owner
  const { data: owner } = useReadContract({
    address: CONTRACT_ADDRESS,
    abi: SIMPLE_PAYABLE_ABI,
    functionName: 'owner',
  });

  // Écriture : envoyer un paiement
  const { writeContract: pay, data: payHash, isPending: isPayPending } = useWriteContract();
  
  // Écriture : retirer des fonds
  const { writeContract: withdraw, data: withdrawHash, isPending: isWithdrawPending } = useWriteContract();

  // Attendre la confirmation de la transaction
  const { isLoading: isPayConfirming } = useWaitForTransactionReceipt({ hash: payHash });
  const { isLoading: isWithdrawConfirming } = useWaitForTransactionReceipt({ hash: withdrawHash });

  const handlePay = () => {
    if (!message || !amount) return;
    
    pay({
      address: CONTRACT_ADDRESS,
      abi: SIMPLE_PAYABLE_ABI,
      functionName: 'pay',
      args: [message],
      value: parseEther(amount),
    });
  };

  const handleWithdraw = () => {
    withdraw({
      address: CONTRACT_ADDRESS,
      abi: SIMPLE_PAYABLE_ABI,
      functionName: 'withdraw',
    });
  };

  const isOwner = address && owner && address.toLowerCase() === owner.toLowerCase();

  return (
    <div className="max-w-2xl mx-auto p-6 space-y-6">
      {/* Vérification du réseau */}
      <NetworkSwitcher />

      {/* Informations du contrat */}
      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <h2 className="text-2xl font-bold">💰 SimplePayable Contract</h2>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-600">Solde du contrat</p>
            <p className="text-xl font-bold">
              {contractBalance ? formatEther(contractBalance) : '0'} ETH
            </p>
          </div>
          
          <div>
            <p className="text-gray-600">Ton solde disponible</p>
            <p className="text-xl font-bold text-green-600">
              {pendingWithdrawal ? formatEther(pendingWithdrawal) : '0'} ETH
            </p>
          </div>
        </div>

        {isOwner && (
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <p className="text-sm text-blue-800">👑 Tu es le propriétaire du contrat</p>
          </div>
        )}
      </div>

      {/* Envoyer un paiement */}
      <div className="bg-white shadow rounded-lg p-6 space-y-4">
        <h3 className="text-xl font-semibold">📤 Envoyer un paiement</h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Message
          </label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ton message..."
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Montant (ETH)
          </label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            step="0.001"
            min="0.001"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <button
          onClick={handlePay}
          disabled={!message || !amount || isPayPending || isPayConfirming}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isPayPending || isPayConfirming ? 'Transaction en cours...' : 'Envoyer 💸'}
        </button>

        {payHash && (
          <p className="text-sm text-green-600">
            ✅ Transaction envoyée ! 
            <a 
              href={`https://sepolia.basescan.org/tx/${payHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline ml-1"
            >
              Voir sur Basescan
            </a>
          </p>
        )}
      </div>

      {/* Retirer des fonds */}
      {pendingWithdrawal && pendingWithdrawal > 0n && (
        <div className="bg-white shadow rounded-lg p-6 space-y-4">
          <h3 className="text-xl font-semibold">💵 Retirer tes fonds</h3>
          
          <p className="text-gray-600">
            Tu as <span className="font-bold text-green-600">
              {formatEther(pendingWithdrawal)} ETH
            </span> disponible au retrait
          </p>

          <button
            onClick={handleWithdraw}
            disabled={isWithdrawPending || isWithdrawConfirming}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isWithdrawPending || isWithdrawConfirming ? 'Retrait en cours...' : 'Retirer 🏦'}
          </button>

          {withdrawHash && (
            <p className="text-sm text-green-600">
              ✅ Retrait effectué ! 
              <a 
                href={`https://sepolia.basescan.org/tx/${withdrawHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="underline ml-1"
              >
                Voir sur Basescan
              </a>
            </p>
          )}
        </div>
      )}
    </div>
  );
}
