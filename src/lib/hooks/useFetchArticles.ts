import { ArticlesRequestDto, NewsDto } from '@/types/dto';
import { useEffect, useState, useCallback, useRef } from 'react';
import { getArticles } from '../apis/apis';
import { toast } from '@/components/ui/toast';

const getCursor = (index: number, prev: boolean, limit: number) => {
  if (prev) {
    const readingIndex = Math.max(index - limit, 0);
    const cursor = btoa(`{"idx":${readingIndex + 1}}`);
    return { nextIndex: readingIndex, cursor, limit: Math.min(index - readingIndex, limit), hasPrev: readingIndex > 0 };
  }
  const cursor = btoa(`{"idx":${index + 1}}`);
  return { nextIndex: index + limit, cursor, limit, hasPrev: index > 0 };
};

const useFetchArticles = (index: number, options?: Omit<ArticlesRequestDto, 'cursor'>) => {
  const [articles, setArticles] = useState<NewsDto[]>([]);
  const [pagination, setPagination] = useState({ hasPrev: index > 0, hasNext: true });
  const [fetchState, setFetchState] = useState({ start: index, end: index });

  const limit = options?.limit || 15;
  const optionsRef = useRef(options);
  const isPrevLoading = useRef(false);
  const isNextLoading = useRef(false);

  const fetchNextArticles = useCallback(async () => {
    if (isNextLoading.current || !pagination.hasNext) return 0;

    isNextLoading.current = true;

    try {
      const { cursor } = getCursor(fetchState.end, false, limit);
      const { error: apiError, data, pagination: newPagination } = await getArticles({ cursor, ...options, limit });

      if (apiError?.status === 404) return setPagination(prev => ({ ...prev, hasNext: false })) ?? 0;
      if (apiError) return toast.serverError() ?? 0;

      if (newPagination) setPagination(prev => ({ ...prev, ...newPagination }));
      setArticles(prev => [...prev, ...data]);
      setFetchState(prev => ({ ...prev, end: prev.end + data.length }));
      return data.length;
    } catch (e) {
      console.error('Failed to fetch next articles:', e);
      return 0;
    } finally {
      isNextLoading.current = false;
    }
  }, [options, fetchState.end, pagination.hasNext, limit, isNextLoading]);

  const fetchPrevArticles = useCallback(async () => {
    if (isPrevLoading.current || !pagination.hasPrev) return 0;

    isPrevLoading.current = true;

    try {
      const { cursor, limit: actualLimit, hasPrev: newHasPrev } = getCursor(fetchState.start, true, limit);
      const { error: apiError, data } = await getArticles({ cursor, ...options, limit: actualLimit });

      if (apiError?.status === 404) return setPagination(prev => ({ ...prev, hasPrev: false })) ?? 0;
      if (apiError) return toast.serverError() ?? 0;

      setArticles(prev => [...data, ...prev]);
      setFetchState(prev => ({ ...prev, start: prev.start - data.length }));
      setPagination(prev => ({ ...prev, hasPrev: newHasPrev }));
      return data.length;
    } catch (e) {
      console.error('Failed to fetch prev articles:', e);
      return 0;
    } finally {
      isPrevLoading.current = false;
    }
  }, [options, fetchState.start, pagination.hasPrev, limit, isPrevLoading]);

  useEffect(() => {
    const optionsChanged = JSON.stringify(optionsRef.current) !== JSON.stringify(options);

    if (optionsChanged) {
      optionsRef.current = options;
      setArticles([]);
      setFetchState({ start: index, end: index });
      setPagination({ hasPrev: index > 0, hasNext: true });

      fetchNextArticles();
    }
  }, [options]);

  useEffect(() => void fetchNextArticles(), []);

  return {
    articles,
    isNextLoading: isNextLoading.current,
    isPrevLoading: isPrevLoading.current,
    pagination,
    fetchState,
    fetchNextArticles,
    fetchPrevArticles,
  };
};

export default useFetchArticles;
