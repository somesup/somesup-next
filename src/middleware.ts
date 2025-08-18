import { NextRequest, NextResponse } from 'next/server';
import { allPaths, privatePaths, publicPaths, SITEMAP } from './data/sitemap';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const isPublicPath = publicPaths.some(path => pathname === path);
  const isPrivatePath = privatePaths.some(path => pathname === path);

  const refreshToken = request.cookies.get('refreshToken')?.value;

  if (isPublicPath && !refreshToken) return NextResponse.next();
  if (isPublicPath && !!refreshToken) return NextResponse.redirect(new URL(SITEMAP.HOME, request.url));

  if (isPrivatePath && !!refreshToken) return NextResponse.next();
  if (isPrivatePath && !refreshToken) return NextResponse.redirect(new URL(SITEMAP.ONBOARDING, request.url));

  return NextResponse.next();
}

export const config = {
  matcher: allPaths,
};
