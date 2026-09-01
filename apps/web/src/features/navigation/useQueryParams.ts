import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

/**
 * Estado de tela que mora na URL: recorte temporal, filtro, página, ordenação.
 *
 * A regra do produto é que uma investigação seja compartilhável — colar o endereço num
 * chat tem que reproduzir a mesma tela. Estado de filtro guardado só em `useState` quebra
 * isso e também quebra o botão "voltar", que passaria a sair da página em vez de desfazer
 * o último recorte.
 *
 * `patch` com `null` remove o parâmetro: ausência é a forma canônica de "sem filtro" —
 * `?condition=` vazio seria um terceiro estado para a mesma coisa.
 */
export interface QueryParamsApi {
  get: (key: string) => string | null;
  /** Aplica um patch; por padrão empilha no histórico (o "voltar" desfaz o filtro). */
  set: (patch: Record<string, string | null>, options?: { replace?: boolean }) => void;
}

export function useQueryParams(): QueryParamsApi {
  const [search, setSearch] = useSearchParams();

  const set = useCallback(
    (patch: Record<string, string | null>, options: { replace?: boolean } = {}) => {
      const next = new URLSearchParams(search);
      for (const [key, value] of Object.entries(patch)) {
        if (value === null || value === '') next.delete(key);
        else next.set(key, value);
      }
      setSearch(next, { replace: options.replace ?? false });
    },
    [search, setSearch],
  );

  const get = useCallback((key: string) => search.get(key), [search]);

  return { get, set };
}
