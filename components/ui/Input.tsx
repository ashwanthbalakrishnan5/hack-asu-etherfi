"use client";

import React, { useId } from "react";
import { motion, HTMLMotionProps } from "framer-motion";

export interface InputProps extends Omit<HTMLMotionProps<"input">, "label"> {
  label?: string;
  helperText?: string;
  error?: string;
  icon?: React.ReactNode;
}

export function Input({
  label,
  helperText,
  error,
  icon,
  className = "",
  id,
  ...props
}: InputProps) {
  const reactId = useId();
  const inputId = id || reactId;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-2 block text-sm font-semibold text-foreground">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground-muted">
            {icon}
          </div>
        )}
        <motion.input
          whileFocus={{ scale: 1.01 }}
          id={inputId}
          className={`w-full rounded-xl border-2 bg-surface/50 backdrop-blur-sm px-4 py-3 text-foreground transition-all duration-300 placeholder:text-foreground-muted/60 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/30 focus:shadow-lg focus:shadow-primary/20 disabled:cursor-not-allowed disabled:opacity-50 ${
            icon ? "pl-12" : ""
          } ${
            error ? "border-error focus:border-error focus:ring-error/30" : "border-surface-elevated/50"
          } ${className}`}
          {...props}
        />
      </div>
      {helperText && !error && (
        <p className="mt-2 text-xs text-foreground-muted">{helperText}</p>
      )}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 text-xs text-error font-medium"
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}
