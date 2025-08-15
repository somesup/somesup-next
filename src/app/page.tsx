'use client';

import Image from 'next/image';
import { useEffect, useState, useRef, useCallback } from 'react';
import NewsCard from '@/components/features/news/news-card';
import { getArticles } from '@/lib/apis/apis';
import { NewsDto, PaginationDto } from '@/types/dto';

const HomePage = () => {
  const [newsList, setNewsList] = useState<NewsDto[]>([]);
  const [pagination, setPagination] = useState<PaginationDto | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentView, setCurrentView] = useState<'abstract' | 'detail'>('abstract');
  const [isScrolling, setIsScrolling] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollTimeoutRef = useRef<NodeJS.Timeout>();

  const scrollToIndex = useCallback((index: number) => {
    if (!containerRef.current) return;
    containerRef.current.scrollTo({ top: index * window.innerHeight, behavior: 'instant' });
  }, []);

  const fetchNews = useCallback(async () => {
    if (isLoading) return;

    try {
      setIsLoading(true);
      const prevLength = newsList.length;

      const result = await getArticles({ cursor: pagination?.nextCursor || '' });
      if (result.error) return console.error('Failed to fetch articles:', result.error);

      setNewsList(prev => [...prev, ...result.data]);
      setPagination(result.pagination || null);

      setTimeout(() => {
        scrollToIndex(prevLength);
        setCurrentIndex(prevLength);
      }, 100);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setIsLoading(false);
    }
  }, [pagination?.nextCursor, newsList.length, isLoading, scrollToIndex]);

  const handleScroll = useCallback(() => {
    if (!containerRef.current || isLoading) return;

    setIsScrolling(true);
    if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);

    scrollTimeoutRef.current = setTimeout(() => {
      setIsScrolling(false);

      const scrollTop = containerRef.current?.scrollTop || 0;
      const cardHeight = window.innerHeight;
      const newIndex = Math.round(scrollTop / cardHeight);

      if (newIndex === currentIndex) return;

      setCurrentIndex(newIndex);

      if (newIndex >= newsList.length - 5 && pagination?.hasNext && !isLoading) fetchNews();
    }, 100);
  }, [currentIndex, newsList.length, pagination?.hasNext, fetchNews, isLoading]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      container.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, [handleScroll]);

  useEffect(() => {
    fetchNews();
  }, []);

  return (
    <div className="fixed h-full w-full max-w-mobile bg-black">
      <div
        ref={containerRef}
        className={`h-full w-full snap-y snap-mandatory overscroll-none ${isScrolling ? 'scroll-auto' : 'scroll-smooth'} ${currentView === 'detail' ? 'overflow-y-hidden' : 'overflow-y-auto'} `}
      >
        {newsList.map((news, index) => (
          <div key={news.id} className="h-screen w-full flex-shrink-0 snap-start snap-always">
            <NewsCard news={news} active={currentIndex === index} onViewChange={setCurrentView} />
          </div>
        ))}

        {/* 로딩 인디케이터 */}
        {!!pagination?.hasNext && (
          <div className="flex h-full w-full snap-start snap-always items-center justify-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
          </div>
        )}

        {/* 뉴스 모두 확인 */}
        {!pagination?.hasNext && (
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
