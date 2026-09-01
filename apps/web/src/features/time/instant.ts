/**
 * Camada temporal única da aplicação.
 *
 * CONVENÇÃO: **tudo é UTC**. O banco grava `timestamptz`, a API responde ISO 8601 em UTC,
 * a URL carrega instantes ISO em UTC e a interface apresenta esses mesmos instantes em UTC,
 * dizendo isso na tela (`TIME_ZONE_LABEL`).
 *
 * Por que não o fuso do navegador: o mapa de atividade é agrupado por dia/hora NO BANCO.
 * Se a tela convertesse para o fuso local, a célula "30/08 14h" passaria a mostrar dados de
 * outra hora, e o título da janela, os chips e a tabela discordariam entre si. Ou o banco
 * agrupa no fuso do cliente (parâmetro novo em toda consulta), ou a tela fala UTC. A segunda
 * opção é a que não inventa arquitetura — e ainda torna os testes independentes do fuso da
 * máquina que os roda.
 *
 * Nenhum componente deve criar `Intl.DateTimeFormat` ou fatiar `toISOString()` por conta
 * própria: todo instante que aparece na tela ou na URL passa por aqui.
 */

export const DISPLAY_TIME_ZONE = 'UTC';
export const TIME_ZONE_LABEL = 'UTC';

const HOUR_MS = 3_600_000;

const dateOnly = new Intl.DateTimeFormat('pt-BR', {
  timeZone: DISPLAY_TIME_ZONE,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const dateTime = new Intl.DateTimeFormat('pt-BR', {
  timeZone: DISPLAY_TIME_ZONE,
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

const shortDateTime = new Intl.DateTimeFormat('pt-BR', {
  timeZone: DISPLAY_TIME_ZONE,
  day: '2-digit',
  month: 'short',
  hour: '2-digit',
  minute: '2-digit',
});

const timeOnly = new Intl.DateTimeFormat('pt-BR', {
  timeZone: DISPLAY_TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
});

const chartTick = new Intl.DateTimeFormat('pt-BR', {
  timeZone: DISPLAY_TIME_ZONE,
  day: '2-digit',
  month: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
});

/** Instante aceito em qualquer helper: ISO da API, epoch em ms ou ausência de leitura. */
export type Instant = string | number | null | undefined;

/** Epoch em ms, ou `null` quando não há instante válido. Ponto único de parsing. */
export function parseInstant(value: Instant): number | null {
  if (value === null || value === undefined) return null;
  const parsed = typeof value === 'number' ? value : Date.parse(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function format(formatter: Intl.DateTimeFormat, value: Instant, empty: string): string {
  const parsed = parseInstant(value);
  if (parsed === null) return value === null || value === undefined ? empty : 'Data inválida';
  return formatter.format(new Date(parsed));
}

/** `30/08/2026` */
export function formatDate(value: Instant, empty = '—'): string {
  return format(dateOnly, value, empty);
}

/** `30/08/2026 14:02:05` */
export function formatDateTime(value: Instant, empty = '—'): string {
  return format(dateTime, value, empty);
}

/** `30/ago 14:02` — para listas densas, onde o ano não acrescenta nada. */
export function formatShortDateTime(value: Instant, empty = '—'): string {
  return format(shortDateTime, value, empty);
}

/** `14:02` */
export function formatTime(value: Instant, empty = '—'): string {
  return format(timeOnly, value, empty);
}

/** Rótulo de eixo temporal: `30/08 14:02`. */
export function formatChartTick(value: Instant): string {
  return format(chartTick, value, '—');
}

/** `30/ago 11:00 → 30/ago 12:00` */
export function formatRange(from: Instant, to: Instant): string {
  if (parseInstant(from) === null || parseInstant(to) === null) {
    return 'Sem intervalo disponível';
  }
  return `${formatShortDateTime(from)} → ${formatShortDateTime(to)}`;
}

export function formatRelativeTime(value: Instant, nowMs = Date.now()): string {
  const at = parseInstant(value);
  if (at === null) return value === null || value === undefined ? 'sem leitura' : 'timestamp inválido';
  const delta = nowMs - at;
  // Tolerância de 5 min: relógios levemente adiantados não viram "futuro".
  if (delta < -5 * 60 * 1000) return `no futuro (${formatShortDateTime(value)})`;
  const absolute = Math.max(0, delta);
  if (absolute < 60_000) return 'agora';
  if (absolute < HOUR_MS) return `há ${Math.floor(absolute / 60_000)} min`;
  if (absolute < 24 * HOUR_MS) return `há ${Math.floor(absolute / HOUR_MS)} h`;
  return `há ${Math.floor(absolute / (24 * HOUR_MS))} dias`;
}

/** Dia UTC no formato usado pelas rotas e pelas células do mapa: `2026-08-30`. */
export function dayKey(value: Instant): string | null {
  const parsed = parseInstant(value);
  return parsed === null ? null : new Date(parsed).toISOString().slice(0, 10);
}

/** Hora UTC do instante (0–23) — a mesma que a API usa para agrupar as células. */
export function hourOfDay(value: Instant): number | null {
  const parsed = parseInstant(value);
  return parsed === null ? null : new Date(parsed).getUTCHours();
}

/** Rótulo humano de um dia UTC (`2026-08-30` → `30/08`), sem reinterpretar o fuso. */
export function formatDayKey(day: string): string {
  return `${day.slice(8, 10)}/${day.slice(5, 7)}`;
}

/** Rótulo de hora cheia: `14h`. */
export function formatHourLabel(hour: number): string {
  return `${String(hour).padStart(2, '0')}h`;
}

/** Janela de uma hora que contém o instante — o recorte que a investigação consulta. */
export function hourWindow(value: Instant): { from: string; to: string } | null {
  const parsed = parseInstant(value);
  if (parsed === null) return null;
  const start = Math.floor(parsed / HOUR_MS) * HOUR_MS;
  return { from: new Date(start).toISOString(), to: new Date(start + HOUR_MS).toISOString() };
}

/** Janela de um dia UTC inteiro. */
export function dayWindow(value: Instant): { from: string; to: string } | null {
  const day = dayKey(value);
  if (day === null) return null;
  const start = Date.parse(`${day}T00:00:00.000Z`);
  return { from: new Date(start).toISOString(), to: new Date(start + 24 * HOUR_MS).toISOString() };
}

const WEEKDAYS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];

/** Dia da semana de um dia UTC (`2026-08-30` → `dom`). */
export function formatWeekdayKey(day: string): string {
  const parsed = Date.parse(`${day}T00:00:00.000Z`);
  return Number.isFinite(parsed) ? WEEKDAYS[new Date(parsed).getUTCDay()] : '';
}

/** Rota da janela de uma hora, com o recorte ISO UTC preservado na query. */
export function hourWindowPath(bucketStart: string): string {
  const window = hourWindow(bucketStart);
  const day = dayKey(bucketStart);
  const hour = hourOfDay(bucketStart);
  if (!window || day === null || hour === null) return '/';
  const query = new URLSearchParams({ from: window.from, to: window.to });
  return `/monitoring/windows/${day}/${String(hour).padStart(2, '0')}?${query.toString()}`;
}

/**
 * Janela reconstruída a partir dos segmentos da rota (`/monitoring/windows/:date/:hour`).
 *
 * É o que torna a URL auto-suficiente: sem `from`/`to` na query, o próprio caminho define
 * o recorte — e um link colado sem a query continua abrindo a hora certa.
 */
export function windowFromPath(date: string, hour: string): { from: string; to: string } | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{1,2}$/.test(hour)) return null;
  const hourNumber = Number(hour);
  if (hourNumber < 0 || hourNumber > 23) return null;
  const start = Date.parse(`${date}T${String(hourNumber).padStart(2, '0')}:00:00.000Z`);
  if (!Number.isFinite(start)) return null;
  return { from: new Date(start).toISOString(), to: new Date(start + HOUR_MS).toISOString() };
}
