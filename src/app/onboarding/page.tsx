import { Metadata } from 'next';

import OnboardingStartButton from '@/components/features/onboarding/onboarding-start-button';
import OnboardingCarousel from '@/components/features/onboarding/onboarding-carousel';
import { onboardingImages } from '@/data/onboarding';
import Image from 'next/image';

export const metadata: Metadata = {
  title: '온보딩 페이지 | 썹즈 업',
  description: '...', // TODO: 생각하기
};

const OnboardingPage = () => (
  <div className="relative">
    <div className="flex h-screen flex-col items-center justify-center gap-16 pb-32 lg:pb-[15%]">
      <OnboardingCarousel gap={20}>
        {onboardingImages.map(image => (
          <Image key={image.id} className="rounded-lg" src={image.url} alt="Some's up" width={310} height={440} />
        ))}
      </OnboardingCarousel>
      <p className="text-center">
        믿을 수 있는 쉽고 빠른 뉴스가
        <br />
        이미 손 안에 도착했습니다
      </p>
    </div>
    <OnboardingStartButton />
  </div>
);

export default OnboardingPage;
