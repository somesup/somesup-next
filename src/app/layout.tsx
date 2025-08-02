import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { ToastContainer } from '@/components/ui/toast';
import './globals.css';

const notoSansKR = localFont({
  src: '../../public/fonts/NotoSansKR.ttf',
  variable: '--noto-sans-kr',
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Some's up | 썸즈 업",
  description: '스와이프 기반 AI 뉴스 요약 애플리케이션',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${notoSansKR.className} relative antialiased`}>
        <div className="mx-auto max-h-screen max-w-mobile">{children}</div>
        <ToastContainer />
      </body>
    </html>
  );
}
