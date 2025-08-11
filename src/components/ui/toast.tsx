'use client';

import Image from 'next/image';

import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { MdError } from 'react-icons/md';
import { Toast, useToastStore } from '@/lib/stores/toast';

const toastIcon: Record<Toast['type'], ReactNode> = {
  success: <MdError />,
  error: <MdError className="h-7 w-7 text-error" />,
  info: <MdError />,
  promo: <Image alt="news-paper.png" src="/images/news-paper.png" width={50} height={50} />,
};

export const ToastContainer = () => {
  const toasts = useToastStore(state => state.toasts);

  return (
    <div className="fixed left-1/2 top-0 z-50 flex w-full -translate-x-1/2 flex-col gap-2 p-4 sm:bottom-0 sm:left-auto sm:right-0 sm:top-auto sm:w-[360px] sm:translate-x-0">
      {toasts.map(toast => (
        <ToastItem key={toast.id} {...toast} />
      ))}
    </div>
  );
};

export const ToastItem = ({ title, description, type }: Toast) => {
  const router = useRouter();

  if (type === 'promo') {
    return (
      <button
        onClick={() => router.push('/news')}
        className="flex w-full items-start gap-3 rounded-xl bg-white p-3 text-left shadow-lg ring-1 ring-black/10"
      >
        <div className="relative flex shrink-0 items-center justify-center rounded-md">{toastIcon[type]}</div>
        <div className="text-gray-10">
          <p className="typography-body1">{title}</p>
          <span className="typography-body2">{description}</span>
        </div>
      </button>
    );
  }
  return (
    <div className="flex h-[4rem] w-full items-center gap-5 rounded-lg bg-gray-20 px-4">
      {toastIcon[type]}
      <div className="flex h-fit flex-col">
        <p className="typography-body3">{title}</p>
        <span className="typography-caption2">{description}</span>
      </div>
    </div>
  );
};

const createToast = (type: Toast['type']) => (title: string, description: string) => {
  const id = crypto.randomUUID();
  useToastStore.getState().add({ type, title, description, id });
  setTimeout(() => useToastStore.getState().remove(id), type === 'promo' ? 8000 : 3000);
};

export const toast = {
  success: createToast('success'),
  info: createToast('info'),
  error: createToast('error'),
  promo: createToast('promo'),
  serverError: () => createToast('error')('서버에 문제가 발생했습니다.', '잠시후 다시 시도해주세요'),
};
