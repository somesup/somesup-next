
import { NewsProviderDto } from './types/dto';
import { NewsDto } from './types/dto';

export const pressData: NewsProviderDto[] = [
  { id: 1, image: '/images/press-logo-example.png', logoUrl: 'https://news.daum.net/', friendlyName: '뉴스사 1' },
  { id: 2, image: '/images/press-logo-example.png', logoUrl: 'https://news.daum.net/', friendlyName: '뉴스사 2' },
  { id: 3, image: '/images/press-logo-example.png', logoUrl: 'https://news.daum.net/', friendlyName: '뉴스사 3' },
  { id: 4, image: '/images/press-logo-example.png', logoUrl: 'https://news.daum.net/', friendlyName: '뉴스사 4' },
  { id: 5, image: '/images/press-logo-example.png', logoUrl: 'https://news.daum.net/', friendlyName: '뉴스사 5' },
  { id: 6, image: '/images/press-logo-example.png', logoUrl: 'https://news.daum.net/', friendlyName: '뉴스사 6' },
  { id: 7, image: '/images/press-logo-example.png', logoUrl: 'https://news.daum.net/', friendlyName: '뉴스사 7' },
  { id: 8, image: '/images/press-logo-example.png', logoUrl: 'https://news.daum.net/', friendlyName: '뉴스사 8' },
];


export const mockNews: NewsDto = {
  id: 541,
  section: {
    id: 1,
    name: 'politics',
    friendlyName: '정치',
  },
  providers: [
    {
      id: 1,
      name: '오마이뉴스',
      friendlyName: '오마이뉴스',
      logoUrl: 'https://storage.googleapis.com/somesup-462506-provider-logo/1.png',
    },
    {
      id: 2,
      name: 'The Guardian',
      friendlyName: 'The Guardian',
      logoUrl: 'https://storage.googleapis.com/somesup-462506-provider-logo/2.png',
    },
  ],
  keywords: [
    {
      id: 1,
      name: '남북관계',
    },
    {
      id: 2,
      name: '이다은바보',
    },
  ],
  title: "이 대통령, '남북, 상호 도움 되는 관계로 전환' 제안",
  oneLineSummary:
    '이재명 대통령이 대북 확성기 상호 철거를 계기로 남북이 대화와 소통을 통해 상호 이익이 되는 관계로 나아가야 한다고 강조했다.',
  fullSummary:
    "# 이 대통령, 남북 관계 개선 촉구… '상호 도움 되는 관계로 전환하자'\n\n이재명 대통령이 최근 남북한의 대남·대북 확성기 상호 철거 조치를 긍정적으로 평가하며, 이를 계기로 양측이 서로에게 피해를 주는 대결 관계를 청산하고 상호 이익이 되는 관계로 전환해야 한다고 강조했다.\n\n## 확성기 상호 철거와 관계 개선의 신호탄\n\n이 대통령은 12일 국무회의에서 우리 군이 먼저 대북 확성기를 철거한 데 이어 북한 역시 일부 지역에서 대남 확성기 철거에 나선 점을 언급했다. 그는 지난 6월 우리 측이 비방 방송을 중단하자 북측도 소음 방송을 중단했던 사례처럼, 이러한 상호적 조치가 남북 간 대화와 소통의 문을 여는 계기가 되기를 바란다고 밝혔다. 이는 남북 간 불필요한 긴장 유발 행위를 중단하고 신뢰를 쌓아가는 첫걸음이 될 수 있다는 긍정적인 평가로 해석된다.\n\n## '피해'에서 '도움'으로… 관계 패러다임 전환 제안\n\n이 대통령은 군사적 대결로 인해 발생하는 막대한 비용이 남북 모두에게 부담이라는 점을 지적하며, \"굳이 서로에게 고통을 가하고 피해를 입힐 필요가 있겠냐\"고 반문했다. 그는 이러한 소모적인 대결 구도를 넘어, 대화와 소통을 통해 서로에게 실질적인 도움이 되는 협력 관계로 나아가자고 제안했다. 이는 한반도의 평화와 안정을 공고히 하고, 이를 바탕으로 남북 각자의 경제적 환경까지 개선하는 선순환 구조를 만들자는 비전으로 이어진다.",
  language: 'ko',
  region: null,
  thumbnailUrl: 'https://ojsfile.ohmynews.com/CT_T_IMG/2025/0812/IE003508290_LT.jpg',
  createdAt: '2025-08-12T07:48:30.713Z',
  like: {
    isLiked: false,
    count: 20,
  },
  scrap: {
    isScrapped: false,
    count: 5,
  },
};

