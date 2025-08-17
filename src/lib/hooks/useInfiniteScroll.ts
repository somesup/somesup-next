import { APIResult } from '@/types/dto';
import { useCallback, useEffect, useRef, useState } from 'react';

type UseInfiniteScrollProps<T> = {
  fetcher: (cursor: string) => Promise<APIResult<T[]>>;
  initialLoad?: boolean;
};

type UseInfiniteScrollReturn<T> = {
  items: T[];
  loading: boolean;
  error: boolean;
  hasNext: boolean;
  isEmpty: boolean;
  isLastPage: boolean;
  sentinelRef: React.RefObject<HTMLDivElement>;
  loadMore: () => void;
};

export const useInfiniteScroll = <T>({
  fetcher,
  initialLoad = true,
}: UseInfiniteScrollProps<T>): UseInfiniteScrollReturn<T> => {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  const [hasNext, setHasNext] = useState(true);
  const [nextCursor, setNextCursor] = useState('');

  const sentinelRef = useRef<HTMLDivElement>(null);
  const fetchingRef = useRef(false);
  const isInitializedRef = useRef(false);

  const loadMore = useCallback(async () => {
    if (fetchingRef.current || !hasNext) return;

    try {
      fetchingRef.current = true;
      setLoading(true);
      setError(false);

      const { error, data, pagination } = await fetcher(nextCursor);

      if (!error) {
        const newItems = data || [];
        setItems(prev => [...prev, ...newItems]);
        setHasNext(pagination?.hasNext ?? false);
        setNextCursor(pagination?.nextCursor ?? '');
        return;
      }

      if (error.status === 404) {
        setHasNext(false);
        return setNextCursor('');
      } else return setError(true);
    } catch (err) {
      console.error('Failed to load more items:', err);
      setError(true);
    } finally {
      setLoading(false);
      fetchingRef.current = false;
    }
  }, [fetcher, nextCursor, hasNext]);

  useEffect(() => {
    if (!initialLoad || !!isInitializedRef.current) return;
    isInitializedRef.current = true;
    loadMore();
  }, [initialLoad, loadMore]);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel) return;

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && hasNext && !loading && !error) loadMore();
    });

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [loadMore, hasNext, loading, error]);

  const isEmpty = items.length === 0 && !loading && !error;
  const isLastPage = !hasNext && !loading && items.length > 0;

  return {
    items,
    loading,
    error,
    hasNext,
    isEmpty,
    isLastPage,
    sentinelRef,
    loadMore,
  };
};
