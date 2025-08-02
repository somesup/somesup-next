import { TokenDto, UserDto } from '@/types/dto';
import { Expand } from '@/types/types';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';

type User = Expand<{ user: UserDto } & TokenDto>;

type UserStore = {
  setUser: (user: User) => void;
  resetUser: () => void;
} & User;

const initialUser: User = {
  user: { id: -1, phone: '01000000000', nickname: '' },
  accessToken: '',
  refreshToken: '',
};

const useUserStore = create<UserStore>()(
  persist(
    immer(set => ({
      ...initialUser,
      setUser: user => set(() => user),
      resetUser: () => set(() => initialUser),
    })),
    {
      name: 'user',
    },
  ),
);

export { useUserStore, type User };
