import { Header } from '@/components/layout/Header';

export default function PrivateLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header />
        {children}
    </>
  );
}