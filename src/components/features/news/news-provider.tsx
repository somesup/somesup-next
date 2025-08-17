'use client';

import { useMemo, useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { NewsProviderDto } from '@/types/dto';

type NewsProviderProps = { items: NewsProviderDto[] };
type LogoProps = { item: NewsProviderDto; size: number };

const COLLAPSED_SIZE = 24;
const EXPANDED_SIZE = 60;

const NewsProvider = ({ items = [] }: NewsProviderProps) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const list = useMemo(() => (Array.isArray(items) ? items : []), [items]);
  const top3 = list.slice(0, 3);

  const close = () => {
    setIsClosing(true);
    if (scrollerRef.current) {
      scrollerRef.current.scrollLeft = 0;
    }
    setTimeout(() => {
      setOpen(false);
      setIsClosing(false);
    }, 300);
  };

  const modalContent = (
    <>
      {open && (
        <>
          {/* 배경 오버레이 */}
          <div
            className={`fixed inset-0 z-[9998] transition-opacity duration-300 ${
              !isClosing ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={close}
            onTouchEnd={close}
            style={{ background: '#1717176B' }}
          />

          {/* 모달 컨텐츠 */}
          <div
            className={`fixed z-[9999] transform rounded-2xl p-3 transition-all duration-300 ease-out ${
              !isClosing ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-90 opacity-0'
            }`}
            style={{
              ['--g' as any]: '32px',
              left: 'var(--g)',
              right: 'var(--g)',
              bottom: '48px',
              background: '#2b2b2b',
              backdropFilter: 'blur(4px)',
              transformOrigin: '50% 100%',
              ...(open && !isClosing
                ? {}
                : {
                    transform: 'translateY(12px) scale(0.85)',
                    opacity: 0,
                  }),
            }}
            onClick={e => e.stopPropagation()}
          >
            <div className="flex items-center justify-between px-1">
              <p className="text-white/90 typography-caption3">원문 기사 보기</p>
            </div>

            <div
              className="flex gap-3 overflow-x-auto px-1 py-1"
              ref={scrollerRef}
              onScroll={e => e.stopPropagation()}
              onTouchStart={e => e.stopPropagation()}
              onTouchMove={e => e.stopPropagation()}
              style={{
                WebkitOverflowScrolling: 'touch',
                scrollbarWidth: 'none',
                msOverflowStyle: 'none',
                WebkitMaskImage:
                  'linear-gradient(90deg, transparent 0, #000 8px, #000 calc(100% - 8px), transparent 100%)',
                maskImage: 'linear-gradient(90deg, transparent 0, #000 8px, #000 calc(100% - 8px), transparent 100%)',
              }}
            >
              {list.map(it => (
                <div key={it.id}>
                  <LogoLink item={it} size={EXPANDED_SIZE} />
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );

  return (
    <>
      <button
        aria-label="뉴스사 목록 열기"
        onClick={() => setOpen(true)}
        className={`relative z-[60] transition-all duration-300 ease-out ${
          open ? 'scale-90 opacity-0' : 'scale-100 opacity-100'
        } active:scale-95`}
        style={{ background: 'transparent', padding: 0 }}
      >
        <div className="flex -space-x-3">
          {top3.map(it => (
            <LogoBubble key={it.id} item={it} size={COLLAPSED_SIZE} />
          ))}
        </div>
      </button>

      {createPortal(modalContent, document.body)}
    </>
  );
};

const LogoBubble = ({ item, size }: LogoProps) => {
  return (
    <div
      className="inline-block overflow-hidden rounded-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${item.logoUrl})`,
        width: size,
        height: size,
      }}
    />
  );
};

const LogoLink = ({ item, size }: LogoProps) => {
  const tileWidth = size + 4;
  return (
    <a
      href={item.newsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex shrink-0 flex-col items-center gap-1 transition-transform duration-200 hover:scale-105"
      style={{ width: tileWidth }}
    >
      <LogoBubble item={item} size={size} />
    </a>
  );
};

export default NewsProvider;
