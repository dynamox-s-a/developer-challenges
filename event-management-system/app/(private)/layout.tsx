import { Header } from '@/components/layout/Header';

export default function RootLayout({
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