import type { NextPage } from 'next';
import dynamic from 'next/dynamic';
import { Suspense } from 'react';

// We disable SSR for the main SPA entry point to allow React Router to manage the browser history
const AppRoot = dynamic(() => import('../main-spa'), {
  ssr: false,
});

const CatchAllPage: NextPage = () => {
  return (
    <Suspense fallback={null}>
      <AppRoot />
    </Suspense>
  );
};

export default CatchAllPage;
