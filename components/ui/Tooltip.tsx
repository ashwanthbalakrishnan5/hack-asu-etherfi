"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({ content, children, position = "top" }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Ensure component is mounted to avoid hydration issues
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleMouseEnter = () => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    // Set new timeout
    timeoutRef.current = setTimeout(() => {
      setIsVisible(true);
    }, 300);
  };

  const handleMouseLeave = () => {
    // Clear timeout if user leaves before tooltip shows
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsVisible(false);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const positions = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-3",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-3",
    left: "right-full top-1/2 -translate-y-1/2 mr-3",
    right: "left-full top-1/2 -translate-y-1/2 ml-3",
  };

  const arrowPositions = {
    top: "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2",
    bottom: "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2",
    left: "right-0 top-1/2 -translate-y-1/2 translate-x-1/2",
    right: "left-0 top-1/2 -translate-y-1/2 -translate-x-1/2",
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      <AnimatePresence>
        {isMounted && isVisible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 w-max max-w-xs rounded-xl bg-gradient-to-br from-surface-elevated to-surface px-4 py-2.5 text-sm text-foreground shadow-xl shadow-primary/10 ring-1 ring-primary/30 backdrop-blur-xl ${positions[position]}`}
            role="tooltip"
          >
            {content}
            <div
              className={`absolute h-2 w-2 rotate-45 bg-surface-elevated ring-1 ring-primary/30 ${arrowPositions[position]}`}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
