import { MouseEvent, useState } from 'react';
import Image from 'next/image';
import { GoBookmark } from 'react-icons/go';
import { GoBookmarkFill } from 'react-icons/go';
import { GoHeartFill } from 'react-icons/go';
import { GoHeart } from 'react-icons/go';
import NewsProvider from './news-provider';
import { toast } from '@/components/ui/toast';
import { deleteArticleLike, deleteArticleScrap, postArticleLike, postArticleScrap } from '@/lib/apis/apis';
import { NewsDto } from '@/types/dto';

type NewsAbstractViewProps = Pick<
  NewsDto,
  'id' | 'title' | 'oneLineSummary' | 'section' | 'like' | 'scrap' | 'providers' | 'thumbnailUrl'
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
    <section className="relative h-full w-full overflow-hidden transition-opacity duration-300">
      {/* background image */}
      <div className="absolute flex h-full w-full items-center pb-[14rem] pt-14">
        <div
          className="absolute inset-0 -z-10 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${news.thumbnailUrl})` }}
        />
        <div className="absolute -inset-2 -z-10 backdrop-blur-3xl" />
        <div className="absolute top-0 h-full w-full bg-[linear-gradient(to_bottom,black_0%,transparent_25%,transparent_50%,black_100%)]" />
        <Image width={500} height={500} alt={news.title} src={news.thumbnailUrl} priority={true} />
      </div>

      {/* content */}
      <div className="absolute bottom-0 w-full px-8 pb-8">
        <div className="flex items-baseline justify-between gap-4">
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
          <NewsProvider providers={news.providers} />
        </div>
      </div>
    </section>
  );
};

export default NewsAbstractView;
