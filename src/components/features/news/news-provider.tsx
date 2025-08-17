'use client';

import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import { NewsProviderDto } from '@/types/dto';

type NewsProviderProps = { providers: NewsProviderDto[] };
type LogoProps = { provider: NewsProviderDto; size: number };

const COLLAPSED_SIZE = 24;
const EXPANDED_SIZE = 60;

const NewsProvider = ({ providers }: NewsProviderProps) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

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
        <div className="fixed inset-0 z-50 mx-auto max-w-mobile">
          {/* 배경 오버레이 */}
          <div
            className={`absolute inset-0 transition-opacity duration-300 ${!isClosing ? 'opacity-100' : 'opacity-0'}`}
            onClick={close}
            onTouchEnd={close}
            style={{ background: '#1717176B' }}
          />

          {/* 모달 컨텐츠 */}
          <div
            className={[
              'absolute transform rounded-2xl p-3 transition-all duration-300 ease-out',
              !isClosing ? 'translate-y-0 scale-100 opacity-100' : 'translate-y-2 scale-75 opacity-0',
              'bottom-8 left-8 right-8 origin-[50%_100%] bg-[#2b2b2b]',
            ].join(' ')}
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
              {providers.map(provider => (
                <div key={provider.id}>
                  <LogoLink provider={provider} size={EXPANDED_SIZE} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );

  return (
    <>
      <button
        aria-label="뉴스사 목록 열기"
        onClick={() => setOpen(true)}
        className={`relative transition-all duration-300 ease-out ${
          open ? 'scale-90 opacity-0' : 'scale-100 opacity-100'
        } active:scale-95`}
        style={{ background: 'transparent', padding: 0 }}
      >
        <div className="flex -space-x-3">
          {providers.slice(0, 3).map(provider => (
            <LogoBubble key={provider.id} provider={provider} size={COLLAPSED_SIZE} />
          ))}
        </div>
      </button>

      {createPortal(modalContent, document.body)}
    </>
  );
};

const LogoBubble = ({ provider, size }: LogoProps) => {
  return (
    <div
      className="inline-block overflow-hidden rounded-full bg-cover bg-center bg-no-repeat"
      style={{
        backgroundImage: `url(${provider.logoUrl})`,
        width: size,
        height: size,
      }}
    />
  );
};

const LogoLink = ({ provider, size }: LogoProps) => {
  const tileWidth = size + 4;
  return (
    <a
      href={provider.newsUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex shrink-0 flex-col items-center gap-1 transition-transform duration-200 hover:scale-105"
      style={{ width: tileWidth }}
    >
      <LogoBubble provider={provider} size={size} />
    </a>
  );
};

export default NewsProvider;
