'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import { toast } from '@/components/ui/toast';
import { authGuestLogin } from '@/lib/apis/apis';
import { useUserStore } from '@/lib/stores/user';
import { SectionType } from '@/types/types';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const OnboardingStartButton = () => {
  const setUser = useUserStore(state => state.setUser);
  const router = useRouter();

  const handleGuestSignIn = async () => {
    const { error, data } = await authGuestLogin();

    if (!error) {
      const preferences = data.sectionPreferences.reduce((acc, c) => {
        acc.set(c.sectionName, c.preference);
        return acc;
      }, new Map()) as unknown as Record<SectionType, number>;

      setUser({ user: data.user, preferences, ...data.tokens });
      return router.push('/set-nickname?isCreated=true');
    }

    toast.serverError();
  };

  return (
    <div className="absolute top-0 flex h-screen w-full flex-col justify-end gap-2 px-8 pb-10">
      <Link href="/sign-in" className={buttonVariants({ variant: 'default', size: 'default' })}>
        전화번호로 시작하기
      </Link>
      <Button variant="secondary" onClick={handleGuestSignIn}>
        게스트로 시작하기
      </Button>
    </div>
  );
};

export default OnboardingStartButton;
