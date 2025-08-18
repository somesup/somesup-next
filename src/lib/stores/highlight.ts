import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { getTodayString } from '../utils/news-daily';

type highlightStore = {
  lastVisit: string;
  setLastVisitNow: () => void;
  isVisited: () => boolean;
};

export const initialHighlight = {
  lastVisit: '',
};

export const useHighlightStore = create<highlightStore>()(
  persist(
    (set, get) => ({
      ...initialHighlight,
      setLastVisitNow: () =>
        set(state => {
          state.lastVisit = getTodayString();
          return state;
        }),
      isVisited: () => {
        return get().lastVisit === getTodayString();
      },
    }),
    { name: 'news5min' },
  ),
);
