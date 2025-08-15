'use client';

import NewsCard from '@/components/features/news/news-card';
import { getArticle } from '@/lib/apis/apis';
import { NewsDto } from '@/types/dto';
import { useEffect, useState } from 'react';
import { MdKeyboardArrowLeft } from 'react-icons/md';

const ScrapPage = ({ params }: { params: { scrapId: string } }) => {
  const [article, setArticle] = useState<null | NewsDto>(null);
  const [currentView, setCurrentView] = useState<'abstract' | 'detail'>('abstract');

  useEffect(() => {
    const get = async () => {
      const { error, data } = await getArticle(Number(params.scrapId));
      console.log(article, error);
      if (!error) setArticle(data);
    };
    get();
  }, []);

  if (!article) return;
  return (
    <div>
      <div
        className={`fixed left-1/2 top-5 z-50 flex w-full max-w-mobile -translate-x-1/2 justify-center ${currentView === 'abstract' ? 'opacity-100' : 'opacity-0'}`}
      >
        <a href="/my-page/scrap" className="absolute left-4 top-1/2 -translate-y-1/2">
          <MdKeyboardArrowLeft size={28} />
        </a>
        <span>스크랩 기사</span>
      </div>
      <NewsCard news={article} active onViewChange={setCurrentView} />
    </div>
  );
};

export default ScrapPage;
