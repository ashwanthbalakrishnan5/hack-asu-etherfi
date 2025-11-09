'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Card, Button } from '@/components/ui';
import { X, Zap, Gift, Star, Sparkles, TrendingUp, Crown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAccount } from 'wagmi';
import { toast } from '@/lib/stores/toast';

interface CreditPackage {
  id: string;
  amount: number;
  bonus: number;
  price: number; // in USD or ETH equivalent
  popular?: boolean;
  badge?: string;
}

const CREDIT_PACKAGES: CreditPackage[] = [
  { id: 'starter', amount: 500, bonus: 0, price: 5 },
  { id: 'basic', amount: 1000, bonus: 100, price: 10, popular: true },
  { id: 'pro', amount: 2500, bonus: 500, price: 25, badge: '🔥 HOT' },
  { id: 'whale', amount: 5000, bonus: 1500, price: 50, badge: '🐋 BEST VALUE' },
];

interface CreditsStoreProps {
  isOpen: boolean;
  onClose: () => void;
  currentBalance: number;
}

export function CreditsStore({ isOpen, onClose, currentBalance }: CreditsStoreProps) {
  const { address } = useAccount();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const handlePurchase = async (pkg: CreditPackage) => {
    if (!address) {
      toast.error('Please connect your wallet');
      return;
    }

    setIsPurchasing(true);
    setSelectedPackage(pkg.id);

    try {
      // TODO: Implement actual payment logic (crypto payment)
      const response = await fetch('/api/credits/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address,
          packageId: pkg.id,
          amount: pkg.amount + pkg.bonus,
        }),
      });

      if (response.ok) {
        toast.success(
          `🎉 ${pkg.amount + pkg.bonus} Credits added to your account!`
        );
        onClose();
      } else {
        toast.error('Purchase failed. Please try again.');
      }
    } catch (error) {
      console.error('Purchase error:', error);
      toast.error('Purchase failed. Please try again.');
    } finally {
      setIsPurchasing(false);
      setSelectedPackage(null);
    }
  };

  if (!mounted) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[9998]"
          />

          {/* Modal Container */}
          <div className="fixed inset-0 z-[9999] overflow-y-auto flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-4xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Card className="bg-gradient-to-br from-gray-900 to-gray-800 border-primary/30">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/20">
                      <Zap className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-foreground">Credits Store</h2>
                      <p className="text-sm text-foreground/60">
                        Current Balance: <span className="text-primary font-bold">{currentBalance} YC</span>
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={onClose}
                    className="p-2 rounded-lg hover:bg-gray-700/50 transition-colors"
                  >
                    <X className="w-5 h-5 text-foreground/70" />
                  </button>
                </div>

                {/* Packages */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {CREDIT_PACKAGES.map((pkg) => (
                    <motion.div
                      key={pkg.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative p-3 rounded-xl border-2 transition-all cursor-pointer ${
                        pkg.popular
                          ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5'
                          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                      }`}
                    >
                      {pkg.badge && (
                        <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-[10px] font-bold text-white shadow-lg whitespace-nowrap">
                          {pkg.badge}
                        </div>
                      )}

                      <div className="space-y-2">
                        <div className="flex items-baseline gap-1 flex-wrap">
                          <div className="text-2xl font-bold text-primary">
                            {pkg.amount.toLocaleString()}
                          </div>
                          <div className="text-xs text-foreground/60">Credits</div>
                        </div>

                        {pkg.bonus > 0 && (
                          <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-green-400/10 border border-green-400/20 w-fit">
                            <Gift className="w-3 h-3 text-green-400 flex-shrink-0" />
                            <span className="text-xs font-semibold text-green-400 whitespace-nowrap">
                              +{pkg.bonus} Bonus
                            </span>
                          </div>
                        )}

                        <div className="text-xl font-bold text-foreground">
                          ${pkg.price}
                        </div>

                        <Button
                          onClick={() => handlePurchase(pkg)}
                          disabled={isPurchasing && selectedPackage === pkg.id}
                          variant={pkg.popular ? 'primary' : 'secondary'}
                          size="sm"
                          className="w-full"
                        >
                          {isPurchasing && selectedPackage === pkg.id ? (
                            'Processing...'
                          ) : (
                            'Buy Now'
                          )}
                        </Button>

                        {pkg.bonus > 0 && (
                          <div className="text-[10px] text-foreground/50 text-center">
                            Total: {(pkg.amount + pkg.bonus).toLocaleString()} YC
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </Card>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}
