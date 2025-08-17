import { MouseEvent, useState } from 'react';
import { GoBookmark } from 'react-icons/go';
import { GoBookmarkFill } from 'react-icons/go';
import { GoHeartFill } from 'react-icons/go';
import { GoHeart } from 'react-icons/go';
import { deleteArticleLike, deleteArticleScrap, postArticleLike, postArticleScrap } from '@/lib/apis/apis';
import { NewsDto } from '@/types/dto';
import NewsProvider from './news-provider';
import { toast } from '@/components/ui/toast';

type NewsAbstractViewProps = Pick<
  NewsDto,
  'id' | 'title' | 'oneLineSummary' | 'section' | 'like' | 'scrap' | 'providers'
>;

const NewsAbstractView = (news: NewsAbstractViewProps) => {
  const [isLiked, setIsLiked] = useState(news.like.isLiked);
  const [likeCount, setLikeCount] = useState(news.like.count);
  const [isScraped, setIsScrapped] = useState(news.scrap.isScraped);

  const handleToggleLike = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isLiked) {
      setLikeCount(prev => prev - 1);
      setIsLiked(false);
      const { error } = await deleteArticleLike(news.id);
      if (error) {
        setLikeCount(prev => prev + 1);
        setIsLiked(true);
      }
    } else {
      setLikeCount(prev => prev + 1);
      setIsLiked(true);
      const { error } = await postArticleLike(news.id);
      if (error) {
        setLikeCount(prev => prev - 1);
        setIsLiked(false);
      }
    }
  };

  const handleToggleScrap = async (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isScraped) {
      setIsScrapped(false);
      const { error } = await deleteArticleScrap(news.id);
      if (error) setIsScrapped(true);
    } else {
      setIsScrapped(true);
      toast.scrap();
      const { error } = await postArticleScrap(news.id);
      if (error) setIsScrapped(false);
    }
  };

  return (
    <section className="relative h-full w-full flex-shrink-0 overflow-hidden transition-opacity duration-300">
      <div className="absolute bottom-0 px-8 pb-8">
        <div className="flex justify-between gap-4">
          <div>
            <span className="rounded-xl border border-gray-60 px-1.5 py-0.5 typography-caption">
              {news.section.friendlyName}
            </span>
            <h2 className="line-clamp-2 break-keep typography-sub-title-bold">{news.title}</h2>
          </div>
          <div className="flex flex-col items-center justify-end gap-3">
            <button className="flex touch-manipulation flex-col" onClick={handleToggleLike}>
              {isLiked ? <GoHeartFill color="#FF3F62" size="26" /> : <GoHeart size="26" />}
              <span className="!leading-3 typography-caption">{likeCount}</span>
            </button>
            <button className="touch-manipulation" onClick={handleToggleScrap}>
              {isScraped ? <GoBookmarkFill color="#FAFAFA" size="30" /> : <GoBookmark size="30" />}
            </button>
          </div>
        </div>
        <hr className="my-4" />
        <p className="line-clamp-3 break-keep typography-body2">{news.oneLineSummary}</p>
        <div className="text-right">
          <NewsProvider items={news.providers} />
        </div>
      </div>
    </section>
  );
};

export default NewsAbstractView;
