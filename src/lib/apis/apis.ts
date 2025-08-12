import {
  APIResult,
  PhoneRequestDto,
  SignInRequestDto,
  SignInResponseDto,
  UpdatePreferencesRequestDto,
  UpdateUserRequestDto,
} from '@/types/dto';
import api from './api-config';

export const authPhoneRequest = async ({ phoneNumber }: PhoneRequestDto): Promise<APIResult<null>> => {
  return api.post('/auth/phone/request', {
    phoneNumber: phoneNumber.replaceAll('-', ''),
  });
};

export async function authPhoneVerify({ phoneNumber, code }: SignInRequestDto): Promise<APIResult<SignInResponseDto>> {
  return api.post('/auth/phone/verify', {
    phoneNumber: phoneNumber.replaceAll('-', ''),
    code,
  });
}

export async function authUpdateUser({ nickname }: UpdateUserRequestDto): Promise<APIResult<null>> {
  return api.patch('/users', { nickname });
}

export async function authUpdatePreferences(preferences: UpdatePreferencesRequestDto) {
  return api.patch('/users/section-preferences', preferences);
}

export async function getArticles(params: { limit: number; cursor?: string }) {
  return api.get('/articles', params);
}
