import SignInForm from '@/components/features/sign-in/sign-in-form';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '로그인 페이지 | 썸즈 업',
  description: '...', // TODO: 생각하기
};

const SignInPage = () => (
  <main className="flex h-screen flex-col px-8 py-4">
    <h2 className="mb-20 mt-2 text-center typography-small-title">전화번호로 시작하기</h2>
    <SignInForm />
  </main>
);

export default SignInPage;
