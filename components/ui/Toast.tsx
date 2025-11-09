"use client";

import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useToastStore } from "@/lib/stores/toast";
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from "lucide-react";

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  const icons = {
    success: <CheckCircle className="h-5 w-5" />,
    error: <AlertCircle className="h-5 w-5" />,
    warning: <AlertTriangle className="h-5 w-5" />,
    info: <Info className="h-5 w-5" />,
  };

  const colors = {
    success: "bg-gradient-to-r from-success/20 to-success/10 border-success/60 text-success shadow-success/20",
    error: "bg-gradient-to-r from-error/20 to-error/10 border-error/60 text-error shadow-error/20",
    warning: "bg-gradient-to-r from-warning/20 to-warning/10 border-warning/60 text-warning shadow-warning/20",
    info: "bg-gradient-to-r from-primary/20 to-secondary/10 border-primary/60 text-primary shadow-primary/20",
  };

  const iconBg = {
    success: "bg-success/20 border-success/40",
    error: "bg-error/20 border-error/40",
    warning: "bg-warning/20 border-warning/40",
    info: "bg-primary/20 border-primary/40",
  };

  if (!mounted) return null;

  const toastContent = (
    <div className="pointer-events-none fixed bottom-6 right-6 z-[99999] flex flex-col gap-3 max-w-md">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ duration: 0.3, type: "spring", damping: 25, stiffness: 300 }}
            className={`pointer-events-auto flex items-center gap-4 rounded-xl border-2 px-5 py-4 shadow-2xl backdrop-blur-xl ${colors[toast.type]}`}
            role="alert"
          >
            <div className={`flex-shrink-0 flex h-10 w-10 items-center justify-center rounded-lg border ${iconBg[toast.type]}`}>
              {icons[toast.type]}
            </div>
            <p className="flex-1 text-sm font-semibold text-foreground">{toast.message}</p>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => removeToast(toast.id)}
              className="flex-shrink-0 rounded-lg p-1.5 transition-colors hover:bg-surface-elevated/50"
              aria-label="Close toast"
            >
              <X className="h-4 w-4" />
            </motion.button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );

  return createPortal(toastContent, document.body);
}
