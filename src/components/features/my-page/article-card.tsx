import Image from 'next/image';
import { NewsDto } from '@/types/dto';

const ArticleCard = ({ article, index }: { article: NewsDto; index: number }) => {
  return (
    <a href={`/scrap?index=${index}`} className="relative block overflow-hidden rounded-xl">
      <div
        style={{ backgroundImage: `url(${article.thumbnailUrl})` }}
        className="relative aspect-[10/16] w-full bg-cover bg-center bg-no-repeat after:absolute after:inset-0 after:bg-[linear-gradient(to_top,theme(colors.gray.10)_0%,theme(colors.gray.10/0.4)_43%,transparent_64%,transparent_100%)] after:content-['']"
      >
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-[2] p-4">
          <p className="break-keep leading-snug typography-caption2">{article.title}</p>
        </div>
      </div>
    </a>
  );
};

export default ArticleCard;
