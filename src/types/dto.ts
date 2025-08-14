import { Expand, SectionType } from './types';

export type Error = { status: number; message: string };
export type APIResult<T> = { error: Error; data: null } | { error: null; data: T };

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

export type SignInResponseDto = Expand<{
  user: UserDto;
  tokens: TokenDto;
  sectionPreferences: SectionPreferenceDto[];
  isCreated: boolean;
}>;

export type SectionPreferenceRequestDto = Pick<SectionPreferenceDto, 'sectionId' | 'preference'>[];

export type NewsProviderDto = { id: number; image: string; friendlyName: string; logoUrl: string };
