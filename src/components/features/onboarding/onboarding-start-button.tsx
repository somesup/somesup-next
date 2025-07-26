'use client';

import { Button, buttonVariants } from '@/components/ui/button';
import Link from 'next/link';

const OnboardingStartButton = () => {
  return (
    <div className="absolute">
      <Link href="/sign-in" className={buttonVariants({ variant: 'default', size: 'default' })}>
        전화번호로 시작하기
      </Link>
      <Button variant="secondary">게스트로 시작하기</Button>
    </div>
  );
};

export default OnboardingStartButton;
