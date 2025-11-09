"use client";

import React, { useState, useRef, useEffect } from "react";

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
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {children}
      </div>
      {isMounted && isVisible && (
        <div
          className={`absolute z-50 w-max max-w-xs rounded-md bg-surface px-3 py-2 text-sm text-foreground shadow-lg ring-1 ring-primary/20 ${positions[position]}`}
          role="tooltip"
        >
          {content}
          <div
            className={`absolute h-2 w-2 rotate-45 bg-surface ${
              position === "top"
                ? "bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2"
                : position === "bottom"
                  ? "top-0 left-1/2 -translate-x-1/2 -translate-y-1/2"
                  : position === "left"
                    ? "right-0 top-1/2 -translate-y-1/2 translate-x-1/2"
                    : "left-0 top-1/2 -translate-y-1/2 -translate-x-1/2"
            }`}
          />
        </div>
      )}
    </div>
  );
}
