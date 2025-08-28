import { newsGuideData } from '@/data/news-guide';
import { useEffect, useState } from 'react';
import { FaAngleDown, FaAngleLeft, FaAngleRight, FaAngleUp } from 'react-icons/fa';
import NewsAbstractView from './news-abstract-view';
import NewsDetailView from './news-detail-view';
import { useNewsGuideStore } from '@/lib/stores/news-guide';

const NewsGuide = () => {
  const [step, setStep] = useState(1);

  if (step === 3) return null;

  return (
    <div className="absolute inset-0 z-[10]">
      {step === 1 && <FirstPage onNext={() => setStep(2)} />}
      {step === 2 && <SecondPage onNext={() => setStep(3)} />}
    </div>
  );
};

export default NewsGuide;

const FirstPage = ({ onNext }: { onNext: () => void }) => {
  const [yScroll, setYScroll] = useState(0);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setYScroll(prev => (prev === 150 ? 0 : 150));
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className="absolute inset-0 -z-10 h-full w-full">
        <div
          className="absolute inset-0 transition-transform duration-500 ease-out"
          style={{ transform: `translateY(-${yScroll}px)` }}
        >
          {newsGuideData.map(item => (
            <NewsAbstractView key={item.id} {...item} />
          ))}
        </div>
      </div>
      <div className="absolute inset-0 -z-10 bg-gray-10/60" />
      <div className="z-10 flex h-full flex-col items-center justify-center gap-10">
        <FaAngleUp size={80} />

        <p className="text-center !leading-10 typography-main-title">
          위/아래 스와이프로 <br />
          이전/다음 기사를 볼 수 있습니다!
        </p>
        <FaAngleDown size={80} />
        <button
          onClick={onNext}
          className="absolute bottom-10 right-10 w-fit rounded-lg bg-gray-60 px-4 py-2 font-semibold text-gray-10"
        >
          다음
        </button>
      </div>
    </>
  );
};

const SecondPage = ({ onNext }: { onNext: () => void }) => {
  const article = newsGuideData[0];
  const [xTransform, setXTransform] = useState(100);
  const setViewed = useNewsGuideStore(state => state.setViewed);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setXTransform(prev => (prev === 80 ? 100 : 80));
    }, 500);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <>
      <div className="absolute inset-0 -z-10 h-full w-full">
        <div className="absolute inset-0 transition-transform duration-500 ease-out">
          <NewsAbstractView {...article} />
          <div
            className="absolute inset-0 transform transition-transform duration-300 ease-out"
            style={{ transform: `translateX(${xTransform}%)` }}
          >
            <NewsDetailView fullSummary={article.fullSummary} />
          </div>
        </div>
      </div>
      <div className="absolute inset-0 -z-10 bg-gray-10/60" />
      <div className="flex h-full flex-col items-center justify-center gap-10">
        <div className="flex items-center gap-5">
          <FaAngleLeft size={80} />
          <span className="text-center !leading-10 typography-main-title">/</span>
          <FaAngleRight size={80} />
        </div>
        <p className="text-center !leading-10 typography-main-title">
          오른쪽 스와이프로 <br />
          자세한 기사를 볼 수 있습니다!
        </p>
        <button
          onClick={() => {
            onNext();
            setViewed();
          }}
          className="absolute bottom-10 right-10 w-fit rounded-lg bg-gray-60 px-4 py-2 text-gray-10"
        >
          다음
        </button>
      </div>
    </>
  );
};
