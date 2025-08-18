import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

export type Toast = {
  id: string;
  type: 'error' | 'info' | 'success' | 'promo' | 'scrap';
  title: string;
  description?: string;
};

export type ToastStore = {
  toasts: Toast[];
  add: (toast: Toast) => void;
  remove: (id: string) => void;
  clear: () => void;
};

export const useToastStore = create<ToastStore>()(
  immer(set => ({
    toasts: [],
    add: toast =>
      set(state => {
        state.toasts.push(toast);
      }),
    remove: id =>
      set(state => {
        state.toasts = state.toasts.filter(t => t.id !== id);
      }),
    clear: () =>
      set(state => {
        state.toasts = [];
      }),
  })),
);
