'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import SignInInput from '@/components/features/sign-in/sign-in-input';
import { Button } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { useUserSESStore, useUserStore } from '@/lib/stores/user';
import { authUpdateUser } from '@/lib/apis/apis';

const SetNicknamePage = () => {
  const searchParams = useSearchParams();
  const initialNickname = useUserSESStore(state => state.user.nickname);
  const updateNickname = useUserStore(state => state.setNickname);
  const [nickname, setNickname] = useState(initialNickname);
  const [errorMessage, setErrorMessage] = useState('');
  const router = useRouter();

  const handleConfirm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { error } = await authUpdateUser({ nickname });
    if (!error) {
      updateNickname(nickname);
      const isCreated = searchParams.get('isCreated');
      return isCreated ? router.push('/set-preferences') : router.push('/my-page');
    }
    toast.serverError();
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (errorMessage) setErrorMessage('');
    const nickname = e.target.value;
    if (nickname.length <= 0) setErrorMessage('닉네임을 입력해주세요');
    if (nickname.length > 15) setErrorMessage('닉네임은 15자까지 입력할 수 있어요');
    setNickname(nickname);
  };

  return (
    <main className="flex h-screen flex-col px-8 py-4">
      <h2 className="mb-20 mt-2 text-center typography-small-title">닉네임 설정</h2>
      <form className="relative h-screen w-full" onSubmit={handleConfirm}>
        <label className="sr-only" htmlFor="nickname">
          전화번호 입력
        </label>
        <SignInInput type="text" id="nickname" placeholder="닉네임" value={nickname} onChange={handleInputChange} />
        {errorMessage && <p className="w-full pl-1 text-error typography-caption">{errorMessage}</p>}
        <Button type="submit" className="absolute bottom-4 left-0" disabled={!!errorMessage}>
          확인
        </Button>
      </form>
    </main>
  );
};

export default SetNicknamePage;
