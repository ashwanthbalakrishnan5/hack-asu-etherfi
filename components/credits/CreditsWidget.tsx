'use client';

import { useState, useEffect } from 'react';
import { Zap, Plus } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAccount } from 'wagmi';
import { CreditsStore } from './CreditsStore';

export function CreditsWidget() {
  const { address, isConnected } = useAccount();
  const [balance, setBalance] = useState(0);
  const [showStore, setShowStore] = useState(false);

  useEffect(() => {
    if (address) {
      fetchBalance();
      const interval = setInterval(fetchBalance, 30000);
      return () => clearInterval(interval);
    }
  }, [address]);

  const fetchBalance = async () => {
    try {
      const response = await fetch(`/api/yc/balance?address=${address}`);
      if (response.ok) {
        const data = await response.json();
        setBalance(data.balance || 0);
      }
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  if (!isConnected) return null;

  return (
    <>
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="flex items-center gap-2"
      >
        {/* Credits Balance */}
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 border border-primary/30">
          <Zap className="w-4 h-4 text-primary" />
          <span className="text-sm font-bold text-primary">
            {balance.toLocaleString()}
          </span>
        </div>

        {/* Buy Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowStore(true)}
          className="p-1.5 rounded-lg bg-primary hover:bg-primary-bright transition-colors"
        >
          <Plus className="w-4 h-4 text-background" />
        </motion.button>
      </motion.div>

      {/* Store Modal */}
      <CreditsStore
        isOpen={showStore}
        onClose={() => {
          setShowStore(false);
          fetchBalance();
        }}
        currentBalance={balance}
      />
    </>
  );
}
