'use client';

import Image from 'next/image';
import NewsDetailView from './news-detail-view';
import NewsAbstractView from './news-abstract-view';
import { useNewsDrag } from '@/lib/hooks/useNewsDrag';
import { NewsDto } from '@/types/dto';

const NewsCard = (news: NewsDto) => {
  const { isDragging, containerRef, handlers, getProgress } = useNewsDrag();

  const progress = getProgress();
  const detailTranslateX = (1 - progress) * (containerRef.current?.offsetWidth || 0);
  const opacity = 1 - progress;

  return (
    <div className="relative h-screen w-full touch-pan-y select-none overflow-hidden overscroll-none">
      {/* background */}
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
      <div
        ref={containerRef}
        className="relative h-full cursor-grab touch-pan-x overscroll-x-none active:cursor-grabbing"
        style={{ touchAction: 'pan-x' }}
        {...handlers}
      >
        <div className="absolute inset-0" style={{ opacity }}>
          <NewsAbstractView {...news} />
        </div>
        <div
          className={`absolute inset-0 transition-transform ease-out ${isDragging ? 'duration-0' : 'duration-300'}`}
          style={{ transform: `translateX(${detailTranslateX}px)` }}
        >
          <NewsDetailView fullSummary={news.fullSummary} />
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
