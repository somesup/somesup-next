'use client';
import { cn } from '@/lib/utils';
import React, { ReactNode, RefObject, useEffect, useRef, useState } from 'react';

type OnboardingCarouselProps = {
  gap?: number;
  children: ReactNode[] | ReactNode;
  itemsPerView?: number;
  autoPlayInterval?: number;
  className?: string;
};

const OnboardingCarousel = ({
  children,
  gap = 0,
  itemsPerView = 1.8,
  autoPlayInterval = 1500,
  className = '',
}: OnboardingCarouselProps) => {
  const originalItems = React.Children.toArray(children);
  const totalItems = originalItems.length;
  const items = totalItems ? [...originalItems, ...originalItems, ...originalItems] : [];

  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(totalItems);
  const [isTransitioning, setIsTransitioning] = useState(true);

  const containerWidth = useRefWidth(containerRef);
  const cellWidth = (containerWidth - gap * (itemsPerView - 1)) / itemsPerView;
  const centerOffset = (containerWidth - cellWidth) / 2;
  const translateX = centerOffset - currentIndex * (cellWidth + gap);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex(prev => prev + 1);
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlayInterval]);

  useEffect(() => {
    if (currentIndex >= totalItems * 2) {
      const timer = setTimeout(() => {
        setIsTransitioning(false);
        setCurrentIndex(totalItems);

        requestAnimationFrame(() => {
          setIsTransitioning(true);
        });
      }, 400);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, totalItems, isTransitioning]);

  return (
    <div ref={containerRef} className={cn('relative w-full overflow-hidden', className)}>
      <div
        className="flex ease-out"
        style={{
          transform: `translateX(${translateX}px)`,
          gap: `${gap}px`,
          transition: isTransitioning ? 'transform 0.4s' : 'none',
        }}
      >
        {items.map((child, index) => (
          <div key={index} className="flex-shrink-0" style={{ width: `${cellWidth}px` }}>
            {child}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OnboardingCarousel;

/**
 * DOM 요소의 width 변화를 감지하고 debounce를 적용하여 상태로 관리하는 커스텀 훅
 * ResizeObserver를 사용하여 요소 크기 변화를 실시간으로 감지합니다.
 *
 * @param {RefObject<HTMLDivElement>} ref - width를 측정할 HTMLDivElement의 ref 객체
 * @param {number} [delayMs=300] - debounce 지연 시간 (밀리초). 기본값: 300ms
 * @returns {number} 현재 요소의 width 값 (픽셀 단위)
 */
const useRefWidth = (ref: RefObject<HTMLDivElement>, delayMs: number = 300): number => {
  const [width, setWidth] = useState(0);

  useEffect(() => {
    const debouncedSetWidth = debounce((newWidth: number) => {
      setWidth(newWidth);
    }, delayMs);

    const updateWidth = () => {
      const newWidth = ref.current?.getBoundingClientRect().width;
      if (newWidth) debouncedSetWidth(newWidth);
    };

    const initialWidth = ref.current?.getBoundingClientRect().width;
    if (initialWidth) setWidth(initialWidth);

    const resizeObserver = new ResizeObserver(updateWidth);
    if (ref.current) resizeObserver.observe(ref.current);

    return () => {
      resizeObserver.disconnect();
      debouncedSetWidth.cancel();
    };
  }, [delayMs]);

  return width;
};

/**
 * 함수 호출을 지연시켜 빈번한 호출을 방지하는 debounce 함수
 * 마지막 호출 후 지정된 시간이 지나야 실제 함수가 실행됩니다.
 *
 * @param {T} func - debounce를 적용할 함수
 * @param {number} [delayMs=300] - 지연 시간 (밀리초). 기본값: 300ms
 * @returns {T & { cancel: () => void }} debounce가 적용된 함수와 cancel 메서드를 포함한 객체
 */
const debounce = <T extends (...args: any[]) => any>(func: T, delayMs: number = 300): T & { cancel: () => void } => {
  let timeoutId: NodeJS.Timeout | null = null;

  const debouncedFunction = ((...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {
      func.apply(null, args);
    }, delayMs);
  }) as T & { cancel: () => void };

  debouncedFunction.cancel = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }
  };

  return debouncedFunction;
};
