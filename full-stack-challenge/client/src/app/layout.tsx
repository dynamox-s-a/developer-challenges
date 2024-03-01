import './global.css';

export const metadata = {
  title: 'DynaPredict',
  description: 'Machine and sensors management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
