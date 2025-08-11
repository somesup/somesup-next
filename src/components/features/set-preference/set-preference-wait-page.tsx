'use client';

import { useUserStore } from '@/lib/stores/user';
import SetPreferenceLottie from './set-preference-lottie';

const SetPreferenceWaitPage = () => {
  const nickname = useUserStore(state => state.user.nickname);

  return (
    <section className="px-8 pb-4 pt-24 text-center">
      <h3 className="!font-bold typography-small-title">
        {nickname} 님을 위한 {nickname.length > 6 && <br />} 뉴스를 구성하고 있어요
      </h3>
      <SetPreferenceLottie />
    </section>
  );
};

export default SetPreferenceWaitPage;
