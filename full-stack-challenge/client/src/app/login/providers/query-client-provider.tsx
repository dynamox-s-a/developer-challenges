'use client';
import { QueryClient, QueryClientProvider as TNQueryClientProvider } from '@tanstack/react-query';
import { ReactQueryStreamedHydration } from '@tanstack/react-query-next-experimental';
import React from 'react';

export interface QueryClientProviderProps {
  children: React.ReactNode;
}
const QueryClientProvider: React.FC<QueryClientProviderProps> = ({ children }) => {
  const [client] = React.useState(new QueryClient());
  return (
    <TNQueryClientProvider client={client}>
      <ReactQueryStreamedHydration>{children}</ReactQueryStreamedHydration>
    </TNQueryClientProvider>
  );
};

export default QueryClientProvider;
