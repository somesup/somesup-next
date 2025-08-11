'use client';

import { useUserStore } from '@/lib/stores/user';
import SetPreferenceLottie from './set-preference-lottie';

const SetPreferenceWaitPage = () => {
  const nickname = useUserStore(state => state.user.nickname);

  return (
    <section className="flex h-full flex-col px-8 pb-32 pt-24 text-center">
      <h3 className="!font-bold typography-small-title">
        {nickname} 님을 위한 {nickname.length > 6 && <br />} 뉴스를 구성하고 있어요
      </h3>
      <div className="flex flex-1 items-center">
        <SetPreferenceLottie />
      </div>
    </section>
  );
};

export default SetPreferenceWaitPage;
