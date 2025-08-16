'use client';

import Link from 'next/link';
import ArticleCard from '@/components/features/my-page/article-card';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { FaChevronLeft } from 'react-icons/fa6';

import type { NewsDto } from '@/types/dto';
import { getScrapedArticles } from '@/lib/apis/apis';

type PageState = { hasNext: boolean; nextCursor?: string };

const PAGE_SIZE = 8;

function isElementInViewport(el: HTMLElement) {
  const r = el.getBoundingClientRect();
  const vh = window.innerHeight || document.documentElement.clientHeight;

  return r.top < vh && r.bottom > 0;
}

const ScrapsPage = () => {
  const [items, setItems] = useState<NewsDto[]>([]);
  const [page, setPage] = useState<PageState>({ hasNext: true, nextCursor: undefined });
  const [loading, setLoading] = useState(false);

  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const fetchingRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (fetchingRef.current) return;
    if (!page.hasNext && items.length > 0) return;

    try {
      fetchingRef.current = true;
      setLoading(true);

      const res = await getScrapedArticles(PAGE_SIZE, page.nextCursor ?? undefined, true);

      if (res.error) return;

      const nextPage = res.pagination
        ? { hasNext: res.pagination.hasNext, nextCursor: res.pagination.nextCursor ?? undefined }
        : { hasNext: false, nextCursor: undefined };

      if (res.data?.length) setItems(prev => [...prev, ...res.data]);
      setPage(nextPage);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [page.hasNext, page.nextCursor, items.length]);

  useEffect(() => {
    loadMore();
  }, []);

  useEffect(() => {
    const el = sentinelRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) loadMore();
      },
      { root: null, rootMargin: '160px 0px', threshold: 0.01 },
    );

    io.observe(el);
    return () => io.disconnect();
  }, [loadMore]);

  useEffect(() => {
    if (!loading && page.hasNext && sentinelRef.current && isElementInViewport(sentinelRef.current)) {
      const id = requestAnimationFrame(() => loadMore());
      return () => cancelAnimationFrame(id);
    }
  }, [items.length, loading, page.hasNext, loadMore]);

  const cards = useMemo(
    () => items.map((a, i) => <ArticleCard key={`${a.createdAt}-${a.id}`} article={a} index={i} />),
    [items],
  );

  return (
    <main className="flex min-h-screen w-full max-w-mobile flex-col items-center bg-gray-10 text-[#FAFAFA]">
      <header className="mb-3 w-full pb-11 pt-7">
        <div className="relative flex items-center justify-center px-10">
          <Link href="/my-page" aria-label="뒤로가기" className="absolute left-4 top-1/2 -translate-y-1/2 rounded p-1">
            <FaChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-center typography-small-title">스크랩 목록</h1>
        </div>
      </header>

      <div className="relative h-full w-full px-10 pb-20">
        <section className="grid grid-cols-2 gap-x-3 gap-y-2">{cards}</section>

        <div ref={sentinelRef} className="h-10 w-full" />

        {!page.hasNext && !loading && items.length > 0 && (
          <p className="py-6 text-center typography-caption2">마지막 기사입니다.</p>
        )}
        {loading && (
          <div className="flex w-full items-center justify-center py-6">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-[#FAFAFA]" />
          </div>
        )}
      </div>
    </main>
  );
};

export default ScrapsPage;
