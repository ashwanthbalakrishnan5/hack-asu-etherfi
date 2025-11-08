import React from "react";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  helperText?: string;
  error?: string;
}

export function Input({
  label,
  helperText,
  error,
  className = "",
  id,
  ...props
}: InputProps) {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="mb-2 block text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`w-full rounded-md border bg-background px-4 py-2 text-foreground transition-all duration-200 placeholder:text-foreground/40 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-50 ${
          error ? "border-error" : "border-surface"
        } ${className}`}
        {...props}
      />
      {helperText && !error && <p className="mt-1 text-sm text-foreground/60">{helperText}</p>}
      {error && <p className="mt-1 text-sm text-error">{error}</p>}
    </div>
  );
}
