import { Expand, SectionType } from './types';

export type Error = { status: number; message: string };
export type PaginationDto = {
  hasNext: boolean;
  nextCursor: string | null;
};
export type APIResult<T> =
  | { error: Error; data: null; pagination?: null; xCache?: null }
  | { error: null; data: T; pagination?: PaginationDto; xCache?: string | null };

export type PhoneRequestDto = { phoneNumber: string };
export type SignInRequestDto = PhoneRequestDto & { code: string };
export type UpdateUserRequestDto = Pick<UserDto, 'nickname'>;
export type UpdatePreferencesRequestDto = Pick<SectionPreferenceDto, 'sectionId' | 'preference'>[];

export type UserDto = { id: number; phone: string; nickname: string };
export type TokenDto = { accessToken: string; refreshToken: string };

export type SectionPreferenceDto = { sectionId: number; sectionName: SectionType; preference: number };
export type SectionWithBehaviorDto = SectionPreferenceDto & { behaviorScore: number };
export type SectionPreferenceRequestDto = Pick<SectionPreferenceDto, 'sectionId' | 'preference'>[];

export type SignInResponseDto = Expand<{
  user: UserDto;
  tokens: TokenDto;
  sectionPreferences: SectionPreferenceDto[];
  isCreated: boolean;
}>;

export type NewsProviderDto = { id: number; name: string; friendlyName: string; newsUrl: string; logoUrl: string };
export type NewsDto = {
  id: number;
  section: { id: number; name: string; friendlyName: string };
  providers: NewsProviderDto[];
  keywords: { id: number; name: string }[];
  title: string;
  oneLineSummary: string;
  fullSummary: string;
  language: string;
  region: null | string;
  thumbnailUrl: string;
  createdAt: string;
  like: { isLiked: boolean; count: number };
  scrap: { isScraped: boolean; count: number };
};

export type MyPageDto = {
  user: UserDto;
  sectionStats: SectionWithBehaviorDto[];
  keywordStats: { keyword: string; count: number }[];
};

export type ArticlesRequestDto = {
  cursor?: string | null;
  limit?: number;
  scraped?: boolean;
  liked?: boolean;
  highlight?: boolean;
};
