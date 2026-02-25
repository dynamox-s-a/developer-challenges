'use client';

import AuthGuard from '@/app/(app)/_components/AuthGuard';
import Header from '@/app/(app)/_components/Header';

const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <AuthGuard>
      <Header />
      {children}
    </AuthGuard>
  );
};

export default AppLayout;
