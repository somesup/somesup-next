'use client';

import { useCallback } from 'react';
import Image from 'next/image';
import { useSearchParams } from 'next/navigation';
import NewsAbstractView from '@/components/features/news/news-abstract-view';
import NewsDetailView from '@/components/features/news/news-detail-view';
import PageSelector from '@/components/ui/page-selector';
import { postArticleEvent } from '@/lib/apis/apis';
import useFetchArticles from '@/lib/hooks/useFetchArticles';
import useSwipeGestures from '@/lib/hooks/useSwipeGestures';
import Link from 'next/link';

const ScrapListPage = () => {
  const searchParams = useSearchParams();
  const cursor = getCursorByIndex(searchParams.get('index'));

  const { articles, isLoading, pagination } = useFetchArticles({ cursor, scraped: true });
  const { currentIndex, xTransform, yScroll, handlers } = useSwipeGestures({
    itemsLength: articles.length + 1,
    onItemChange: useCallback((index: number) => postArticleEvent(articles[index]?.id, 'VIEW'), [articles]),
    onDetailToggle: useCallback(
      (index: number, isDetail: boolean) => isDetail && postArticleEvent(articles[index]?.id, 'DETAIL_VIEW'),
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
          {isLoading && (
            <div className="flex h-full w-full snap-start snap-always items-center justify-center">
              <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-white"></div>
            </div>
          )}

          {/* 뉴스 모두 확인 */}
          {!pagination?.hasNext && (
            <div className="relative flex h-full w-full snap-start snap-always flex-col items-center justify-center gap-2 text-center">
              <p className="typography-sub-title">
                저장한 뉴스를
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
              <Link
                href="/my-page/scrap"
                className="absolute bottom-8 flex h-[3.75rem] w-[calc(100%-4rem)] items-center justify-center rounded-lg bg-gray-60 text-gray-10 typography-body1"
              >
                스크랩 목록으로 돌아가기
              </Link>
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

export default ScrapListPage;

const getCursorByIndex = (index: string | null) => {
  const numberRegex = /^\d$/;
  const indexString = index || '0';
  const idx = numberRegex.test(indexString) ? parseInt(indexString) : 0;
  return btoa(`{"idx":${idx + 1}}`);
};
