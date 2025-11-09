"use client";

import React from "react";
import { motion } from "framer-motion";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "success" | "warning" | "error" | "primary" | "safe" | "gradient";
  size?: "sm" | "md" | "lg";
  glow?: boolean;
}

export function Badge({
  variant = "default",
  size = "md",
  glow = false,
  className = "",
  children,
  ...props
}: BadgeProps) {
  const baseStyles =
    "inline-flex items-center justify-center font-semibold rounded-full transition-all duration-300 backdrop-blur-sm";

  const variants = {
    default: "bg-surface-elevated/70 text-foreground border border-surface-elevated",
    success: "bg-success/15 text-success border border-success/40 shadow-sm shadow-success/20",
    warning: "bg-warning/15 text-warning border border-warning/40 shadow-sm shadow-warning/20",
    error: "bg-error/15 text-error border border-error/40 shadow-sm shadow-error/20",
    primary: "bg-primary/15 text-primary border border-primary/40 shadow-sm shadow-primary/20",
    safe: "bg-gradient-to-r from-success/20 to-success/30 text-success font-bold border-2 border-success shadow-md shadow-success/30",
    gradient: "bg-gradient-to-r from-primary via-secondary to-accent text-background border border-white/20 shadow-lg",
  };

  const glowStyles = glow ? {
    default: "",
    success: "shadow-[0_0_15px_rgba(34,197,94,0.4)]",
    warning: "shadow-[0_0_15px_rgba(245,158,11,0.4)]",
    error: "shadow-[0_0_15px_rgba(239,68,68,0.4)]",
    primary: "shadow-[0_0_15px_rgba(6,214,160,0.4)]",
    safe: "shadow-[0_0_20px_rgba(34,197,94,0.5)]",
    gradient: "shadow-[0_0_20px_rgba(168,85,247,0.5)]",
  } : {
    default: "",
    success: "",
    warning: "",
    error: "",
    primary: "",
    safe: "",
    gradient: "",
  };

  const sizes = {
    sm: "px-2.5 py-1 text-xs",
    md: "px-3.5 py-1.5 text-sm",
    lg: "px-5 py-2 text-base",
  };

  return (
    <motion.span
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${glowStyles[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.span>
  );
}
