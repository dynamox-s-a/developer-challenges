import { useRouter } from 'next/router';
import { useEffect } from 'react';
import type { ReactNode } from 'react';
import { useAppSelector } from 'store/store';

type RouteGuardProps = {
  children: ReactNode;
};

export const RouteGuard = ({ children }: RouteGuardProps) => {
  const router = useRouter();
  const accessToken = useAppSelector((state) => state.user.user.accessToken);

  useEffect(() => {
    if (router.isReady && !accessToken) {
      router.push('/login');
    }
  }, [accessToken, router]);

  return children as JSX.Element;
};

export default RouteGuard;
