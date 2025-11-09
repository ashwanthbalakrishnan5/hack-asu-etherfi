"use client";

import Link from "next/link";
import { ArrowRight, Shield, TrendingUp, Trophy, Sparkles, Zap, Target, Brain } from "lucide-react";
import { Button, Card } from "@/components/ui";
import { useAccount } from "wagmi";
import { WalletButton } from "@/components/wallet/WalletButton";
import { motion } from "framer-motion";

export default function Home() {
  const { isConnected } = useAccount();

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full px-6 py-20 md:py-32 mx-auto overflow-hidden" style={{ maxWidth: '1800px' }}>
        {/* Animated Background Elements */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: '1s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="flex flex-col items-center text-center relative z-10">
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 backdrop-blur-sm"
          >
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">No-Loss Prediction Markets</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 max-w-4xl text-5xl font-bold tracking-tight text-foreground md:text-7xl"
          >
            Welcome to{" "}
            <span className="bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent animate-gradient">
              Yield Quest
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mb-10 max-w-2xl text-lg text-foreground/80 md:text-xl leading-relaxed"
          >
            Predict events, earn rewards, and never risk your principal. 
            Your staked ETH generates yield credits for predictions while staying 100% safe.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col gap-4 sm:flex-row"
          >
            {isConnected ? (
              <Link href="/play">
                <Button size="lg" withGlow className="gap-2">
                  Start Playing
                  <ArrowRight size={18} />
                </Button>
              </Link>
            ) : (
              <WalletButton />
            )}
            <Link href="/leaderboard">
              <Button variant="default" size="lg" className="gap-2">
                <Trophy size={18} />
                View Leaderboard
              </Button>
            </Link>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {[
              { label: "Total Secured", value: "100% Safe", icon: Shield },
              { label: "APR Range", value: "3-5%", icon: TrendingUp },
              { label: "Active Players", value: "Growing", icon: Target },
              { label: "AI Powered", value: "Claude", icon: Brain },
            ].map((stat, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 border border-primary/30">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <div className="text-2xl font-bold text-foreground">{stat.value}</div>
                <div className="text-sm text-foreground-muted">{stat.label}</div>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="w-full border-y border-surface bg-surface/30 py-20">
        <div className="w-full px-6 mx-auto" style={{ maxWidth: '1800px' }}>
          <div className="text-center mb-16">
            <h2 className="mb-4 text-4xl font-bold text-foreground">
              How It Works
            </h2>
            <p className="text-lg text-foreground-muted max-w-2xl mx-auto">
              Start earning with your yield in four simple steps
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                step: "1",
                title: "Deposit weETH",
                description: "Stake your weETH as principal. It's always safe and withdrawable anytime.",
                icon: Shield,
                color: "from-primary to-primary-bright",
              },
              {
                step: "2",
                title: "Earn Yield Credits",
                description: "Your principal automatically generates Yield Credits (YC) over time.",
                icon: TrendingUp,
                color: "from-secondary to-secondary-bright",
              },
              {
                step: "3",
                title: "Make Predictions",
                description: "Use YC to predict events. Win to earn more YC, lose only YC—never principal.",
                icon: Target,
                color: "from-accent to-accent-bright",
              },
              {
                step: "4",
                title: "Withdraw Anytime",
                description: "Your principal is always yours. Withdraw whenever you want, hassle-free.",
                icon: Trophy,
                color: "from-success to-success/80",
              },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                <Card hover className="relative overflow-hidden h-full">
                  <div className="absolute right-0 top-0 flex h-12 w-12 items-center justify-center rounded-bl-2xl bg-gradient-to-br from-primary/20 to-secondary/20 text-xl font-bold text-primary">
                    {item.step}
                  </div>
                  <div className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br ${item.color} shadow-lg`}>
                    <item.icon className="text-background" size={28} />
                  </div>
                  <h3 className="mb-3 text-xl font-bold text-foreground">{item.title}</h3>
                  <p className="text-sm text-foreground/70 leading-relaxed">{item.description}</p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="w-full px-6 py-20 mx-auto" style={{ maxWidth: '1800px' }}>
        <div className="grid gap-8 lg:grid-cols-2">
          {/* EtherFi Feature */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card gradient glow hover className="h-full">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary to-primary-bright shadow-lg shadow-primary/30 flex-shrink-0">
                  <span className="text-2xl font-bold text-background">Ξ</span>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Powered by EtherFi weETH
                  </h3>
                  <p className="text-foreground/70 leading-relaxed">
                    Your weETH principal is never at risk. Only the yield it generates is used
                    for predictions, creating a true no-loss experience. Withdraw your principal 
                    anytime with zero restrictions.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {["100% Safe Principal", "Liquid Staking", "Anytime Withdrawal"].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-primary/10 border border-primary/30 px-3 py-1 text-xs font-medium text-primary"
                  >
                    <Zap size={12} />
                    {tag}
                  </span>
                ))}
              </div>
            </Card>
          </motion.div>

          {/* Claude Feature */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
          >
            <Card gradient glow hover className="h-full border-accent/20">
              <div className="flex items-start gap-4 mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-accent to-accent-bright shadow-lg shadow-accent/30 flex-shrink-0">
                  <Brain className="text-background" size={28} />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2">
                    Claude as Game Master
                  </h3>
                  <p className="text-foreground/70 leading-relaxed">
                    Get personalized quests, probability hints, and post-game feedback that
                    adapts to your skill level. Claude helps you improve your prediction skills
                    with tailored challenges and insights.
                  </p>
                </div>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {["Adaptive Difficulty", "Personal Insights", "Smart Hints"].map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 rounded-full bg-accent/10 border border-accent/30 px-3 py-1 text-xs font-medium text-accent"
                  >
                    <Sparkles size={12} />
                    {tag}
                  </span>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <Card gradient glow className="inline-block">
            <h3 className="text-2xl font-bold text-foreground mb-4">
              Ready to Start Your Quest?
            </h3>
            <p className="text-foreground-muted mb-6 max-w-xl">
              Join now and start making predictions with yield credits. Your principal stays safe, 
              and you get to compete, learn, and earn.
            </p>
            {isConnected ? (
              <Link href="/play">
                <Button size="lg" withGlow className="gap-2">
                  Enter Play
                  <ArrowRight size={20} />
                </Button>
              </Link>
            ) : (
              <WalletButton />
            )}
          </Card>
        </motion.div>
      </section>
    </div>
  );
}
