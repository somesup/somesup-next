export const SITEMAP = {
  // Public paths
  ONBOARDING: '/onboarding',
  SIGN_IN: '/sign-in',

  // Private paths
  HOME: '/',
  HIGHLIGHT: '/highlight',
  MY_PAGE: '/my-page',
  MY_PAGE_SCRAP: '/my-page/scrap',
  SCRAP: '/scrap',
  SET_NICKNAME: '/set-nickname',
  SET_PREFERENCES: '/set-preferences',
} as const;

export const allPaths = Object.values(SITEMAP);
export const publicPaths = [SITEMAP.ONBOARDING, SITEMAP.SIGN_IN] as string[];
export const privatePaths = allPaths.filter(path => !publicPaths.includes(path));
