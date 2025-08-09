import { TokenDto, UserDto } from '@/types/dto';
import { Expand, SectionPreference, SectionType } from '@/types/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type User = Expand<{ user: UserDto; sectionPreferences: SectionPreference } & TokenDto>;

type UserStore = {
  setUser: (user: User) => void;
  resetUser: () => void;
  setPreferences: (sectionPreferences: SectionPreference) => void;
  setPreference: (section: SectionType, preference: number) => void;
  setTokens: (tokens: TokenDto) => void;
} & User;

const initialUser: User = {
  user: { id: -1, phone: '01000000000', nickname: '' },
  sectionPreferences: { politics: 1, economy: 1, society: 1, culture: 1, tech: 1, world: 1 },
  accessToken: '',
  refreshToken: '',
};

const useUserStore = create<UserStore>()(
  persist(
    immer(set => ({
      ...initialUser,
      setUser: user => set(() => user),
      resetUser: () => set(() => initialUser),
      setTokens: tokens => set(user => Object.assign(user, tokens)),
      setPreferences: sectionPreferences => set(user => (user.sectionPreferences = sectionPreferences)),
      setPreference: (section, preference) => set(user => (user.sectionPreferences[section] = preference)),
    })),
    {
      name: 'user',
    },
  ),
);

export { useUserStore, type User };
