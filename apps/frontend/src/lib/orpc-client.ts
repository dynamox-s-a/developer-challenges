import { createORPCClient, onError } from '@orpc/client';
import type { ContractRouterClient } from '@orpc/contract';
import type { JsonifiedClient } from '@orpc/openapi-client';
import { OpenAPILink } from '@orpc/openapi-client/fetch';
import { contracts } from '@repo/contracts';

import { CONFIG } from 'src/global-config';

const link = new OpenAPILink(contracts, {
  url: () => `${CONFIG.apiUrl}/api`,
  headers: () => ({ 'Content-Type': 'application/json' }),
  interceptors: [onError((error) => console.error('[orpc-client]', error))],
});

export const orpcClient: JsonifiedClient<ContractRouterClient<typeof contracts>> = createORPCClient(link);

const isNetworkError = (error: unknown): boolean =>
  error instanceof TypeError && /fetch|network|load failed/i.test(error.message);

export const getOrpcErrorMessage = (error: unknown): string => {
  if (isNetworkError(error)) {
    return `Não foi possível conectar à API em ${CONFIG.apiUrl}. Verifique se o backend está no ar (bun run dev).`;
  }

  if (error instanceof Error && error.message) return error.message;
  if (typeof error === 'string') return error;
  if (error && typeof error === 'object' && 'message' in error && typeof error.message === 'string') {
    return error.message;
  }

  return 'Falha ao buscar os dados do sensor.';
};
