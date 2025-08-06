import React, { useState, useEffect, useRef, useCallback } from 'react';
import SignInInput from './sign-in-input';

type SignInInputCodeProps = {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  timerDuration?: number;
};

const SignInInputCode = ({ value, onChange, timerDuration = 300 }: SignInInputCodeProps) => {
  const [timeLeft, setTimeLeft] = useState(timerDuration);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    setTimeLeft(timerDuration);
    intervalRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  }, [timerDuration]);

  useEffect(() => {
    startTimer();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [startTimer]);

  return (
    <div className="relative w-full">
      <label className="sr-only" htmlFor="code">
        인증번호 입력
      </label>
      <div className="relative">
        <SignInInput type="text" id="code" placeholder="인증번호" value={value} onChange={onChange} className="pr-16" />
        {timeLeft >= 0 && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 transform">
            <span className="typography-body2">{formatTime(timeLeft)}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default SignInInputCode;

const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
