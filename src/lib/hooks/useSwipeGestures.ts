import { useCallback, useEffect, useState } from 'react';

type DragDirection = 'none' | 'vertical' | 'horizontal';

type UseSwipeGesturesProps = {
  itemsLength: number;
  onItemChange?: (index: number) => void;
  onDetailToggle?: (index: number, isDetail: boolean) => void;
};

const useSwipeGestures = ({ itemsLength, onItemChange, onDetailToggle }: UseSwipeGesturesProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDetailView, setIsDetailView] = useState(false);
  const [xTransform, setXTransform] = useState(100);
  const [yScroll, setYScroll] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [dragCurrent, setDragCurrent] = useState({ x: 0, y: 0 });
  const [dragDirection, setDragDirection] = useState<DragDirection>('none');

  // 아이템 변경 시 콜백 호출
  useEffect(() => {
    onItemChange?.(currentIndex);
  }, [currentIndex, onItemChange]);

  // 디테일 뷰 변경 시 콜백 호출
  useEffect(() => {
    onDetailToggle?.(currentIndex, isDetailView);
  }, [isDetailView, onDetailToggle]);

  // 다음 아이템으로 이동
  const goToNextItem = useCallback(() => {
    const nextIndex = Math.min(currentIndex + 1, itemsLength - 1);
    setCurrentIndex(nextIndex);
    setYScroll(nextIndex * window.innerHeight);
  }, [currentIndex, itemsLength]);

  // 이전 아이템으로 이동
  const goToPrevItem = useCallback(() => {
    const prevIndex = Math.max(currentIndex - 1, 0);
    setCurrentIndex(prevIndex);
    setYScroll(prevIndex * window.innerHeight);
  }, [currentIndex]);

  // 디테일 뷰 토글
  const toggleDetailView = useCallback((show: boolean) => {
    setIsDetailView(show);
    setXTransform(show ? 0 : 100);
  }, []);

  // 특정 아이템으로 이동
  const goToItem = useCallback(
    (index: number) => {
      const clampedIndex = Math.max(0, Math.min(index, itemsLength - 1));
      setCurrentIndex(clampedIndex);
      setYScroll(clampedIndex * window.innerHeight);
    },
    [itemsLength],
  );

  // 드래그 시작
  const handleStart = useCallback((clientX: number, clientY: number) => {
    setIsDragging(true);
    setDragStart({ x: clientX, y: clientY });
    setDragCurrent({ x: clientX, y: clientY });
    setDragDirection('none');
  }, []);

  // 드래그 중
  const handleMove = useCallback(
    (clientX: number, clientY: number) => {
      if (!isDragging) return;
      setDragCurrent({ x: clientX, y: clientY });

      const deltaX = clientX - dragStart.x;
      const deltaY = clientY - dragStart.y;
      const absDeltaX = Math.abs(deltaX);
      const absDeltaY = Math.abs(deltaY);

      // 최소 이동 거리 체크
      if (absDeltaX < 5 && absDeltaY < 5) return;

      // 드래그 방향 결정
      if (dragDirection === 'none') {
        const threshold = 15;

        if (absDeltaX > threshold || absDeltaY > threshold) {
          if (absDeltaY > absDeltaX * 1.5) {
            if (isDetailView) return;
            setDragDirection('vertical');
          } else if (absDeltaX > absDeltaY * 1.5) {
            setDragDirection('horizontal');
          }
        }
        return;
      }

      if (dragDirection === 'vertical') {
        // 수직 스와이프
        const maxDrag = window.innerHeight * 0.3;
        const limitedDeltaY = Math.max(-maxDrag, Math.min(maxDrag, deltaY));
        const newOffset = currentIndex * window.innerHeight - limitedDeltaY;
        setYScroll(newOffset);
      } else if (dragDirection === 'horizontal') {
        // 수평 스와이프
        if (deltaX < 0 && !isDetailView) {
          const progress = Math.min(absDeltaX / 200, 1);
          setXTransform(100 - progress * 100);
        } else if (deltaX > 0 && isDetailView) {
          const progress = Math.min(absDeltaX / 200, 1);
          setXTransform(progress * 100);
        }
      }
    },
    [isDragging, dragStart, dragDirection, currentIndex, isDetailView],
  );

  // 드래그 종료
  const handleEnd = useCallback(() => {
    if (!isDragging) return;
    setIsDragging(false);

    const deltaX = dragCurrent.x - dragStart.x;
    const deltaY = dragCurrent.y - dragStart.y;

    if (dragDirection === 'vertical') {
      const minSwipeDistance = 50;

      if (Math.abs(deltaY) > minSwipeDistance) {
        if (deltaY < 0) goToNextItem();
        else goToPrevItem();
      } else {
        setYScroll(currentIndex * window.innerHeight);
      }
    } else if (dragDirection === 'horizontal') {
      const minSwipeDistance = 80;

      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX < 0 && !isDetailView) toggleDetailView(true);
        else if (deltaX > 0 && isDetailView) toggleDetailView(false);
        else setXTransform(isDetailView ? 0 : 100);
      } else {
        setXTransform(isDetailView ? 0 : 100);
      }
    }

    // 상태 초기화
    setDragDirection('none');
  }, [
    isDragging,
    dragCurrent,
    dragStart,
    dragDirection,
    currentIndex,
    isDetailView,
    goToNextItem,
    goToPrevItem,
    toggleDetailView,
  ]);

  // 마우스 이벤트 핸들러
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      handleStart(e.clientX, e.clientY);
    },
    [handleStart],
  );

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      handleMove(e.clientX, e.clientY);
    },
    [handleMove],
  );

  const handleMouseUp = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  // 터치 이벤트 핸들러
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      handleStart(touch.clientX, touch.clientY);
    },
    [handleStart],
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      const touch = e.touches[0];
      handleMove(touch.clientX, touch.clientY);
    },
    [handleMove],
  );

  const handleTouchEnd = useCallback(() => {
    handleEnd();
  }, [handleEnd]);

  return {
    // State
    currentIndex,
    isDetailView,
    xTransform,
    yScroll,
    dragDirection,
    isDragging,

    // Actions
    goToNextItem,
    goToPrevItem,
    goToItem,
    toggleDetailView,

    // Event handlers
    handlers: {
      onMouseDown: handleMouseDown,
      onMouseMove: isDragging ? handleMouseMove : undefined,
      onMouseUp: handleMouseUp,
      onMouseLeave: handleMouseUp,
      onTouchStart: handleTouchStart,
      onTouchMove: handleTouchMove,
      onTouchEnd: handleTouchEnd,
    },
  };
};

export default useSwipeGestures;
