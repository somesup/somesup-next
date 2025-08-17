'use client';

import Image from 'next/image';
import { useEffect, useState, useRef, useCallback } from 'react';
import NewsCard from '@/components/features/news/news-card';
import { getArticles } from '@/lib/apis/apis';
import { NewsDto, PaginationDto } from '@/types/dto';
import PageSelector from '@/components/ui/page-selector';
import { isDailyUnread } from '@/lib/utils/news-daily';
import { toast } from '@/components/ui/toast';

const HomePage = () => {
  const [newsList, setNewsList] = useState<NewsDto[]>([]);
  const [pagination, setPagination] = useState<PaginationDto | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentView, setCurrentView] = useState<'abstract' | 'detail'>('abstract');
  const [isScrolling, setIsScrolling] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isTouching, setIsTouching] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);

  const [swipeDirection, setSwipeDirection] = useState<'vertical' | 'horizontal' | null>(null);
  const [touchLocked, setTouchLocked] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();
  const touchStartY = useRef<number>(0);
  const touchCurrentY = useRef<number>(0);
  const touchStartX = useRef<number>(0);
  const touchCurrentX = useRef<number>(0);
  const initialScrollTop = useRef<number>(0);
  const cardHeight = useRef<number>(0);
  const animationFrameRef = useRef<number>();
  const isProcessingSwipe = useRef<boolean>(false);
  const swipeThreshold = 10;

  const scrollToIndex = useCallback(
    (index: number, behavior: 'instant' | 'smooth' = 'instant') => {
      if (!containerRef.current) return;

      if (isAnimating && behavior === 'smooth') {
        setPendingIndex(index);
        return;
      }

      setIsAnimating(behavior === 'smooth');

      containerRef.current.scrollTo({
        top: index * cardHeight.current,
        behavior,
      });

      if (behavior === 'smooth') {
        const checkScrollComplete = () => {
          const currentScrollTop = containerRef.current?.scrollTop || 0;
          const targetScrollTop = index * cardHeight.current;

          if (Math.abs(currentScrollTop - targetScrollTop) < 1) {
            setIsAnimating(false);
            if (pendingIndex !== null) {
              const nextIndex = pendingIndex;
              setPendingIndex(null);
              setTimeout(() => scrollToIndex(nextIndex, 'smooth'), 50);
            }
          } else {
            animationFrameRef.current = requestAnimationFrame(checkScrollComplete);
          }
        };
        animationFrameRef.current = requestAnimationFrame(checkScrollComplete);
      }
    },
    [isAnimating, pendingIndex],
  );

  const updateCardHeight = useCallback(() => {
    cardHeight.current = window.innerHeight;
  }, []);

  const fetchNews = useCallback(
    async (isInitial = false) => {
      if (isLoading && !isInitial) return;

      try {
        setIsLoading(true);
        const prevLength = newsList.length;

        const result = await getArticles({ cursor: pagination?.nextCursor || '' });
        if (result.error) {
          console.error('Failed to fetch articles:', result.error);
          return;
        }

        setNewsList(prev => [...prev, ...result.data]);
        setPagination(result.pagination || null);

        if (!isInitial) {
          setTimeout(() => {
            scrollToIndex(prevLength);
            setCurrentIndex(prevLength);
          }, 100);
        }
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setIsLoading(false);
      }
    },
    [pagination?.nextCursor, newsList.length, isLoading, scrollToIndex],
  );

  const handleScroll = useCallback(() => {
    if (!containerRef.current || isLoading || isTouching || isAnimating) return;

    setIsScrolling(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);

      const scrollTop = containerRef.current?.scrollTop || 0;
      const newIndex = Math.round(scrollTop / cardHeight.current);

      if (newIndex === currentIndex) return;

      setCurrentIndex(newIndex);

      if (newIndex >= newsList.length - 5 && pagination?.hasNext && !isLoading) {
        fetchNews();
      }
    }, 100);
  }, [currentIndex, newsList.length, pagination?.hasNext, fetchNews, isLoading, isTouching, isAnimating]);

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      if (currentView === 'detail' || isAnimating || isProcessingSwipe.current) return;

      setIsTouching(true);
      setSwipeDirection(null);
      setTouchLocked(false);

      touchStartY.current = e.touches[0].clientY;
      touchCurrentY.current = e.touches[0].clientY;
      touchStartX.current = e.touches[0].clientX;
      touchCurrentX.current = e.touches[0].clientX;
      initialScrollTop.current = containerRef.current?.scrollTop || 0;

      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);

      setIsAnimating(false);
      setPendingIndex(null);

      if (containerRef.current) containerRef.current.style.scrollSnapType = 'none';
    },
    [currentView, isAnimating],
  );

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (currentView === 'detail' || !isTouching || isProcessingSwipe.current) return;

      touchCurrentY.current = e.touches[0].clientY;
      touchCurrentX.current = e.touches[0].clientX;

      const deltaY = Math.abs(touchStartY.current - touchCurrentY.current);
      const deltaX = Math.abs(touchStartX.current - touchCurrentX.current);

      if (!swipeDirection && (deltaY > swipeThreshold || deltaX > swipeThreshold)) {
        if (deltaY > deltaX) {
          setSwipeDirection('vertical');
          setTouchLocked(false);
        } else {
          setSwipeDirection('horizontal');
          setTouchLocked(true);
          return;
        }
      }

      if (swipeDirection === 'horizontal' || touchLocked) {
        e.preventDefault();
        return;
      }

      if (swipeDirection === 'vertical') {
        e.preventDefault();

        const verticalDelta = touchStartY.current - touchCurrentY.current;
        const amplifiedDelta = verticalDelta * 1.5;

        const newScrollTop = Math.max(0, initialScrollTop.current + amplifiedDelta);
        const maxScrollTop = Math.max(0, (newsList.length - 1) * cardHeight.current);
        const clampedScrollTop = Math.min(newScrollTop, maxScrollTop);

        if (containerRef.current) {
          containerRef.current.scrollTop = clampedScrollTop;
        }
      }
    },
    [currentView, isTouching, newsList.length, swipeDirection, touchLocked],
  );

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (currentView === 'detail' || !isTouching || isProcessingSwipe.current) return;

      isProcessingSwipe.current = true;
      setIsTouching(false);

      if (swipeDirection === 'horizontal' || touchLocked) {
        setSwipeDirection(null);
        setTouchLocked(false);
        isProcessingSwipe.current = false;
        if (containerRef.current) {
          containerRef.current.style.scrollSnapType = 'y mandatory';
        }
        return;
      }

      if (containerRef.current) containerRef.current.style.scrollSnapType = 'y mandatory';

      const touchEndY = e.changedTouches[0].clientY;
      const deltaY = touchStartY.current - touchEndY;

      const isSwiped = Math.abs(deltaY) > 60;

      const currentScrollTop = containerRef.current?.scrollTop || 0;
      const currentFloatIndex = currentScrollTop / cardHeight.current;

      let targetIndex: number;

      if (isSwiped) {
        if (deltaY > 0) targetIndex = Math.min(Math.ceil(currentFloatIndex), newsList.length - 1);
        else targetIndex = Math.max(Math.floor(currentFloatIndex), 0);
      } else {
        targetIndex = Math.round(currentFloatIndex);
      }

      targetIndex = Math.max(0, Math.min(targetIndex, newsList.length - 1));

      setTimeout(() => {
        scrollToIndex(targetIndex, 'smooth');
        setCurrentIndex(targetIndex);

        if (targetIndex >= newsList.length - 5 && pagination?.hasNext && !isLoading) {
          fetchNews();
        }

        setSwipeDirection(null);
        setTouchLocked(false);

        setTimeout(() => {
          isProcessingSwipe.current = false;
        }, 100);
      }, 50);
    },
    [
      currentView,
      isTouching,
      newsList.length,
      scrollToIndex,
      pagination?.hasNext,
      fetchNews,
      isLoading,
      swipeDirection,
      touchLocked,
    ],
  );

  useEffect(() => {
    updateCardHeight();
    const handleResize = () => {
      updateCardHeight();
      setTimeout(() => scrollToIndex(currentIndex), 100);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [currentIndex, scrollToIndex, updateCardHeight]);

  useEffect(() => {
    const unread = isDailyUnread();
    if (unread) toast.fiveNews();

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });

    if (currentView !== 'detail') {
      container.addEventListener('touchstart', handleTouchStart, { passive: true });
      container.addEventListener('touchmove', handleTouchMove, { passive: false });
      container.addEventListener('touchend', handleTouchEnd, { passive: true });
    }

    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (currentView !== 'detail') {
        container.removeEventListener('touchstart', handleTouchStart);
        container.removeEventListener('touchmove', handleTouchMove);
        container.removeEventListener('touchend', handleTouchEnd);
      }
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [handleScroll, handleTouchStart, handleTouchMove, handleTouchEnd, currentView]);

  useEffect(() => {
    fetchNews(true);
  }, []);

  return (
    <div className="fixed h-full w-full max-w-mobile bg-black">
      <div className={currentView === 'abstract' ? 'opacity-100' : 'opacity-0'}>
        <PageSelector />
      </div>
      <div
        ref={containerRef}
        className={`h-full w-full snap-y snap-mandatory overscroll-none ${
          isScrolling && !isTouching ? 'scroll-auto' : 'scroll-smooth'
        } ${currentView === 'detail' ? 'overflow-y-hidden' : 'overflow-y-auto'}`}
        style={{
          touchAction: currentView === 'detail' ? 'none' : 'pan-y',
          WebkitOverflowScrolling: 'touch',
          scrollSnapType: isTouching ? 'none' : 'y mandatory',
          transform: 'translateZ(0)',
          willChange: 'scroll-position',
        }}
      >
        {newsList.map((news, index) => (
          <div key={news.id} className="h-screen w-full flex-shrink-0 snap-start snap-always">
            <NewsCard
              news={news}
              active={currentIndex === index}
              onViewChange={setCurrentView}
              disableHorizontalDrag={swipeDirection === 'vertical'}
            />
          </div>
        ))}

        {isLoading && (
          <div className="flex h-full w-full snap-start snap-always items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
          </div>
        )}

        {!pagination?.hasNext && newsList.length > 0 && (
          <div className="flex h-full w-full snap-start snap-always flex-col items-center justify-center gap-2 text-center">
            <p className="typography-sub-title">
              오늘의 뉴스를
              <br />
              모두 확인했어요 !
            </p>
            <Image
              className="aspect-square w-[17.5rem]"
              src="/images/thumbs-up.png"
              alt="thumbs-up"
              width={280}
              height={280}
            />
            <p className="!font-normal typography-small-title">벌써 {newsList.length}개의 소식을 읽었어요</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
