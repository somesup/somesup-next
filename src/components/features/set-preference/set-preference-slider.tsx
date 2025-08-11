import React, { useRef, useState, useEffect, useCallback } from 'react';
import { debounce } from '@/lib/utils';

type SetPreferenceSliderProps = {
  value: number;
  shouldAnimation: boolean;
  onChange: (value: number) => void;
};

const SetPreferenceSlider = ({ value, onChange, shouldAnimation }: SetPreferenceSliderProps) => {
  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [displayValue, setDisplayValue] = useState(value);

  const snapDelay = 500;
  const snapValues = [0, 50, 100];

  const findNearestSnapValue = useCallback(
    (currentValue: number) => {
      return snapValues.reduce((nearest, snapValue) => {
        return Math.abs(currentValue - snapValue) < Math.abs(currentValue - nearest) ? snapValue : nearest;
      });
    },
    [snapValues],
  );

  const animateToSnapValue = useCallback(
    (targetValue: number) => {
      if (targetValue === displayValue) return;

      setIsAnimating(true);
      const startValue = displayValue;
      const difference = targetValue - startValue;
      const duration = 500;
      const startTime = Date.now();

      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + difference * easeProgress;

        setDisplayValue(Math.round(currentValue));
        onChange(Math.round(currentValue));

        if (progress < 1) requestAnimationFrame(animate);
        else setIsAnimating(false);
      };

      requestAnimationFrame(animate);
    },
    [displayValue, onChange],
  );

  const debouncedSnap = useCallback(
    debounce((currentValue: number) => {
      if (!isDragging && !isAnimating) {
        const nearestSnap = findNearestSnapValue(currentValue);
        if (nearestSnap !== currentValue) animateToSnapValue(nearestSnap);
      }
    }, snapDelay),
    [isDragging, isAnimating, findNearestSnapValue, animateToSnapValue, snapDelay],
  );

  useEffect(() => {
    if (!isDragging && !isAnimating) setDisplayValue(value);
  }, [value, isDragging, isAnimating]);

  useEffect(() => {
    if (!isDragging && !isAnimating) debouncedSnap(displayValue);
    return () => debouncedSnap.cancel();
  }, [isDragging, isAnimating, displayValue, debouncedSnap]);

  const updateValue = (clientY: number) => {
    if (!sliderRef.current || isAnimating) return;

    const rect = sliderRef.current.getBoundingClientRect();
    const relativeY = clientY - rect.top;
    const newValue = Math.max(0, Math.min(1, 1 - relativeY / rect.height)) * 100;
    const roundedValue = Math.round(newValue);

    setDisplayValue(roundedValue);
    onChange(roundedValue);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isAnimating) return;

    e.preventDefault();
    setIsDragging(true);

    debouncedSnap.cancel();
    updateValue(e.clientY);

    const handleMouseMove = (moveEvent: MouseEvent) => {
      moveEvent.preventDefault();
      updateValue(moveEvent.clientY);
    };

    const handleMouseUp = (upEvent: MouseEvent) => {
      upEvent.preventDefault();
      setIsDragging(false);
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (isAnimating) return;

    e.preventDefault();
    setIsDragging(true);
    debouncedSnap.cancel();
    const touch = e.touches[0];
    updateValue(touch.clientY);

    const handleTouchMove = (moveEvent: TouchEvent) => {
      moveEvent.preventDefault();
      const touch = moveEvent.touches[0];
      if (touch) {
        updateValue(touch.clientY);
      }
    };

    const handleTouchEnd = (endEvent: TouchEvent) => {
      endEvent.preventDefault();
      setIsDragging(false);
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };

    document.addEventListener('touchmove', handleTouchMove, { passive: false });
    document.addEventListener('touchend', handleTouchEnd);
  };

  return (
    <div
      ref={sliderRef}
      className="relative mx-auto h-[13.25rem] w-3 cursor-pointer touch-none rounded-full bg-[#535353]"
      onMouseDown={handleMouseDown}
      onTouchStart={handleTouchStart}
      style={{ userSelect: 'none' }}
    >
      <div
        className={`absolute bottom-0 w-full rounded-full bg-white ${(shouldAnimation || isAnimating) && 'transition-all duration-700 ease-out'}`}
        style={{ height: `${displayValue}%` }}
      />
      <div
        className={`absolute left-1/2 flex h-12 w-6 -translate-x-1/2 transform flex-col items-center justify-center gap-1 rounded-full bg-white shadow-lg ${(shouldAnimation || isAnimating) && 'transition-all duration-700 ease-out'}`}
        style={{ bottom: `calc(${displayValue}% - 1.5rem)` }}
      >
        <div className="h-0 w-3 border-2 border-[#ececec]" />
        <div className="h-0 w-3 border-2 border-[#ececec]" />
        <div className="h-0 w-3 border-2 border-[#ececec]" />
      </div>
      <div className="absolute left-[200%] top-1/2 flex h-60 -translate-y-1/2 flex-col items-center justify-between whitespace-nowrap typography-caption">
        <span>높음</span>
        <span>중간</span>
        <span>낮음</span>
      </div>
    </div>
  );
};

export default SetPreferenceSlider;
