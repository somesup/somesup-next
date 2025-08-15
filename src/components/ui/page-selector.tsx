'use client';
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdFiberManualRecord } from 'react-icons/md';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { isDailyUnread } from '@/lib/utils/news-daily';
type Page = { href: string; label: string };

const pages: Page[] = [
  { href: '/', label: "Some's up" },
  { href: '/highlight', label: '5분 뉴스' },
  { href: '/my-page', label: '마이페이지' },
];

const PageSelector = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [unread, setUnread] = useState(false);

  const currentPage = pages.find(p => p.href === pathname) ?? pages[0];
  const otherPages = pages.filter(p => p.href !== currentPage.href);

  useEffect(() => {
    const u = isDailyUnread();
    setUnread(u);
  }, []);

  return (
    <>
      {isOpen && <div onClick={() => setIsOpen(false)} className="fixed inset-0 z-40 bg-gray-10 bg-opacity-50" />}
      <div className="fixed left-1/2 top-5 z-50 -translate-x-1/2">
        <div className="relative">
          <button
            onClick={() => setIsOpen(prev => !prev)}
            className="relative flex items-center typography-small-title"
          >
            {!isOpen && unread && (
              <MdFiberManualRecord size={12} color="#FF3F62" className="absolute -left-5 top-1/2 -translate-y-1/2" />
            )}
            <span>{currentPage.label}</span>
            {isOpen ? (
              <MdKeyboardArrowUp size={22} className="absolute -right-6 top-1/2 -translate-y-1/2" />
            ) : (
              <MdKeyboardArrowDown size={22} className="absolute -right-6 top-1/2 -translate-y-1/2" />
            )}
          </button>
          {isOpen && (
            <div className="absolute left-1/2 top-full mt-6 flex -translate-x-1/2 flex-col items-center gap-6">
              {otherPages.map(({ href, label }) => (
                <Link
                  key={href}
                  href={href}
                  className="relative whitespace-nowrap typography-small-title"
                  onClick={() => setIsOpen(false)}
                >
                  {label === '5분 뉴스' && unread && (
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
          )}
        </div>
      </div>
    </>
  );
};

export default PageSelector;
