import {
  APIResult,
  MyPageApiResponseDto,
  MyPageDto,
  NewsDto,
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

export async function getMyPageStats(): Promise<APIResult<MyPageDto>> {
  return api.get(`/users/mypage-stats`);
}

export async function getArticles(limit: number = 15, cursor?: string): Promise<APIResult<NewsDto[]>> {
  return api.get('/articles', { limit, cursor });
}

export async function postArticleLike(id: number): Promise<APIResult<null>> {
  return api.post(`/articles/${id}/like`);
}

export async function deleteArticleLike(id: number): Promise<APIResult<null>> {
  return api.delete(`/articles/${id}/like`);
}

export async function postArticleScrap(id: number): Promise<APIResult<null>> {
  return api.post(`/articles/${id}/scrap`);
}

export async function deleteArticleScrap(id: number): Promise<APIResult<null>> {
  return api.delete(`/articles/${id}/scrap`);
}

export async function postArticleEvent(id: number, eventType: 'VIEW' | 'DETAIL_VIEW'): Promise<APIResult<null>> {
  return api.post(`/articles/${id}/view-events`, { eventType });
}

export async function getScrapedArticles(
  limit: number = 15,
  cursor?: string,
  scraped: boolean = true,
): Promise<APIResult<NewsDto[]>> {
  return api.get(`/articles/`, { limit, cursor, scraped });
}
