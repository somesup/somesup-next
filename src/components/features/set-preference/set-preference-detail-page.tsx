'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import Hexagon from '@/components/ui/hexagon';
import { useUserStore } from '@/lib/stores/user';
import { sectionLabels, sectionNames } from '@/types/types';
import SetPreferenceSlider from './set-preference-slider';

type SetPreferenceDetailPageProps = {
  onConfirm: () => void;
};

const SetPreferenceDetailPage = ({ onConfirm }: SetPreferenceDetailPageProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [endAnimation, setEndAnimation] = useState(false);
  const preferences = useUserStore(state => state.preferences);
  const setPreference = useUserStore(state => state.setPreference);
  const [radii, setRadii] = useState(sectionLabels.map(label => preferences[label] * 30 || 30));
  const [visited, setVisited] = useState([true, false, false, false, false, false]);
  const [slideValue, setSlideValue] = useState((radii[0] / 30 - 1) * 50);
  const [animation, setAnimation] = useState(false);

  const handleLabelClick = (index: number) => {
    setAnimation(true);
    setPreference(sectionLabels[currentIndex], radii[currentIndex] / 30);
    setSlideValue((radii[index] / 30 - 1) * 50);
    setVisited(v => {
      v[index] = true;
      return v;
    });
    setCurrentIndex(index);

    setTimeout(() => {
      setAnimation(false);
    }, 700);
  };

  const handleStartClick = () => {
    const notVisitedIndex = visited.findIndex(node => node === false);
    handleLabelClick(notVisitedIndex);
    if (notVisitedIndex === -1) {
      setEndAnimation(true);
      return setTimeout(() => onConfirm(), 700);
    }
  };

  const handleSlideValueChange = (value: number) => {
    setRadii(radii => {
      radii[currentIndex] = (value / 50) * 30 + 30;
      return radii;
    });
    setSlideValue(value);
  };

  return (
    <div className="h-full w-full overflow-hidden px-8 py-4">
      <div className="relative flex h-full w-full flex-col pb-20 text-center">
        <div className={`transition-opacity duration-700 ${endAnimation && 'opacity-0'}`}>
          <p className="typography-body1">카테고리별 관심도를 알려주세요</p>
        </div>
        <div className="z-50 mb-5 mt-3 flex justify-center gap-2">
          {visited.map((v, idx) => (
            <button
              key={idx}
              onClick={() => handleLabelClick(idx)}
              className={`aspect-square w-1 rounded-full ${idx === currentIndex ? 'bg-gray-60' : v ? 'bg-[#4FE741]' : 'bg-[#535353]'} `}
            />
          ))}
        </div>
        <div className="relative">
          <div
            className="absolute left-[calc(50%-1.75rem)] z-50 flex gap-9"
            style={{ transform: `translateX(-${currentIndex * 5.75}rem)` }}
          >
            {sectionNames.map((name, idx) => (
              <button
                key={name}
                onClick={() => handleLabelClick(idx)}
                className={`w-14 whitespace-nowrap typography-main-title ${currentIndex !== idx && '!font-normal !text-gray-60/50'}`}
              >
                {name}
              </button>
            ))}
          </div>
        </div>
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pb-10 pt-12">
          <div
            className={`absolute left-1/2 top-11 z-50 -translate-x-1/2 transition-opacity duration-300 ${endAnimation && 'opacity-0'}`}
          >
            <SetPreferenceSlider value={slideValue} onChange={handleSlideValueChange} shouldAnimation={animation} />
          </div>
          <div className="top-0 -z-10">
            <Hexagon
              hexagons={[{ radii }]}
              className="origin-center transition-transform duration-700 ease-in-out"
              style={{
                transform: endAnimation
                  ? 'translateY(0) scale(1) rotate(-359deg)'
                  : `translateY(10rem) scale(2.8) rotate(-${currentIndex * 60}deg)`,
              }}
              withLabel={false}
            />
          </div>
        </div>
      </div>
      <div className="relative w-full">
        <Button
          type="submit"
          disabled={slideValue % 50 !== 0}
          className="absolute bottom-4 left-0"
          onClick={handleStartClick}
        >
          확인
        </Button>
      </div>
    </div>
  );
};

export default SetPreferenceDetailPage;
