'use client';

import { FormEvent, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import SignInInput from '@/components/features/sign-in/sign-in-input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { useUserSESStore, useUserStore } from '@/lib/stores/user';
import { authUpdateUser } from '@/lib/apis/apis';

const SetNicknamePage = () => {
  const initialNickname = useUserSESStore(state => state.user.nickname);
  const updateNickname = useUserStore(state => state.setNickname);
  const [nickname, setNickname] = useState(initialNickname);
  const [isInitialSetup, setIsInitialSetup] = useState(false);
  const router = useRouter();

  const handleConfirm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { error } = await authUpdateUser({ nickname });
    if (!error) {
      updateNickname(nickname);
      return isInitialSetup ? router.push('/set-preference') : router.push('/mypage');
    }
    toast.serverError();
  };

  useEffect(() => {
    setIsInitialSetup(document.referrer === '/sign-in');
  }, []);

  return (
    <main className="flex h-screen flex-col px-8 py-4">
      <h2 className="mb-20 mt-2 text-center typography-small-title">닉네임 설정</h2>
      <form className="relative h-screen w-full" onSubmit={handleConfirm}>
        <label className="sr-only" htmlFor="nickname">
          전화번호 입력
        </label>
        <SignInInput
          type="text"
          id="nickname"
          placeholder="닉네임"
          value={nickname}
          onChange={e => setNickname(e.target.value)}
        />
        <Button type="submit" className="absolute bottom-4 left-0">
          확인
        </Button>
      </form>
    </main>
  );
};

export default SetNicknamePage;
