'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Hexagon from '@/components/ui/hexagon';
import { useUserStore } from '@/lib/stores/user';
import { cn } from '@/lib/utils';
import { sectionLabels } from '@/types/types';

type SetPreferenceFinishPageProps = {
  onReSetup: () => void;
  onConfirm: () => void;
};

const SetPreferenceFinishPage = ({ onReSetup, onConfirm }: SetPreferenceFinishPageProps) => {
  const [withLabel, setWithLabel] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const nickname = useUserStore(state => state.user.nickname);
  const preferences = useUserStore(state => state.preferences);
  const radii = sectionLabels.map(label => preferences[label] * 30 || 30);

  const handleReSetupClick = () => {
    setIsAnimating(true);
    setWithLabel(false);

    setTimeout(() => {
      onReSetup();
    }, 600);
  };

  return (
    <div className="h-full w-full overflow-hidden px-8 py-4">
      <div className="relative flex h-full w-full flex-col pb-20 text-center">
        <div className={`pt-6 transition-opacity duration-700 ${isAnimating && 'opacity-0'}`}>
          <h3 className="!font-bold typography-small-title">
            {nickname} 님의 {nickname.length > 6 && <br />} 맞춤 설정이 완료되었어요!
          </h3>
          <p className="typography-body1">좋아하실만한 뉴스를 준비할게요</p>
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pb-10 pt-12">
          <div className="top-0">
            <Hexagon
              hexagons={[{ radii }]}
              className={cn(
                'transition-transform duration-700 ease-in-out',
                isAnimating ? 'translate-y-[10rem] scale-[2.8]' : 'scale-100',
              )}
              withLabel={withLabel}
            />
          </div>
        </div>
      </div>
      <div className="relative w-full">
        <div className="absolute bottom-4 left-0 w-full text-center">
          <p className="pb-5 typography-caption">선호도는 마이페이지에서 언제든지 변경할 수 있어요</p>
          <div className="flex w-full gap-2.5">
            <Button variant="secondary" type="submit" className="flex-1" onClick={handleReSetupClick}>
              다시 설정하기
            </Button>
            <Button type="submit" className="flex-1" onClick={onConfirm}>
              확인
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SetPreferenceFinishPage;
