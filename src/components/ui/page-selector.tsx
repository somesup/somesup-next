'use client';
import { MdKeyboardArrowDown, MdKeyboardArrowUp, MdFiberManualRecord } from 'react-icons/md';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

type Page = { href: string; label: string };

const pages: Page[] = [
  { href: '/', label: 'Some’s up' },
  { href: '/news', label: '5분 뉴스' },
  { href: '/mypage', label: '마이페이지' },
];

export default function PageSelector() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const currentPage = pages.find(p => p.href === pathname) ?? pages[0];
  const otherPages = pages.filter(p => p.href !== currentPage.href);

  return (
    <div className="absolute z-[9999]">
      <div className="relative inline-block">
        <button
          onClick={() => setIsOpen(o => !o)}
          className="inline-flex items-center text-white typography-small-title"
        >
          <span className="relative inline-block flex h-[29px] w-[89px] items-center justify-center">
            <MdFiberManualRecord
              className={cn(
                'absolute left-[-15px] top-1/2 -translate-y-1/2',
                'transition-opacity duration-300 ease-in-out',
                isOpen ? 'opacity-0' : 'opacity-100',
              )}
              color="#FF3F62"
              size={12}
            />
            <p className="whitespace-nowrap">{currentPage.label}</p>
          </span>

          <span className="ml-[3px] mt-[1px] flex items-center">
            {isOpen ? <MdKeyboardArrowUp size={22} /> : <MdKeyboardArrowDown size={22} />}
          </span>
        </button>

        <div
          className={cn(
            'absolute left-0 top-full flex w-[89px] flex-col items-center space-y-2 transition-opacity duration-300',
            isOpen ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0',
          )}
        >
          {otherPages.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={cn(
                'relative mb-[27px] mt-[27px] flex h-[29px] w-full items-center justify-center whitespace-nowrap typography-small-title',
              )}
            >
              {label === '5분 뉴스' && (
                <MdFiberManualRecord
                  size={12}
                  color="#FF3F62"
                  className="absolute left-[-3px] top-1/2 -translate-y-1/2"
                />
              )}
              <p>{label}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
