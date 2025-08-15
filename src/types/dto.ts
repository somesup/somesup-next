import { Expand, SectionType } from './types';

export type Error = { status: number; message: string };
export type PaginationDto = { hasNext: boolean; nextCursor: string; type: 'cursor' };
export type APIResult<T> = { error: Error; data: null } | { error: null; data: T; pagination?: PaginationDto };

export type PhoneRequestDto = { phoneNumber: string };
export type SignInRequestDto = PhoneRequestDto & { code: string };
export type UpdateUserRequestDto = Pick<UserDto, 'nickname'>;
export type UpdatePreferencesRequestDto = Pick<SectionPreferenceDto, 'sectionId' | 'preference'>[];

export type UserDto = { id: number; phone: string; nickname: string };
export type TokenDto = { accessToken: string; refreshToken: string };

export type SectionPreferenceDto = {
  userId: number;
  sectionId: number;
  sectionName: SectionType;
  preference: number;
};
export type SectionPreferenceRequestDto = Pick<SectionPreferenceDto, 'sectionId' | 'preference'>[];

export type SignInResponseDto = Expand<{
  user: UserDto;
  tokens: TokenDto;
  sectionPreferences: SectionPreferenceDto[];
  isCreated: boolean;
}>;

export type NewsProviderDto = { id: number; image: string; friendlyName: string; logoUrl: string };

export type NewsDto = {
  id: number;
  section: { id: number; name: string; friendlyName: string };
  providers: { id: number; name: string; friendlyName: string; logoUrl: string }[];
  keywords: { id: number; name: string }[];
  title: string;
  oneLineSummary: string;
  fullSummary: string;
  language: string;
  region: null | string;
  thumbnailUrl: string;
  createdAt: string;
  like: { isLiked: boolean; count: number };
  scrap: { isScrapped: boolean; count: number };
};

export type MyPageDto = {
  user: {
    id: number;
    nickname: string;
    phone: string;
    is_authenticated: boolean;
    created_at: string;
    updated_at: string;
  };
  sectionStats: {
    sectionId: number;
    sectionName: SectionType;
    preference: number;
    behaviorScore: number;
  }[];
  keywordStats: { keyword: string; count: number }[];
};
