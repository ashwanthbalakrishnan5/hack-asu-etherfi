"use client";

import React from "react";
import { motion } from "framer-motion";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "subtle" | "gradient";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
  withGlow?: boolean;
}

export function Button({
  variant = "primary",
  size = "md",
  loading = false,
  withGlow = false,
  className = "",
  children,
  disabled,
  ...props
}: ButtonProps) {
  const baseStyles =
    "relative inline-flex items-center justify-center font-semibold transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 focus:ring-offset-background disabled:opacity-40 disabled:cursor-not-allowed overflow-hidden group";

  const variants = {
    primary:
      "bg-gradient-to-r from-primary to-primary-bright text-background shadow-lg hover:shadow-xl hover:from-primary-bright hover:to-primary active:scale-95 border border-primary/20",
    secondary:
      "border-2 border-primary/60 text-primary bg-primary/5 hover:bg-primary/15 hover:border-primary active:scale-95 backdrop-blur-sm",
    subtle:
      "text-foreground bg-surface/50 hover:bg-surface-elevated active:bg-surface/80 active:scale-95 backdrop-blur-sm border border-surface-elevated/50",
    gradient:
      "bg-gradient-to-r from-primary via-secondary to-accent text-background shadow-lg hover:shadow-2xl active:scale-95 border border-white/20 animate-gradient",
  };

  const glowStyles = withGlow ? {
    primary: "shadow-[0_0_20px_rgba(6,214,160,0.5)] hover:shadow-[0_0_30px_rgba(6,214,160,0.7)]",
    secondary: "shadow-[0_0_15px_rgba(6,214,160,0.3)] hover:shadow-[0_0_25px_rgba(6,214,160,0.5)]",
    subtle: "",
    gradient: "shadow-[0_0_30px_rgba(168,85,247,0.5)] hover:shadow-[0_0_40px_rgba(168,85,247,0.7)]",
  } : {
    primary: "",
    secondary: "",
    subtle: "",
    gradient: "",
  };

  const sizes = {
    sm: "px-4 py-2 text-sm rounded-lg",
    md: "px-6 py-2.5 text-base",
    lg: "px-8 py-3.5 text-lg rounded-2xl",
  };

  return (
    <motion.button
      whileHover={{ scale: disabled || loading ? 1 : 1.02 }}
      whileTap={{ scale: disabled || loading ? 1 : 0.98 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${glowStyles[variant]} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {/* Shine effect on hover */}
      <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
        <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700" />
      </span>

      {/* Content */}
      <span className="relative z-10 flex items-center gap-2">
        {loading ? (
          <>
            <svg
              className="h-4 w-4 animate-spin"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            {children}
          </>
        ) : (
          children
        )}
      </span>
    </motion.button>
  );
}
