'use client';

import { ChangeEvent, FormEvent, useState } from 'react';
import { Button } from '@/components/ui/button';
import SignInInput from './sign-in-input';
import { useRouter } from 'next/navigation';
import { authPhoneRequest, authPhoneVerify } from '@/lib/apis/apis';
import { SignInRequestDto } from '@/types/dto';
import { toast } from '@/components/ui/toast';
import { useUserStore } from '@/lib/stores/user';
import { MdOutlineArrowForwardIos } from 'react-icons/md';
import SignInInputCode from './sign-in-input-code';
import { SectionType } from '@/types/types';

const SignInForm = () => {
  const [formValue, setFormValue] = useState<SignInRequestDto>({ phoneNumber: '', code: '' });
  const [step, setStep] = useState<keyof SignInRequestDto>('phoneNumber');
  const [errorMessage, setErrorMessage] = useState('');
  const [inputCodeKey, setInputCodeKey] = useState(crypto.randomUUID());
  const setUser = useUserStore(state => state.setUser);
  const router = useRouter();

  const handlePhoneNumberInput = (event: ChangeEvent<HTMLInputElement>) => {
    if (errorMessage) setErrorMessage('');
    const input = event.target.value;
    setFormValue(prev => ({ ...prev, phoneNumber: input }));
    setTimeout(() => setFormValue(prev => ({ ...prev, phoneNumber: formatPhoneNumber(input) })), 20);
  };

  const handleVerificationCodeInput = (event: ChangeEvent<HTMLInputElement>) => {
    if (errorMessage) setErrorMessage('');
    setFormValue(prev => ({ ...prev, code: event.target.value }));
  };

  const getConfirmDisable = () => {
    if (step === 'phoneNumber') return isInvalidPhoneNumber(formValue.phoneNumber);
    return formValue.code === '';
  };

  const handleClickRequestCode = async () => {
    setInputCodeKey(crypto.randomUUID());
    setFormValue(prev => ({ ...prev, code: '' }));
    const { error } = await authPhoneRequest(formValue);
    if (!error) setStep('code');
    else toast.serverError();
  };

  const handleClickSignIn = async () => {
    const { error, data } = await authPhoneVerify(formValue);
    if (!error) {
      const preferences = data.sectionPreferences.reduce((acc, c) => {
        acc.set(c.sectionName, c.preference);
        return acc;
      }, new Map()) as unknown as Record<SectionType, number>;

      setUser({ user: data.user, preferences });
      if (data.isCreated) return router.push('/set-nickname?isCreated=true');
      else return router.push('/');
    }
    if (error.status === 401) return setErrorMessage('인증번호가 일치하지 않습니다');
    if (error.status === 404) return setErrorMessage('인증번호가 만료되었거나 존재하지 않습니다');
    toast.serverError();
  };

  const handleConfirm = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (step === 'phoneNumber') return handleClickRequestCode();
    else return handleClickSignIn();
  };

  return (
    <form className="relative flex w-full flex-1 flex-col items-end" onSubmit={handleConfirm}>
      <label className="sr-only" htmlFor="phoneNumber">
        전화번호 입력
      </label>
      <SignInInput
        type="tel"
        id="phoneNumber"
        placeholder="전화번호"
        value={formValue.phoneNumber}
        onChange={handlePhoneNumberInput}
        disabled={step !== 'phoneNumber'}
        className="mb-2"
      />

      {step === 'code' && (
        <SignInInputCode key={inputCodeKey} value={formValue.code} onChange={handleVerificationCodeInput} />
      )}
      {!errorMessage && step === 'code' && (
        <Button
          type="button"
          variant="ghost"
          size="fit"
          onClick={handleClickRequestCode}
          className="mt-2 flex items-center gap-0.5 typography-caption"
        >
          인증번호 재발송
          <MdOutlineArrowForwardIos />
        </Button>
      )}
      {errorMessage && <p className="w-full pl-1 text-error typography-caption">{errorMessage}</p>}
      <Button type="submit" className="absolute bottom-4" disabled={getConfirmDisable()}>
        확인
      </Button>
    </form>
  );
};
export default SignInForm;

const isInvalidPhoneNumber = (phoneNumber: string): boolean => {
  const phoneNumberRegex = /^\d{3}-\d{3,4}-\d{4}$/;
  return !phoneNumberRegex.test(phoneNumber);
};

const formatPhoneNumber = (input: string): string => {
  const numbers = input.replace(/\D/g, '').substring(0, 11);
  return numbers
    .replace(/^(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
    .replace(/^(\d{3})(\d{3})(\d{1,4})/, '$1-$2-$3')
    .replace(/^(\d{3})(\d{1,3})$/, '$1-$2')
    .replace(/^(\d{3})$/, '$1');
};
