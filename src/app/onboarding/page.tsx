import { Metadata } from 'next';
import Image from 'next/image';
import OnboardingStartButton from '@/components/features/onboarding/onboarding-start-button';
import OnboardingCarousel from '@/components/features/onboarding/onboarding-carousel';
import { onboardingImages } from '@/data/onboarding';

export const metadata: Metadata = {
  title: '온보딩 페이지 | 썸즈 업',
  description: "some's up의 온보딩 페이지입니다! 이제 쉽고 빠른 뉴스를 여러분의 손 안에서 만나보세요",
};

const OnboardingPage = () => (
  <main className="relative">
    <div className="flex h-screen flex-col items-center justify-center gap-14 pb-40">
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
  </main>
);

export default OnboardingPage;
