"use client";

import React from "react";
import { motion, HTMLMotionProps } from "framer-motion";

export interface CardProps extends Omit<HTMLMotionProps<"div">, "children"> {
  hover?: boolean;
  gradient?: boolean;
  glow?: boolean;
  children?: React.ReactNode;
}

export function Card({
  hover = false,
  gradient = false,
  glow = false,
  className = "",
  children,
  ...props
}: CardProps) {
  const baseStyles =
    "relative rounded-2xl transition-all duration-300 border backdrop-blur-sm overflow-hidden";

  const backgroundStyles = gradient
    ? "bg-gradient-to-br from-surface via-surface-elevated to-surface"
    : "bg-surface/80";

  const borderStyles = gradient
    ? "border-primary/20"
    : "border-surface-elevated/50";

  const shadowStyles = glow
    ? "shadow-lg shadow-primary/10"
    : "shadow-md";

  const hoverStyles = hover
    ? "hover:shadow-xl hover:shadow-primary/20 hover:border-primary/40 hover:scale-[1.02]"
    : "";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`${baseStyles} ${backgroundStyles} ${borderStyles} ${shadowStyles} ${hoverStyles} ${className}`}
      {...props}
    >
      {/* Subtle gradient overlay */}
      {gradient && (
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      )}

      {/* Glow effect */}
      {glow && (
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary via-secondary to-accent opacity-20 blur-xl -z-10" />
      )}

      <div className="relative z-10 p-6">
        {children}
      </div>
    </motion.div>
  );
}

export interface CardHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  withBorder?: boolean;
}

export function CardHeader({ withBorder = true, className = "", children, ...props }: CardHeaderProps) {
  return (
    <div
      className={`px-6 py-4 ${withBorder ? 'border-b border-surface-elevated/50' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export interface CardBodyProps extends React.HTMLAttributes<HTMLDivElement> {}

export function CardBody({ className = "", children, ...props }: CardBodyProps) {
  return (
    <div className={`px-6 py-4 ${className}`} {...props}>
      {children}
    </div>
  );
}

export interface CardFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  withBorder?: boolean;
}

export function CardFooter({ withBorder = true, className = "", children, ...props }: CardFooterProps) {
  return (
    <div
      className={`px-6 py-4 ${withBorder ? 'border-t border-surface-elevated/50' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
