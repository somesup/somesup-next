'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState, useEffect, CSSProperties } from 'react';
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdFiberManualRecord } from 'react-icons/md';
import { SITEMAP } from '@/data/sitemap';
import { useHighlightStore } from '@/lib/stores/highlight';

type Page = { href: string; label: string };

const pages: Page[] = [
  { href: SITEMAP.HOME, label: "Some's up" },
  { href: SITEMAP.HIGHLIGHT, label: '5분 뉴스' },
  { href: SITEMAP.MY_PAGE, label: '마이페이지' },
];

const PageSelector = ({ style }: { style?: CSSProperties }) => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const isVisited = useHighlightStore(state => state.isVisited);

  const currentPage = pages.find(p => p.href === pathname) ?? pages[0];
  const otherPages = pages.filter(p => p.href !== currentPage.href);

  useEffect(() => setIsMounted(true), []);
  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => {
        setIsVisible(false);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleClose = () => {
    setIsOpen(false);
  };

  const shouldShowIndicator = isMounted && !isVisited();

  return (
    <>
      {isVisible && <div onClick={handleClose} className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xl" />}

      <div className="fixed left-1/2 top-5 z-40 -translate-x-1/2" style={style}>
        <div className="relative">
          <button
            onClick={() => setIsOpen(prev => !prev)}
            className={'relative flex items-center typography-small-title'}
            aria-expanded={isOpen}
          >
            {!isOpen && shouldShowIndicator && (
              <MdFiberManualRecord size={12} color="#FF3F62" className="absolute -left-5 top-1/2 -translate-y-1/2" />
            )}
            <span>{currentPage.label}</span>
            <div className="absolute -right-6 top-1/2 -translate-y-1/2 transition-transform duration-150 ease-out">
              {isOpen ? <MdKeyboardArrowUp size={22} /> : <MdKeyboardArrowDown size={22} />}
            </div>
          </button>

          {isVisible && (
            <div className="absolute left-1/2 top-full mt-6 -translate-x-1/2">
              <div
                className={[
                  'flex origin-top transform flex-col items-center gap-6 transition-all duration-150 ease-out',
                  isOpen
                    ? 'pointer-events-auto translate-y-0 scale-100 opacity-100'
                    : 'pointer-events-none -translate-y-2 scale-[0.98] opacity-0',
                ].join(' ')}
              >
                {otherPages.map(({ href, label }) => (
                  <Link
                    key={href}
                    href={href}
                    className="relative whitespace-nowrap transition-colors duration-150 ease-out typography-small-title hover:opacity-70"
                    onClick={handleClose}
                  >
                    {label === '5분 뉴스' && shouldShowIndicator && (
                      <MdFiberManualRecord
                        size={12}
                        color="#FF3F62"
                        className="absolute -left-5 top-1/2 -translate-y-1/2"
                      />
                    )}
                    <span>{label}</span>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PageSelector;
