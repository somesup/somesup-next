import { Expand } from 'tailwindcss/types/config';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Cursor = {
  cursor: number;
};

export type CursorStore = Expand<
  {
    setCursor: (cursor: number) => void;
  } & Cursor
>;

export const useUserStore = create<CursorStore>()(
  persist(
    set => ({
      cursor: 0,
      setCursor: (cursor: number) => set({ cursor }),
    }),
    { name: 'cursor' },
  ),
);
