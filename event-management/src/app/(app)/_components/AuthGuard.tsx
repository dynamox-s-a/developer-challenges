'use client';
import { useAppDispatch } from '@/store/hooks';
import { setUser } from '@/store/slices/authSlice';
import { decodeFakeJwtToken } from '@/utils/token';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.push('/login');
      return;
    }

    const decodedPayload = decodeFakeJwtToken(token);
    dispatch(setUser({ email: decodedPayload.sub, role: decodedPayload.role }));
  }, [router]);

  return <>{children}</>;
};

export default AuthGuard;
