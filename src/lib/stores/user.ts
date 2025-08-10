import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { useSESStore } from '@/lib/hooks/useSESStore';

import { TokenDto, UserDto } from '@/types/dto';
import { Expand, SectionPreference, SectionType } from '@/types/types';

export type User = Expand<{ user: UserDto; sectionPreferences: SectionPreference } & TokenDto>;

export type UserStore = Expand<
  {
    setUser: (user: User) => void;
    resetUser: () => void;
    setNickname: (nickname: string) => void;
    setPreferences: (sectionPreferences: SectionPreference) => void;
    setPreference: (section: SectionType, preference: number) => void;
    setTokens: (tokens: TokenDto) => void;
  } & User
>;

const initialUser: User = {
  user: { id: -1, phone: '01000000000', nickname: '' },
  sectionPreferences: { politics: 1, economy: 1, society: 1, culture: 1, tech: 1, world: 1 },
  accessToken: '',
  refreshToken: '',
};

export const useUserStore = create<UserStore>()(
  persist(
    immer(set => ({
      ...initialUser,
      setUser: user => set(() => user),
      resetUser: () => set(() => initialUser),
      setNickname: nickname => set(state => void (state.user.nickname = nickname)),
      setPreferences: sectionPreferences => set(state => void (state.sectionPreferences = sectionPreferences)),
      setPreference: (section, preference) => set(state => void (state.sectionPreferences[section] = preference)),
      setTokens: tokens => set(state => Object.assign(state, tokens)),
    })),
    {
      name: 'user',
    },
  ),
);

export const useUserSESStore = <T>(selector: (state: UserStore) => T) => useSESStore(useUserStore, selector);
