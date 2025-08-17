import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';

type Toast = {
  id: string;
  type: 'error' | 'info' | 'success' | 'promo' | 'scrap';
  title: string;
  description?: string;
};

interface ToastStore {
  toasts: Toast[];
  add: (toast: Toast) => void;
  remove: (id: string) => void;
  clear: () => void;
}

const useToastStore = create<ToastStore>()(
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

export { useToastStore, type Toast };
