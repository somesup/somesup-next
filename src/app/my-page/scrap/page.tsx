'use client';

import Link from 'next/link';
import { FaChevronLeft } from 'react-icons/fa6';
import ArticleCard from '@/components/features/my-page/article-card';
import { useInfiniteScroll } from '@/lib/hooks/useInfiniteScroll';
import { getArticles } from '@/lib/apis/apis';
import type { NewsDto } from '@/types/dto';
import { GoBookmarkFill } from 'react-icons/go';

const ScrapsPage = () => {
  const { items, loading, sentinelRef, isEmpty, isLastPage } = useInfiniteScroll<NewsDto>({
    fetcher: (cursor: string) => getArticles({ cursor, limit: 8, scraped: true }),
  });

  return (
    <main className="flex min-h-screen w-full max-w-mobile flex-col items-center bg-gray-10 text-[#FAFAFA]">
      <header className="mb-3 w-full pt-7">
        <div className="relative flex items-center justify-center px-10">
          <Link href="/my-page" aria-label="뒤로가기" className="absolute left-4 top-1/2 -translate-y-1/2 rounded p-1">
            <FaChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-center typography-small-title">스크랩 목록</h1>
        </div>
      </header>

      <div className="flex w-full flex-1 flex-col px-10 py-10">
        {isEmpty && !loading ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-14">
            <GoBookmarkFill className="h-8 w-8 text-gray-60" />
            <p className="text-center typography-body2">
              아직 스크랩한 기사가 없어요.
              <br />
              관심 기사를 스크랩 해보세요!
            </p>
          </div>
        ) : (
          <>
            <section className="grid grid-cols-2 gap-x-3 gap-y-2">
              {items.map((article, index) => (
                <ArticleCard key={article.id} article={article} index={index} />
              ))}
            </section>
            <div ref={sentinelRef} className="h-10 w-full" />
            <>
              {isLastPage && items.length > 0 && (
                <p className="py-6 text-center typography-caption2">마지막 기사입니다.</p>
              )}
              {loading && (
                <div className="flex w-full items-center justify-center py-6">
                  <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-[#FAFAFA]" />
                </div>
              )}
            </>
          </>
        )}
      </div>
    </main>
  );
};

export default ScrapsPage;
