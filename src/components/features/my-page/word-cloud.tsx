'use client';

import dynamic from 'next/dynamic';
import type { Props as WordCloudProps, Word, Options } from 'react-wordcloud';

const ReactWordcloud = dynamic<WordCloudProps>(() => import('react-wordcloud').then(m => m.default), { ssr: false });

type CloudProps = {
  items: { keyword: string; count: number }[];
  height?: number;
};

const WordCloud = ({ items, height = 240 }: CloudProps) => {
  const words: Word[] = (items ?? [])
    .sort((keywordA, keywordB) => keywordB.count - keywordA.count)
    .slice(0, 20)
    .map(k => ({ text: k.keyword, value: k.count }));

  const options: Options = {
    colors: ['#ff904b', '#ffb764', '#ffd13c', '#ffeec3', '#1ab6b2'],
    deterministic: false,
    enableTooltip: true,
    enableOptimizations: false,
    fontFamily: 'Noto Sans KR',
    fontSizes: [14, 42],
    fontStyle: 'normal',
    fontWeight: '600',
    padding: 1,
    rotationAngles: [0, 0],
    rotations: 1,
    scale: 'sqrt',
    spiral: 'archimedean',
    svgAttributes: {},
    textAttributes: { 'letter-spacing': '-1px' },
    tooltipOptions: {},
    transitionDuration: 700,
  };

  return (
    <div style={{ height, width: '100%' }}>
      <ReactWordcloud words={words} options={options} />
    </div>
  );
};

export default WordCloud;
