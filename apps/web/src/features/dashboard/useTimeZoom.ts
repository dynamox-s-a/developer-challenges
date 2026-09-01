import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Zoom temporal com a roda do mouse, sobre pontos JÁ carregados.
 *
 * Recorte de apresentação, não de dado: a série continua sendo a que o servidor agregou
 * para a janela — o scroll só aproxima a lente. Zoom centrado no cursor (a hora sob o
 * ponteiro fica parada enquanto o resto comprime), roda para trás afasta até o domínio
 * completo, duplo clique volta ao período inteiro.
 *
 * O listener é registrado à mão com `passive: false` porque um handler React de wheel não
 * pode chamar `preventDefault()` — e sem isso cada zoom rolaria a página junto.
 */
export interface TimeZoom {
  /** Anexar ao contêiner do gráfico. */
  ref: (node: HTMLElement | null) => void;
  /** Domínio visível [início, fim] em ms — o completo quando sem zoom. */
  domain: [number, number] | null;
  zoomed: boolean;
  reset: () => void;
}

const ZOOM_IN_FACTOR = 0.8;
const ZOOM_OUT_FACTOR = 1.25;

export function useTimeZoom(extent: [number, number] | null, minSpanMs: number): TimeZoom {
  const [domain, setDomain] = useState<[number, number] | null>(null);
  const domainRef = useRef(domain);
  domainRef.current = domain;
  const extentRef = useRef(extent);
  extentRef.current = extent;
  const minSpanRef = useRef(minSpanMs);
  minSpanRef.current = minSpanMs;

  // Outra série ou outra janela = outro domínio: o zoom anterior deixaria a tela vazia.
  const extentKey = extent ? `${extent[0]}:${extent[1]}` : 'none';
  useEffect(() => {
    setDomain(null);
  }, [extentKey]);

  const nodeRef = useRef<HTMLElement | null>(null);
  const cleanupRef = useRef<(() => void) | null>(null);

  const ref = useCallback((node: HTMLElement | null) => {
    cleanupRef.current?.();
    cleanupRef.current = null;
    nodeRef.current = node;
    if (!node) return;

    const onWheel = (event: WheelEvent) => {
      const full = extentRef.current;
      if (!full || full[1] <= full[0]) return;
      event.preventDefault();

      const [start, end] = domainRef.current ?? full;
      const span = end - start;
      const zoomingIn = event.deltaY < 0;
      const nextSpan = Math.max(
        minSpanRef.current,
        Math.min(full[1] - full[0], span * (zoomingIn ? ZOOM_IN_FACTOR : ZOOM_OUT_FACTOR)),
      );
      if (nextSpan === span) return;

      // A fração horizontal do cursor é o centro do zoom.
      const rect = node.getBoundingClientRect();
      const fraction = rect.width > 0 ? Math.min(1, Math.max(0, (event.clientX - rect.left) / rect.width)) : 0.5;
      const anchor = start + span * fraction;
      let nextStart = anchor - nextSpan * fraction;
      let nextEnd = nextStart + nextSpan;
      if (nextStart < full[0]) {
        nextStart = full[0];
        nextEnd = nextStart + nextSpan;
      }
      if (nextEnd > full[1]) {
        nextEnd = full[1];
        nextStart = nextEnd - nextSpan;
      }
      const covering = nextStart <= full[0] && nextEnd >= full[1];
      setDomain(covering ? null : [nextStart, nextEnd]);
    };

    const onDoubleClick = () => setDomain(null);

    node.addEventListener('wheel', onWheel, { passive: false });
    node.addEventListener('dblclick', onDoubleClick);
    cleanupRef.current = () => {
      node.removeEventListener('wheel', onWheel);
      node.removeEventListener('dblclick', onDoubleClick);
    };
  }, []);

  useEffect(() => () => cleanupRef.current?.(), []);

  const reset = useCallback(() => setDomain(null), []);

  return { ref, domain: domain ?? extent, zoomed: domain !== null, reset };
}

/** Duração de um bucket declarado pelo servidor ('15m', '1h', '4h', '1d') em ms. */
export function bucketToMs(bucket: string): number {
  const match = /^(\d+)([mhd])$/.exec(bucket);
  if (!match) return 3_600_000;
  const value = Number(match[1]);
  return value * (match[2] === 'm' ? 60_000 : match[2] === 'h' ? 3_600_000 : 86_400_000);
}
