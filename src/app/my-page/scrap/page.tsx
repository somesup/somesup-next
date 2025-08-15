'use client';

import Link from 'next/link';
import Image from 'next/image';
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

export default function ScrapsPage() {
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

      const res = await getScrapedArticles(PAGE_SIZE, page.nextCursor, true);

      if (res.error) return;

      const nextPage = res.pagination
        ? { hasNext: res.pagination.hasNext, nextCursor: res.pagination.nextCursor }
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

  const cards = useMemo(() => items.map(a => <ArticleCard key={`${a.createdAt}-${a.id}`} article={a} />), [items]);

  return (
    <main className="flex min-h-screen w-full max-w-mobile flex-col items-center bg-gray-10 text-[#FAFAFA]">
      <header className="mb-3 w-full pb-11 pt-7">
        <div className="relative flex items-center justify-center px-10">
          <Link href="/my-page" aria-label="뒤로가기" className="absolute left-4 top-1/2 -translate-y-1/2 rounded p-1">
            <FaChevronLeft className="h-5 w-5" />
          </Link>
          <h1 className="text-center typography-small-title">스크랩 기사</h1>
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
}

function ArticleCard({ article }: { article: NewsDto }) {
  return (
    <a href={`/scrap/${article.id}`} className="group relative block overflow-hidden rounded-xl">
      <div className="relative aspect-[10/16] w-full overflow-hidden after:pointer-events-none after:absolute after:inset-x-0 after:bottom-0 after:z-[1] after:h-2/3 after:bg-gradient-to-t after:from-[#171717]/100 after:via-[#171717]/60 after:to-transparent after:content-['']">
        <Image
          src={article.thumbnailUrl}
          alt={article.title}
          fill
          sizes="(max-width: 768px) 50vw, 200px"
          className="z-0 h-full w-full object-cover object-center"
        />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] p-2">
          <p className="break-keep leading-snug typography-caption2">{article.title}</p>
        </div>
      </div>
    </a>
  );
}
