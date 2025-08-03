export type Error = { status: number; message: string };
export type APIResult<T> = { error: Error; data: null } | { error: null; data: T };

export type PhoneRequestDto = { phoneNumber: string };
export type PhoneVerifyDto = PhoneRequestDto & { code: string };

export type UserDto = { id: number; phone: string; nickname: string };
export type TokenDto = { accessToken: string; refreshToken: string };

export type SignInResponseDto = { user: UserDto; tokens: TokenDto; isCreated: boolean };
