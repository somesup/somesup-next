import { useState, useRef, useEffect } from 'react';

type ViewType = 'abstract' | 'detail';

export const useNewsDrag = (disabled: boolean = false) => {
  const [currentView, setCurrentView] = useState<ViewType>('abstract');
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [translateX, setTranslateX] = useState(0);
  const [isClient, setIsClient] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getContainerWidth = () => {
    if (!isClient) return 0;
    return containerRef.current?.offsetWidth || window.innerWidth;
  };

  const switchToView = (view: ViewType) => {
    setCurrentView(view);
    const containerWidth = getContainerWidth();
    setTranslateX(view === 'abstract' ? 0 : -containerWidth);
  };

  const handleStart = (clientX: number) => {
    if (disabled) return;
    setIsDragging(true);
    setStartX(clientX);
  };

  const handleMove = (clientX: number) => {
    if (!isDragging || !isClient || disabled) return;

    const deltaX = clientX - startX;
    const containerWidth = getContainerWidth();
    const baseTranslate = currentView === 'abstract' ? 0 : -containerWidth;

    let newTranslateX = baseTranslate + deltaX;
    newTranslateX = Math.max(-containerWidth, Math.min(0, newTranslateX));

    setTranslateX(newTranslateX);
  };

  const handleEnd = () => {
    if (!isDragging || !isClient || disabled) return;
    setIsDragging(false);

    const containerWidth = getContainerWidth();
    const threshold = containerWidth * 0.25;
    const currentTranslate = translateX;

    if (currentView === 'abstract') {
      if (currentTranslate <= -threshold) switchToView('detail');
      else switchToView('abstract');
    } else {
      if (currentTranslate >= -containerWidth + threshold) switchToView('abstract');
      else switchToView('detail');
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (disabled) return;

    const target = e.target as HTMLElement;
    if (target.closest('button')) return;

    if (e.detail > 1) e.preventDefault();
    handleStart(e.clientX);
  };

  const handleMouseMove = (e: MouseEvent) => handleMove(e.clientX);
  const handleMouseUp = () => handleEnd();

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (disabled) return;

    const target = e.target as HTMLElement;
    if (target.closest('button')) return;

    handleStart(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (disabled) return;
    handleMove(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    if (disabled) return;
    if (isDragging) e.preventDefault();
    handleEnd();
  };

  useEffect(() => {
    if (isDragging && !disabled) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging, startX, currentView, translateX, disabled]);

  const getProgress = () => {
    if (!isClient) return currentView === 'abstract' ? 0 : 1;
    const containerWidth = getContainerWidth();
    return containerWidth > 0 ? Math.abs(translateX) / containerWidth : 0;
  };

  return {
    currentView,
    isDragging,
    containerRef,
    isClient,
    getProgress,
    switchToView,
    handlers: disabled
      ? {}
      : {
          onMouseDown: handleMouseDown,
          onTouchStart: handleTouchStart,
          onTouchMove: handleTouchMove,
          onTouchEnd: handleTouchEnd,
        },
  };
};
