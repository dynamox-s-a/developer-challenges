import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { ApiError } from '../../api/client';
import type { RequestStatus } from '../../store/requestStatus';

/**
 * Consulta analítica de uma página de investigação.
 *
 * Estado local, não global: cada página vive do seu recorte, e o contexto de navegação
 * mora na URL. Uma resposta atrasada de um recorte anterior é descartada — a mesma
 * proteção que o painel já aplicava ao detalhe da série.
 */
export interface AnalyticsQuery<T> {
  status: RequestStatus;
  data: T | null;
  error: string | null;
  /** Status HTTP da falha: separa "não existe" (404) de "recorte inválido" (400). */
  httpStatus: number | null;
  reload: () => void;
}

export function useAnalyticsQuery<T>(
  fetcher: () => Promise<T>,
  deps: ReadonlyArray<unknown>,
): AnalyticsQuery<T> {
  const [status, setStatus] = useState<RequestStatus>('idle');
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [httpStatus, setHttpStatus] = useState<number | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let current = true;
    setStatus('loading');
    setError(null);
    setHttpStatus(null);
    fetcher()
      .then((result) => {
        if (!current) return;
        setData(result);
        setStatus('succeeded');
      })
      .catch((reason: unknown) => {
        if (!current) return;
        setError(reason instanceof Error ? reason.message : 'Erro desconhecido.');
        setHttpStatus(reason instanceof ApiError ? reason.status : null);
        setStatus('failed');
      });
    return () => {
      current = false;
    };
    // As dependências são declaradas por quem chama (o recorte da consulta): a lista é
    // dinâmica por natureza, e o `fetcher` é recriado a cada render.
     
  }, [...deps, attempt]);

  const reload = useCallback(() => setAttempt((value) => value + 1), []);
  return { status, data, error, httpStatus, reload };
}

/**
 * Janela temporal lida da URL — instantes ISO em UTC, sempre.
 *
 * `fallback` permite que uma rota derive o recorte do próprio caminho (a janela horária faz
 * isso), de modo que um link sem query ainda abra o intervalo correto. Sem nenhum dos dois,
 * o padrão são os últimos 7 dias.
 */
export function useTimeRange(fallback?: { from: string; to: string } | null): {
  from: string;
  to: string;
  search: URLSearchParams;
} {
  const [search] = useSearchParams();
  const fallbackFrom = fallback?.from ?? null;
  const fallbackTo = fallback?.to ?? null;
  return useMemo(() => {
    const to = search.get('to') ?? fallbackTo ?? new Date().toISOString();
    const from =
      search.get('from') ??
      fallbackFrom ??
      new Date(Date.parse(to) - 7 * 24 * 60 * 60 * 1000).toISOString();
    return { from, to, search };
  }, [search, fallbackFrom, fallbackTo]);
}
