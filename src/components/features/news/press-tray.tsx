'use client';

import Image from 'next/image';
import { useMemo, useState, useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

type PressItem = { id: number; image: string; url: string; name: string };
type PressTrayProps = { items?: PressItem[] };

{
  /*확대되기 전 로고 사이즈입니다*/
}
const COLLAPSED_SIZE = 28;
{
  /*확대된 후의 로고 사이즈입니다*/
}
const EXPANDED_SIZE = 75;

const PressTray = ({ items = [] }: PressTrayProps) => {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const list = useMemo(() => (Array.isArray(items) ? items : []), [items]);
  const top3 = list.slice(0, 3);
  const rest = list.slice(3);

  const close = () => {
    if (scrollerRef.current) {
      scrollerRef.current.scrollLeft = 0;
    }
    setOpen(false);
  };

  return (
    <>
      <motion.button
        aria-label="뉴스사 목록 열기"
        onClick={() => setOpen(true)}
        aria-hidden={open}
        className={`relative z-[60] ${open ? 'pointer-events-none opacity-0' : ''}`}
        style={{ background: 'transparent', padding: 0 }}
        whileTap={{ scale: 0.97 }}
      >
        <div className="flex -space-x-3">
          {top3.map(it => (
            <LogoBubble
              key={it.id}
              item={it}
              size={COLLAPSED_SIZE}
              layoutId={`logo-${it.id}`}
              ring={false}
              shadow={false}
            />
          ))}
        </div>
      </motion.button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="absolute inset-0 z-50"
              onClick={close}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              style={{ background: '#1717176B' }}
            />
            <motion.div
              className="absolute z-[70] rounded-2xl p-3"
              style={{
                ['--g' as any]: '32px',
                left: 'var(--g)',
                right: 'var(--g)',
                bottom: '48px',
                background: '#2b2b2b',
                backdropFilter: 'blur(4px)',
                transformOrigin: '50% 100%',
              }}
              initial={{ opacity: 0, y: 12, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 420, damping: 32 } }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              onClick={e => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-1">
                <p className="typography-caption3 text-white/90">원문 기사 보기</p>
              </div>

              <div
                className="flex gap-3 overflow-x-auto px-1 py-1"
                ref={scrollerRef}
                style={{
                  WebkitOverflowScrolling: 'touch',
                  scrollbarWidth: 'none',
                  msOverflowStyle: 'none',
                  WebkitMaskImage:
                    'linear-gradient(90deg, transparent 0, #000 8px, #000 calc(100% - 8px), transparent 100%)',
                  maskImage: 'linear-gradient(90deg, transparent 0, #000 8px, #000 calc(100% - 8px), transparent 100%)',
                }}
              >
                <style jsx>{`
                  div::-webkit-scrollbar {
                    display: none;
                  }
                `}</style>
                {top3.map(it => (
                  <LogoLink key={it.id} item={it} size={EXPANDED_SIZE} layoutId={`logo-${it.id}`} />
                ))}
                <motion.div
                  className="flex gap-3"
                  initial="hidden"
                  animate="show"
                  variants={{ show: { transition: { staggerChildren: 0.05, delayChildren: 0.08 } } }}
                >
                  {rest.map(it => (
                    <motion.div key={it.id} variants={{ hidden: { opacity: 0, y: 8 }, show: { opacity: 1, y: 0 } }}>
                      <LogoLink item={it} size={EXPANDED_SIZE} />
                    </motion.div>
                  ))}
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
};

function LogoBubble({
  item,
  size = 40,
  layoutId,
  ring = true,
  shadow = true,
}: {
  item: PressItem;
  size?: number;
  layoutId?: string;
  ring?: boolean;
  shadow?: boolean;
}) {
  return (
    <motion.span
      layoutId={layoutId}
      className="inline-block overflow-hidden rounded-full"
      style={{
        width: size,
        height: size,
        borderWidth: ring ? 1 : 0,
        borderColor: 'rgba(0,0,0,0.12)',
        boxShadow: shadow ? '0 2px 10px rgba(0,0,0,0.25)' : 'none',
      }}
      transition={{ type: 'spring', stiffness: 520, damping: 38 }}
    >
      <Image src={item.image} alt={item.name} width={size} height={size} className="h-full w-full object-cover" />
    </motion.span>
  );
}

function LogoLink({ item, size = EXPANDED_SIZE, layoutId }: { item: PressItem; size?: number; layoutId?: string }) {
  const tileWidth = size + 4;
  return (
    <a
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex shrink-0 flex-col items-center gap-1"
      style={{ width: tileWidth }}
    >
      <LogoBubble item={item} size={size} layoutId={layoutId} />
    </a>
  );
}

export default PressTray;
