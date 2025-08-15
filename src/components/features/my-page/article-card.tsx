import Image from 'next/image';
import { NewsDto } from '@/types/dto';

const ArticleCard = ({ article, index }: { article: NewsDto; index: number }) => {
  return (
    <a href={`/scrap?index=${index}`} className="group relative block overflow-hidden rounded-xl">
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
};

export default ArticleCard;
