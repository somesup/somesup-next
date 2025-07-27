'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';

const OnboardingStartButton = () => {
  const handleGuestSignIn = () => {
    // TODO: API 연결
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
