'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FaBookmark, FaChevronRight, FaSquare } from 'react-icons/fa6';
import { RiPencilFill } from 'react-icons/ri';

import type { MyPageDto } from '@/types/dto';
import { getMyPageStats } from '@/lib/apis/apis';
import { toast } from '@/components/ui/toast';

import Hexagon from '@/components/ui/hexagon';
import WordCloud from '@/components/features/my-page/word-cloud';
import PageSelector from '@/components/ui/page-selector';

export default function MyPage() {
  const [data, setData] = useState<MyPageDto | null>(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    (async () => {
      try {
        const res = await getMyPageStats();
        if (res.error) {
          toast.serverError();
          return;
        }
        setData(res.data ?? null);
      } catch (e) {
        toast.serverError();
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const nickname = data?.user.nickname ?? '사용자';

  return (
    <main className="fixed flex h-full w-full max-w-mobile flex-col items-center justify-center bg-gray-10 text-[#FAFAFA]">
      <PageSelector />
      <div className="w-full px-10 pt-12">
        <section className="mb-5">
          <div className="flex items-center justify-between">
            <div className="inline-flex items-baseline gap-2">
              <p className="typography-sub-title-bold">
                {nickname}
                <span className="ml-[0.125rem] typography-body1">님</span>
              </p>
              <Link href="/set-nickname" className="inline-block">
                <RiPencilFill className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="mb-5">
          <Link
            href="/my-page/scrap"
            className="flex w-full items-center justify-between gap-3 rounded-xl bg-[#2E2E2E] p-3 text-left"
          >
            <div className="flex items-center gap-3">
              <FaBookmark className="h-5 w-5" />
              <span className="typography-body1">스크랩 기사</span>
            </div>
            <FaChevronRight className="h-5 w-5" />
          </Link>
        </section>

        <section className="mb-5">
          <h2 className="mb-2 typography-body2">내가 읽은 뉴스</h2>
          <div className="flex flex-col items-center justify-center rounded-xl bg-[#2E2E2E]">
            <div className="p-4">
              <Hexagon
                hexagons={[
                  {
                    radii: (data?.sectionStats ?? [])
                      .slice()
                      .sort((a, b) => a.sectionId - b.sectionId)
                      .map(s => (s.preference / 3) * 90),
                    fill: '#FF880060',
                    stroke: '#FF8800',
                  },
                  {
                    radii: (data?.sectionStats ?? [])
                      .slice()
                      .sort((a, b) => a.sectionId - b.sectionId)
                      .map(s => (s.behaviorScore / 3) * 90),
                    fill: '#AEFF8860',
                    stroke: '#AEFF88',
                  },
                ]}
                width={250}
                height={250}
                withLabel
              />
            </div>
            <div className="-mt-2 mb-3 flex items-center gap-5">
              <span className="typography-caption3 inline-flex items-center gap-2 align-middle">
                <FaSquare className="inline-block" color="#AEFF88" />
                읽은 뉴스
              </span>
              <span className="typography-caption3 inline-flex items-center gap-2 align-middle">
                <FaSquare className="inline-block" color="#FF8800" />
                선호도
              </span>
            </div>
            <Link
              href="/set-preferences"
              className="flex w-full items-center justify-between border-t border-[#5D5D5D] px-3 py-3 text-left"
            >
              <span className="typography-body2">관심 카테고리 수정</span>
              <FaChevronRight className="h-5 w-5" />
            </Link>
          </div>
        </section>

        <section className="mb-8">
          <h2 className="mb-2 typography-body2">자주 접한 키워드</h2>
          <div className="h-52 overflow-hidden rounded-xl bg-[#2E2E2E]">
            {data?.keywordStats?.length ? (
              <div className="h-full w-full">
                <WordCloud height={208} items={data.keywordStats.map(k => ({ keyword: k.keyword, count: k.count }))} />
              </div>
            ) : (
              <div className="grid aspect-[16/9] w-full place-items-center tracking-wide typography-body1">
                {loading ? '불러오는 중...' : '읽은 키워드 없음'}
              </div>
            )}
          </div>
        </section>

        <footer className="typography-caption3 mt-8 grid place-items-center gap-2">
          <p>
            <button>로그아웃</button>
            <span className="mx-2">|</span>
            <button>탈퇴하기</button> {/* todo : 로그아웃 & 탈퇴 api 적용 */}
          </p>
        </footer>
      </div>
    </main>
  );
}
