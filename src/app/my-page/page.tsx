'use client';

import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { FaBookmark, FaChevronRight, FaSquare } from 'react-icons/fa6';
import { RiPencilFill } from 'react-icons/ri';

import type { MyPageDto, SectionWithBehaviorDto } from '@/types/dto';
import { getMyPageStats } from '@/lib/apis/apis';
import { toast } from '@/components/ui/toast';

import Hexagon from '@/components/ui/hexagon';
import WordCloud from '@/components/features/my-page/word-cloud';
import PageSelector from '@/components/ui/page-selector';
import { SITEMAP } from '@/data/sitemap';
import { sectionLabels, SectionType } from '@/types/types';

const MyPage = () => {
  const [data, setData] = useState<MyPageDto | null>(null);

  useEffect(() => {
    (async () => {
      try {
        const res = await getMyPageStats();
        if (res.error) return toast.serverError();
        setData(res.data);
      } catch (e) {
        toast.serverError();
      }
    })();
  }, []);

  const sections = data
    ? data.sectionStats.reduce(
        (acc, stat) => {
          acc[stat.sectionName] = stat;
          return acc;
        },
        {} as Record<SectionType, SectionWithBehaviorDto>,
      )
    : ({} as Record<SectionType, SectionWithBehaviorDto>);

  const preferenceRadii = sectionLabels.map(label => (sections[label]?.preference ?? 1) * 30);
  const behaviorRadii = sectionLabels.map(label => (sections[label]?.behaviorScore ?? 1) * 30);

  return (
    <main className="flex h-full w-full max-w-mobile flex-col items-center justify-center bg-gray-10">
      <PageSelector />
      <div className="w-full px-10 pt-16">
        <div className="mb-5 flex items-center gap-2">
          {data ? (
            <p className="h-8 typography-sub-title-bold">
              {data.user.nickname}
              <span className="ml-[0.125rem] typography-body1">님</span>
            </p>
          ) : (
            <div className="h-8 w-24 animate-pulse rounded bg-gray-20" />
          )}
          <Link href={SITEMAP.SET_NICKNAME}>
            <RiPencilFill className="h-5 w-5" />
          </Link>
        </div>

        <div className="mb-5">
          <Link
            href={SITEMAP.MY_PAGE_SCRAP}
            className="flex w-full items-center justify-between gap-3 rounded-xl bg-[#2E2E2E] p-3 text-left"
          >
            <div className="flex items-center gap-3">
              <FaBookmark className="h-5 w-5" />
              <span className="typography-body1">스크랩 목록</span>
            </div>
            <FaChevronRight className="h-5 w-5" />
          </Link>
        </div>

        <section className="mb-5">
          <h2 className="mb-2 typography-body2">내가 읽은 뉴스</h2>
          <div className="flex flex-col items-center justify-center rounded-xl bg-[#2E2E2E]">
            <div className="p-4">
              <Hexagon
                hexagons={[
                  { radii: preferenceRadii, fill: '#FF880060', stroke: '#FF8800' },
                  { radii: behaviorRadii, fill: '#AEFF8860', stroke: '#AEFF88' },
                ]}
                width={250}
                height={250}
              />
            </div>
            <div className="-mt-2 mb-3 flex items-center gap-5">
              <span className="inline-flex items-center gap-2 align-middle typography-caption3">
                <FaSquare className="inline-block" color="#AEFF88" />
                읽은 뉴스
              </span>
              <span className="inline-flex items-center gap-2 align-middle typography-caption3">
                <FaSquare className="inline-block" color="#FF8800" />
                선호도
              </span>
            </div>
            <Link
              href={SITEMAP.SET_PREFERENCES}
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
            {data && data.keywordStats.length > 10 ? (
              <div className="h-full w-full">
                <WordCloud height={208} items={data.keywordStats.map(k => ({ keyword: k.keyword, count: k.count }))} />
              </div>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-[url('/images/keyword-bg.png')] bg-cover bg-center bg-no-repeat text-center">
                키워드 분석 준비 중입니다.
                <br />더 많은 뉴스 시청 기록이 필요해요 !
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
};

export default MyPage;
