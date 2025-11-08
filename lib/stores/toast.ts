import { create } from "zustand";

export type ToastType = "success" | "error" | "warning" | "info";

export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (message: string, type: ToastType, duration?: number) => void;
  removeToast: (id: string) => void;
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  addToast: (message, type, duration = 5000) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      toasts: [...state.toasts, { id, message, type, duration }],
    }));

    if (duration > 0) {
      setTimeout(() => {
        set((state) => ({
          toasts: state.toasts.filter((toast) => toast.id !== id),
        }));
      }, duration);
    }
  },
  removeToast: (id) =>
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    })),
}));

// Helper functions
export const toast = {
  success: (message: string, duration?: number) => {
    useToastStore.getState().addToast(message, "success", duration);
  },
  error: (message: string, duration?: number) => {
    useToastStore.getState().addToast(message, "error", duration);
  },
  warning: (message: string, duration?: number) => {
    useToastStore.getState().addToast(message, "warning", duration);
  },
  info: (message: string, duration?: number) => {
    useToastStore.getState().addToast(message, "info", duration);
  },
};
