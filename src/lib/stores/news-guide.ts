import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type NewsGuideState = {
  viewed: boolean;
  setViewed: () => void;
};

export const useNewsGuideStore = create<NewsGuideState>()(
  persist(
    set => ({
      viewed: false,
      setViewed: () => set({ viewed: true }),
    }),
    { name: 'news-guide' },
  ),
);
