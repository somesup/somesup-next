import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type CursorState = {
  cursor: number;
  setCursor: (cursor: number) => void;
  updateCursor: (updater: (prev: number) => number) => void;
};

export const useCursorStore = create<CursorState>()(
  persist(
    set => ({
      cursor: 0,
      setCursor: cursor => set({ cursor }),
      updateCursor: updater =>
        set(state => ({
          cursor: updater(state.cursor),
        })),
    }),
    { name: 'cursor' },
  ),
);
