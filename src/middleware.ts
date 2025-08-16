import { NextRequest, NextResponse } from 'next/server';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const publicPaths = ['/onboarding', '/sign-in'];
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  if (isPublicPath) return NextResponse.next();

  const refreshToken = request.cookies.get('refreshToken')?.value;

  if (!refreshToken) return NextResponse.redirect(new URL('/onboarding', request.url));
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * 다음 경로를 제외한 모든 요청에 대해 실행:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
