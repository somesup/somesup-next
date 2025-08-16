import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { enableMapSet } from 'immer';
import { useSESStore } from '@/lib/hooks/useSESStore';

import { UserDto } from '@/types/dto';
import { Expand, SectionPreference, SectionType } from '@/types/types';

enableMapSet();

export type User = Expand<{ user: UserDto; preferences: SectionPreference }>;

export type UserStore = Expand<
  {
    setUser: (user: User) => void;
    resetUser: () => void;
    setNickname: (nickname: string) => void;
    setPreferences: (preferences: SectionPreference) => void;
    setPreference: (section: SectionType, preference: number) => void;
  } & User
>;

const initialUser: User = {
  user: { id: -1, phone: '01000000000', nickname: '' },
  preferences: { politics: 1, economy: 1, society: 1, culture: 1, tech: 1, world: 1 },
};

export const useUserStore = create<UserStore>()(
  persist(
    immer(set => ({
      ...initialUser,
      setUser: user => set(() => user),
      resetUser: () => set(() => initialUser),
      setNickname: nickname => set(state => void (state.user.nickname = nickname)),
      setPreferences: sectionPreferences => set(state => void (state.preferences = sectionPreferences)),
      setPreference: (section, preference) =>
        set(state => {
          state.preferences[section] = preference;
        }),
    })),
    {
      name: 'user',
    },
  ),
);

export const useUserSESStore = <T>(selector: (state: UserStore) => T) => useSESStore(useUserStore, selector);
