'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import { useUserStore } from '@/lib/stores/user';

const SetPreferenceLottie = dynamic(() => import('./set-preference-lottie'));

const comments = [
  (nickname: string) => (
    <>
      {nickname} 님을 위한
      <br />
      뉴스를 수집하고 있어요
    </>
  ),
  () => '맞춤형 뉴스 피드를 구성하고 있어요',
  () => '거의 다 되었어요 !',
];

const SetPreferenceWaitPage = () => {
  const nickname = useUserStore(state => state.user.nickname);
  const [index, setIndex] = useState(0);

  const timeId = setInterval(() => {
    if (index >= comments.length - 1) return clearInterval(timeId);

    setIndex(index + 1);
  }, 2000);

  return (
    <section className="relative flex h-full flex-col px-8 pb-32 pt-24 text-center">
      <h3 className="absolute left-0 top-24 w-full text-center !font-bold typography-small-title">
        {comments[index](nickname)}
      </h3>
      <div className="flex flex-1 items-center">
        <SetPreferenceLottie />
      </div>
    </section>
  );
};

export default SetPreferenceWaitPage;
