import { ArticlesRequestDto, NewsDto, PaginationDto } from '@/types/dto';
import { useEffect, useState, useCallback, useRef } from 'react';
import { getArticles } from '../apis/apis';
import { toast } from '@/components/ui/toast';

const initialPagination: PaginationDto = { hasNext: true, nextCursor: '' };

const useFetchArticles = ({ cursor = '', ...props }: ArticlesRequestDto) => {
  const [articles, setArticles] = useState<NewsDto[]>([]);
  const [pagination, setPagination] = useState<PaginationDto>({ ...initialPagination, nextCursor: cursor });
  const [isLoading, setIsLoading] = useState(false);

  const propsRef = useRef(props);

  const fetchArticles = useCallback(async () => {
    if (!!isLoading || !pagination.hasNext) return;

    setIsLoading(true);

    try {
      const cursor = pagination.nextCursor;
      const { error: apiError, data, pagination: newPagination } = await getArticles({ cursor, ...props });

      if (apiError?.status === 404) return setPagination({ nextCursor: '', hasNext: false });
      if (apiError) return toast.serverError();

      if (newPagination) setPagination(newPagination);
      setArticles(prev => [...prev, ...data]);
    } catch (e) {
      console.error('Failed to fetch articles:', e);
    } finally {
      setIsLoading(false);
    }
  }, [props, pagination.nextCursor, pagination.hasNext, articles.length]);

  useEffect(() => {
    const propsChanged = JSON.stringify(propsRef.current) !== JSON.stringify(props);
    if (!propsChanged) return;

    propsRef.current = props;
    setArticles([]);
    setPagination(initialPagination);
    setIsLoading(true);
    fetchArticles();
  }, [props, fetchArticles]);

  useEffect(() => {
    setIsLoading(true);
    fetchArticles();
  }, []);

  return {
    articles,
    isLoading,
    pagination,
    getMore: fetchArticles,
  };
};

export default useFetchArticles;
