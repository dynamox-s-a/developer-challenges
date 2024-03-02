'use client';
import { store } from 'client/src/app/store/store';
import React from 'react';
import { Provider } from 'react-redux';

export const StoreProvider = ({ children }: { children: React.ReactNode }) => {
  return <Provider store={store}>{children}</Provider>;
};
