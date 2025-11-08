"use client";

import React, { useState } from "react";

export interface TooltipProps {
  content: string;
  children: React.ReactNode;
  position?: "top" | "bottom" | "left" | "right";
}

export function Tooltip({ content, children, position = "top" }: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);

  const positions = {
    top: "bottom-full left-1/2 -translate-x-1/2 mb-2",
    bottom: "top-full left-1/2 -translate-x-1/2 mt-2",
    left: "right-full top-1/2 -translate-y-1/2 mr-2",
    right: "left-full top-1/2 -translate-y-1/2 ml-2",
  };

  return (
    <div className="relative inline-block">
      <div
        onMouseEnter={() => setTimeout(() => setIsVisible(true), 300)}
        onMouseLeave={() => setIsVisible(false)}
      >
        {children}
      </div>
      {isVisible && (
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
