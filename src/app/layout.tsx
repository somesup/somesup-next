import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Some's up | 썸즈 업",
  description: "스와이프 기반 AI 뉴스 요약 애플리케이션",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body
        className="antialiased"
      >
        {children}
      </body>
    </html>
  );
}
