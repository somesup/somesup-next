import ReactMarkdown from 'react-markdown';
import { NewsDto } from '@/types/dto';
import React, { useEffect, useRef } from 'react';

type NewsDetailViewProps = Pick<NewsDto, 'fullSummary'>;
const NewsDetailView = ({ fullSummary }: NewsDetailViewProps) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = 0;
    }
  }, [fullSummary]);

  return (
    <section className="relative h-full w-full flex-shrink-0">
      <div className="absolute inset-0 -z-10 bg-black/30 backdrop-blur-3xl" />
      <div ref={scrollRef} className="prose prose-sm prose-invert h-full overflow-y-auto px-7 py-8">
        <ReactMarkdown
          components={{ p: props => <p className="text-base leading-8 tracking-tight text-gray-60" {...props} /> }}
        >
          {fullSummary}
        </ReactMarkdown>
      </div>
    </section>
  );
};

export default React.memo(NewsDetailView);
