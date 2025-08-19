'use client';

import React, { ReactNode, useEffect, useRef, useState } from 'react';

import useRefWidth from '@/lib/hooks/useRefWidth';
import { cn } from '@/lib/utils';

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
  const cellWidth = Math.min((containerWidth - gap * (itemsPerView - 1)) / itemsPerView, 200);
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
