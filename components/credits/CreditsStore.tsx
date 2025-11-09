'use client';

import { useState } from 'react';
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

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="w-full max-w-2xl pointer-events-auto">
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
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                  {CREDIT_PACKAGES.map((pkg) => (
                    <motion.div
                      key={pkg.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className={`relative p-4 rounded-xl border-2 transition-all cursor-pointer ${
                        pkg.popular
                          ? 'border-primary bg-gradient-to-br from-primary/10 to-primary/5'
                          : 'border-gray-700 bg-gray-800/50 hover:border-gray-600'
                      }`}
                    >
                      {pkg.badge && (
                        <div className="absolute -top-3 -right-3 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500 to-red-500 text-xs font-bold text-white shadow-lg">
                          {pkg.badge}
                        </div>
                      )}

                      <div className="space-y-3">
                        <div className="flex items-baseline gap-2">
                          <div className="text-3xl font-bold text-primary">
                            {pkg.amount.toLocaleString()}
                          </div>
                          <div className="text-sm text-foreground/60">Credits</div>
                        </div>

                        {pkg.bonus > 0 && (
                          <div className="flex items-center gap-2 px-3 py-1 rounded-lg bg-green-400/10 border border-green-400/20 w-fit">
                            <Gift className="w-4 h-4 text-green-400" />
                            <span className="text-sm font-semibold text-green-400">
                              +{pkg.bonus} Bonus
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between pt-2">
                          <div className="text-2xl font-bold text-foreground">
                            ${pkg.price}
                          </div>
                          <Button
                            onClick={() => handlePurchase(pkg)}
                            disabled={isPurchasing && selectedPackage === pkg.id}
                            variant={pkg.popular ? 'primary' : 'secondary'}
                            size="sm"
                          >
                            {isPurchasing && selectedPackage === pkg.id ? (
                              'Processing...'
                            ) : (
                              'Buy Now'
                            )}
                          </Button>
                        </div>

                        {pkg.bonus > 0 && (
                          <div className="text-xs text-foreground/50 pt-1">
                            Total: {(pkg.amount + pkg.bonus).toLocaleString()} YC
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Free Credits Info */}
                <div className="p-4 rounded-lg bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-purple-400/20">
                  <div className="flex items-start gap-3">
                    <Sparkles className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                    <div className="space-y-2">
                      <div className="font-semibold text-foreground">Earn Free Credits</div>
                      <div className="text-sm text-foreground/70 space-y-1">
                        <div>• Daily Login: Up to 500 YC/day</div>
                        <div>• Top 10 Leaderboard: 1000 YC weekly</div>
                        <div>• 5-Win Streak: 200 YC bonus</div>
                        <div>• Deposit weETH: Earn 5% APR yield</div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
