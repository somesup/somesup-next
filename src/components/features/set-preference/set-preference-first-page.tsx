'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import Hexagon from '@/components/ui/hexagon';
import { useUserStore } from '@/lib/stores/user';
import { cn } from '@/lib/utils';
import { sectionLabels } from '@/types/types';

type SetPreferenceFinishPageProps = {
  onConfirm: () => void;
};

const SetPreferenceFinishPage = ({ onConfirm }: SetPreferenceFinishPageProps) => {
  const [withLabel, setWithLabel] = useState(true);
  const [isAnimating, setIsAnimating] = useState(false);
  const nickname = useUserStore(state => state.user.nickname);
  const preferences = useUserStore(state => state.preferences);
  const radii = sectionLabels.map(label => preferences[label] * 30 || 30);

  useEffect(() => {
    const timeId = setTimeout(() => {
      setIsAnimating(true);
      setWithLabel(false);

      setTimeout(() => onConfirm(), 600);
    }, 500);

    return () => clearTimeout(timeId);
  }, []);

  return (
    <div className="h-full w-full overflow-hidden px-8 py-4">
      <div className="relative flex h-full w-full flex-col pb-20 text-center">
        <div className={`pt-6 transition-opacity duration-700 ${isAnimating && 'opacity-0'}`}>
          <h3 className="!font-bold typography-small-title">{nickname} 님,</h3>
          <p className="typography-body1">카테고리별 관심도를 알려주세요</p>
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
    </div>
  );
};

export default SetPreferenceFinishPage;
