'use client';

import Image from 'next/image';
import Link from 'next/link';

import { ReactNode, useEffect, useState } from 'react';
import { MdError } from 'react-icons/md';
import { Toast, useToastStore } from '@/lib/stores/toast';
import { GoBookmarkFill } from 'react-icons/go';

const toastIcon: Record<Toast['type'], ReactNode> = {
  success: <MdError />,
  error: <MdError className="h-7 w-7 text-error" />,
  info: <MdError />,
  promo: <Image alt="news-paper.png" src="/images/news-paper.png" width={50} height={50} />,
  scrap: <GoBookmarkFill className="h-5 w-5 text-gray-60" />,
};

export const ToastContainer = () => {
  const toasts = useToastStore(state => state.toasts);

  return (
    <div className="fixed left-1/2 top-0 z-40 flex w-full -translate-x-1/2 flex-col gap-2 p-4 sm:bottom-0 sm:left-auto sm:right-0 sm:top-auto sm:w-[360px] sm:translate-x-0">
      {toasts.map(t => (
        <ToastItem key={t.id} {...t} />
      ))}
    </div>
  );
};

export const ToastItem = ({ title, description, type, id }: Toast & { id: string }) => {
  const [show, setShow] = useState(false);
  const [shouldRemove, setShouldRemove] = useState(false);

  useEffect(() => {
    const enter = requestAnimationFrame(() => setShow(true));

    const exitTimer = setTimeout(() => {
      setShouldRemove(true);
      setTimeout(() => {
        useToastStore.getState().remove(id);
      }, 300);
    }, 3800);

    return () => {
      cancelAnimationFrame(enter);
      clearTimeout(exitTimer);
    };
  }, [type, id]);

  if (type === 'promo') {
    return (
      <Link
        href="/highlight"
        className={[
          'relative flex w-full items-start gap-3 rounded-xl bg-white p-3 text-left',
          'overflow-hidden',
          'transition-all duration-300 will-change-transform',
          show && !shouldRemove ? 'max-h-96 translate-y-0 opacity-100' : 'max-h-96 -translate-y-2 opacity-0',
        ].join(' ')}
        style={{
          marginBottom: shouldRemove ? '0px' : undefined,
        }}
      >
        <div className="relative flex shrink-0 items-center justify-center rounded-md">{toastIcon[type]}</div>
        <div className="relative text-gray-10">
          <p className="typography-body1">{title}</p>
          <span className="typography-body2">{description}</span>
        </div>
      </Link>
    );
  }

  return (
    <div
      className={[
        'z-100 flex w-full items-center gap-5 rounded-lg bg-gray-20 px-4',
        'transition-all duration-300 will-change-transform',
        show && !shouldRemove ? 'translate-y-0 opacity-100' : '-translate-y-2 opacity-0',
        type === 'scrap' ? 'h-[3.25rem]' : 'h-[4rem]',
      ].join(' ')}
    >
      {toastIcon[type]}
      <div className="flex h-fit flex-col">
        <p className="typography-body3">{title}</p>
        <span className="typography-caption2">{description}</span>
      </div>
    </div>
  );
};

const createToast = (type: Toast['type']) => (title: string, description?: string) => {
  const id = crypto.randomUUID();
  useToastStore.getState().add({ type, title, description, id });
  setTimeout(() => useToastStore.getState().remove(id), 6000);
};

export const toast = {
  success: createToast('success'),
  info: createToast('info'),
  error: createToast('error'),
  promo: createToast('promo'),
  fiveNews: () => createToast('promo')('5분만에 뉴스 훑기', '오늘이 지나기 전에, 오늘 뉴스 받아보세요!'),
  serverError: () => createToast('error')('서버에 문제가 발생했습니다.', '잠시후 다시 시도해주세요'),
  scrap: () => createToast('scrap')('기사를 스크랩 목록에 담았어요 !'),
};
