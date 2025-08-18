'use client';

import NewsAbstractView from '@/components/features/news/news-abstract-view';
import NewsDetailView from '@/components/features/news/news-detail-view';
import PageSelector from '@/components/ui/page-selector';
import { postArticleEvent } from '@/lib/apis/apis';
import useFetchArticles from '@/lib/hooks/useFetchArticles';
import useSwipeGestures from '@/lib/hooks/useSwipeGestures';
import Image from 'next/image';
import { useCallback } from 'react';

const FETCH_THRESHOLD = 5;

const HomePage = () => {
  const { articles, isNextLoading, pagination, fetchNextArticles } = useFetchArticles(0);

  const { currentIndex, xTransform, yScroll, handlers } = useSwipeGestures({
    itemsLength: articles.length + 1,
    onItemChange: useCallback(
      async (index: number) => {
        if (articles[index]?.id) postArticleEvent(articles[index].id, 'VIEW');
        if (articles.length - index <= FETCH_THRESHOLD && !isNextLoading && pagination.hasNext) fetchNextArticles();
      },
      [articles, isNextLoading, pagination.hasNext, fetchNextArticles],
    ),
    onDetailToggle: useCallback(
      (index: number, isDetail: boolean) =>
        isDetail && articles[index]?.id && postArticleEvent(articles[index].id, 'DETAIL_VIEW'),
      [articles],
    ),
  });

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <PageSelector style={{ opacity: xTransform / 100 }} />

      {/* 메인 컨테이너 */}
      <div className="relative h-full w-full select-none" {...handlers}>
        {/* Abstract Views Container */}
        <div
          className="absolute inset-0 transition-transform duration-300 ease-out"
          style={{ transform: `translateY(-${yScroll}px)` }}
        >
          {articles.map(item => (
            <NewsAbstractView key={item.id} {...item} />
          ))}

          {/* 로딩 인디케이터 */}
          {pagination.hasNext && (
            <div className="flex h-full w-full items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
            </div>
          )}

          {/* 뉴스 모두 확인 */}
          {!pagination?.hasNext && (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-center">
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
              <p className="!font-normal typography-small-title">벌써 {articles.length}개의 소식을 읽었어요</p>
            </div>
          )}
        </div>

        {/* Detail View */}
        <div
          className="absolute inset-0 transform transition-transform duration-300 ease-out"
          style={{ transform: `translateX(${xTransform}%)` }}
        >
          <NewsDetailView fullSummary={articles[currentIndex]?.fullSummary} />
        </div>
      </div>
    </div>
  );
};

export default HomePage;
