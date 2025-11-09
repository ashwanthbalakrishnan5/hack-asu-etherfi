"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { WalletButton } from "@/components/wallet/WalletButton";
import { Button } from "@/components/ui";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/play", label: "Play" },
  { href: "/profile", label: "Profile" },
  { href: "/leaderboard", label: "Leaderboard" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-surface bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary">
            <span className="text-lg font-bold text-background">Ξ</span>
          </div>
          <span className="hidden font-semibold text-foreground sm:inline-block">
            EtherFi Predictions
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-6 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-foreground relative ${
                  isActive
                    ? "text-primary"
                    : "text-foreground/80"
                }`}
              >
                {link.label}
                {isActive && (
                  <span className="absolute -bottom-[17px] left-0 right-0 h-0.5 bg-primary" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Wallet Button */}
        <div className="hidden md:block">
          <WalletButton />
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="subtle"
          size="sm"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="border-t border-surface bg-background md:hidden">
          <nav className="container mx-auto flex flex-col gap-4 px-4 py-4">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors hover:text-foreground ${
                    isActive ? "text-primary" : "text-foreground/80"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-2">
              <WalletButton />
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
