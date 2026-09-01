import { machineSlug, pointSlug } from '@dynamox/domain';

import { hourWindow } from '../time/instant';

/**
 * Geração central dos links da investigação.
 *
 * Existe porque os pontos de entrada se multiplicaram — prioridade, matriz, ocorrências,
 * KPIs, breadcrumbs, tabelas — e cada um montando a própria URL é como o produto acaba com
 * dois caminhos que deveriam ser o mesmo. Aqui a regra é única: identificador natural no
 * caminho, recorte temporal na query, sempre preservado ao descer ou subir um nível.
 */
export interface AnalyticsRange {
  from: string;
  to: string;
}

/** Caminho + recorte na query. `extra` só entra quando tem valor. */
function withQuery(
  path: string,
  range: AnalyticsRange,
  extra: Record<string, string | undefined> = {},
): string {
  const query = new URLSearchParams({ from: range.from, to: range.to });
  for (const [key, value] of Object.entries(extra)) {
    if (value !== undefined) query.set(key, value);
  }
  return `${path}?${query.toString()}`;
}

export const links = {
  /**
   * Página canônica da máquina. O segmento é a etiqueta ("P-101"), não o UUID.
   *
   * Operação e cadastro moram na MESMA rota: duas páginas para a mesma entidade é como um
   * produto acaba com dois nomes para a mesma coisa. `/assets/...` continua funcionando
   * por compatibilidade, redirecionando para cá.
   */
  machine(machineName: string, range: AnalyticsRange): string {
    return withQuery(`/machines/${encodeURIComponent(machineSlug(machineName))}`, range);
  },

  /** Página canônica do ponto, dentro da máquina a que ele pertence. */
  point(machineName: string, pointName: string, range: AnalyticsRange): string {
    return withQuery(
      `/machines/${encodeURIComponent(machineSlug(machineName))}/points/${encodeURIComponent(pointSlug(pointName))}`,
      range,
    );
  },

  /** Página analítica do sensor; `bucket` acompanha quando a origem sabe a granularidade útil. */
  sensor(serialNumber: string, range: AnalyticsRange, bucket?: string): string {
    return withQuery(`/sensors/${encodeURIComponent(serialNumber)}`, range, { bucket });
  },

  /** Janela de uma hora a partir de um instante qualquer dentro dela. */
  window(instant: string): string {
    const period = hourWindow(instant);
    if (!period) return '/';
    const day = period.from.slice(0, 10);
    const hour = period.from.slice(11, 13);
    return withQuery(`/monitoring/windows/${day}/${hour}`, period);
  },


  /**
   * Listagem de alertas com o recorte na query. Sem `range`: os alertas têm o próprio tempo
   * (abertura e resolução) e a lista padrão é "o que está ativo agora", não uma janela.
   */
  alerts(filters: Record<string, string | undefined> = {}): string {
    const query = new URLSearchParams();
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== '') query.set(key, value);
    }
    const suffix = query.toString();
    return suffix ? `/alerts?${suffix}` : '/alerts';
  },

  alert(id: string): string {
    return `/alerts/${encodeURIComponent(id)}`;
  },

  acquisition(cycleId: string, range: AnalyticsRange): string {
    return withQuery(`/acquisitions/${cycleId}`, range);
  },

  samples(cycleId: string, range: AnalyticsRange): string {
    return withQuery(`/acquisitions/${cycleId}/samples`, range);
  },
};
