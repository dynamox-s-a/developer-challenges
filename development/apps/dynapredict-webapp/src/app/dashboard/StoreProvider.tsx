'use client';

import React, { ReactNode, useRef } from 'react';
import { Provider } from 'react-redux';

import { AppStore, makeStore } from '@/lib/redux/store';

export default function StoreProvider({ children }: { children: ReactNode }): ReactNode {
  const storeRef = useRef<AppStore>();
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
