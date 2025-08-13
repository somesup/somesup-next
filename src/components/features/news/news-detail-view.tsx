import ReactMarkdown from 'react-markdown';
import { NewsDto } from '@/types/dto';

type NewsDetailViewProps = Pick<NewsDto, 'fullSummary'>;
const NewsDetailView = ({ fullSummary }: NewsDetailViewProps) => {
  return (
    <section className="relative h-full w-full flex-shrink-0">
      <div className="absolute inset-0 -z-10 bg-black/60 backdrop-blur-3xl" />
      <div
        className="prose prose-sm prose-invert h-full overflow-y-auto px-7 py-8"
        style={{ touchAction: 'pan-y pinch-zoom', overscrollBehavior: 'contain' }}
      >
        <ReactMarkdown components={{ p: props => <p className="text-base leading-8 tracking-tight" {...props} /> }}>
          {fullSummary}
        </ReactMarkdown>
      </div>
    </section>
  );
};

export default NewsDetailView;
