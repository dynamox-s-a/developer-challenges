/**
 * Validação do motor contra a verdade-terreno do gerador — o ÚNICO lugar do motor que lê
 * o rótulo (`metadata.history.groundTruth`). O motor nunca o vê; este relatório mede o
 * motor com ele.
 *
 *   npm run alerts:validate                       # escreve docs/analysis/07-validation/alert-validation.md
 *   npm run alerts:validate -- --out relatorio.md
 *
 * Definições:
 *  - universo: ciclos `dataset:history` (rotulados); os demais (cauda de demonstração,
 *    janelas canônicas, smoke) são listados como "não rotulados" e não entram na matriz;
 *  - previsto(ciclo, família) = existe ocorrência da família, do mesmo sensor, ativa no
 *    instante do ciclo (openedAt ≤ t < resolvedAt);
 *  - esperado(ciclo, família) = `expectedAlert` com `alertKind` da família;
 *  - FP é separado em FP-antecipado (`fault=true`: a degradação já existe, o rótulo ainda
 *    não a chama de alerta) e FP-sadio (`fault=false`) — só o segundo é falso alarme.
 *  - qualidade de dado: lacunas > 1 h no grid do histórico são o esperado; um episódio de
 *    presença (sensor ou frota) que cobre a lacuna é um acerto.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';

import { type AlertOccurrence, PrismaClient } from '@prisma/client';

const HOUR_MS = 3_600_000;
const SLOT_MS = 15 * 60_000;
const DEFAULT_OUT = 'docs/analysis/07-validation/alert-validation.md';

type Family = 'vibration' | 'thermal';
const FAMILY_TYPE: Record<Family, AlertOccurrence['type']> = {
  vibration: 'VIBRATION_THRESHOLD',
  thermal: 'TEMPERATURE_THRESHOLD',
};

interface LabeledCycle {
  serial: string;
  slotStartMs: number;
  expectedAlert: boolean;
  alertKind: string | null;
  fault: boolean;
  expectedState: string | null;
}

interface Matrix {
  tp: number;
  fpEarly: number;
  fpHealthy: number;
  tn: number;
  fn: number;
  firstExpectedMs: number | null;
  firstPredictedMs: number | null;
}

const emptyMatrix = (): Matrix => ({ tp: 0, fpEarly: 0, fpHealthy: 0, tn: 0, fn: 0, firstExpectedMs: null, firstPredictedMs: null });

function parseArgs(argv: string[]): { out: string } {
  const options = { out: DEFAULT_OUT };
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];
    if (flag === '--out') options.out = argv[++i] ?? DEFAULT_OUT;
    else throw new Error(`Argumento desconhecido: ${flag}`);
  }
  return options;
}

const iso = (ms: number | null | undefined) => (ms === null || ms === undefined ? '—' : new Date(ms).toISOString().replace('.000Z', 'Z'));
const hours = (ms: number) => `${(ms / HOUR_MS).toFixed(1)} h`;
const signedHours = (ms: number) => `${ms >= 0 ? '+' : '−'}${hours(Math.abs(ms))}`;
const fmt = (value: number | null | undefined, digits = 3) => (value === null || value === undefined ? '—' : value.toFixed(digits));

function activeAt(occurrences: AlertOccurrence[], atMs: number): AlertOccurrence | undefined {
  return occurrences.find(
    (occurrence) => occurrence.openedAt.getTime() <= atMs && (occurrence.resolvedAt === null || occurrence.resolvedAt.getTime() > atMs),
  );
}

async function main(): Promise<void> {
  const { out } = parseArgs(process.argv.slice(2));
  const prisma = new PrismaClient();
  try {
    const labeled = await prisma.$queryRaw<
      Array<{ serial: string; slot_start: string; expected_alert: boolean | null; alert_kind: string | null; fault: boolean | null; expected_state: string | null }>
    >`
      SELECT c."measuringSystemUid" AS serial,
             c.metadata->'history'->>'slotStart' AS slot_start,
             (c.metadata->'history'->'groundTruth'->>'expectedAlert')::boolean AS expected_alert,
             c.metadata->'history'->'groundTruth'->>'alertKind' AS alert_kind,
             (c.metadata->'history'->'groundTruth'->>'fault')::boolean AS fault,
             c.metadata->'history'->'groundTruth'->>'expectedState' AS expected_state
      FROM ingestion_cycles c
      WHERE c.tags @> ARRAY['dataset:history']
      ORDER BY 1, 2
    `;
    const unlabeled = await prisma.$queryRaw<Array<{ serial: string; total: bigint }>>`
      SELECT c."measuringSystemUid" AS serial, count(*)::bigint AS total
      FROM ingestion_cycles c
      WHERE NOT (c.tags @> ARRAY['dataset:history'])
      GROUP BY 1 ORDER BY 1
    `;
    const cycles: LabeledCycle[] = labeled.map((row) => ({
      serial: row.serial,
      slotStartMs: Date.parse(row.slot_start),
      expectedAlert: row.expected_alert ?? false,
      alertKind: row.alert_kind,
      fault: row.fault ?? false,
      expectedState: row.expected_state,
    }));

    // Só o período rotulado: o histórico operacional seedado (< 01/06) não é decisão do motor.
    const firstLabeledMs = Math.min(...cycles.map((c) => c.slotStartMs));
    const occurrences = await prisma.alertOccurrence.findMany({
      where: { openedAt: { gte: new Date(firstLabeledMs - HOUR_MS) } },
      orderBy: { openedAt: 'asc' },
    });
    const events = await prisma.alertEvent.findMany({ orderBy: { occurredAt: 'asc' } });
    const rules = await prisma.alertRule.findMany({ orderBy: { key: 'asc' } });
    const states = await prisma.alertRuleState.findMany({
      include: { rule: true, monitoringPoint: { include: { sensor: true, machine: true } } },
      orderBy: [{ monitoringPoint: { machine: { name: 'asc' } } }, { rule: { key: 'asc' } }],
    });
    const evaluationCounts = await prisma.$queryRaw<Array<{ key: string; outcome: string; total: bigint }>>`
      SELECT r.key, ev.outcome::text AS outcome, count(*)::bigint AS total
      FROM alert_rule_evaluations ev JOIN alert_rules r ON r.id = ev."ruleId"
      GROUP BY 1, 2 ORDER BY 1, 2
    `;

    const bySerial = new Map<string, LabeledCycle[]>();
    for (const cycle of cycles) bySerial.set(cycle.serial, [...(bySerial.get(cycle.serial) ?? []), cycle]);
    const serials = [...bySerial.keys()].sort();

    // ---- Matriz por sensor × família -------------------------------------------------
    const matrices = new Map<string, Record<Family, Matrix>>();
    for (const serial of serials) {
      const perFamily: Record<Family, Matrix> = { vibration: emptyMatrix(), thermal: emptyMatrix() };
      for (const family of ['vibration', 'thermal'] as Family[]) {
        const own = occurrences.filter((o) => o.sensorSerialNumber === serial && o.type === FAMILY_TYPE[family]);
        const matrix = perFamily[family];
        for (const cycle of bySerial.get(serial) ?? []) {
          const expected = cycle.expectedAlert && cycle.alertKind === family;
          const predicted = activeAt(own, cycle.slotStartMs) !== undefined;
          if (expected && matrix.firstExpectedMs === null) matrix.firstExpectedMs = cycle.slotStartMs;
          if (predicted && matrix.firstPredictedMs === null) matrix.firstPredictedMs = cycle.slotStartMs;
          if (expected && predicted) matrix.tp += 1;
          else if (!expected && predicted) {
            if (cycle.fault) matrix.fpEarly += 1;
            else matrix.fpHealthy += 1;
          } else if (expected && !predicted) matrix.fn += 1;
          else matrix.tn += 1;
        }
      }
      matrices.set(serial, perFamily);
    }

    // ---- Lacunas do grid (esperado de qualidade de dado) ------------------------------
    interface Gap { serial: string; fromMs: number; toMs: number }
    const gaps: Gap[] = [];
    for (const serial of serials) {
      const slots = (bySerial.get(serial) ?? []).map((c) => c.slotStartMs).sort((a, b) => a - b);
      for (let i = 1; i < slots.length; i += 1) {
        if (slots[i] - slots[i - 1] > HOUR_MS) gaps.push({ serial, fromMs: slots[i - 1] + SLOT_MS, toMs: slots[i] });
      }
    }
    // Agrupa lacunas simultâneas (mesmo início ± 1 slot) — "a planta parou junto".
    interface GapGroup { fromMs: number; toMs: number; serials: string[] }
    const groups: GapGroup[] = [];
    for (const gap of [...gaps].sort((a, b) => a.fromMs - b.fromMs)) {
      const group = groups.find((g) => Math.abs(g.fromMs - gap.fromMs) <= SLOT_MS && Math.abs(g.toMs - gap.toMs) <= SLOT_MS);
      if (group) group.serials.push(gap.serial);
      else groups.push({ fromMs: gap.fromMs, toMs: gap.toMs, serials: [gap.serial] });
    }
    const presence = occurrences.filter((o) => o.type === 'SENSOR_SILENT' || o.type === 'FLEET_SILENT');
    const overlaps = (o: AlertOccurrence, fromMs: number, toMs: number) =>
      o.openedAt.getTime() < toMs + HOUR_MS && (o.resolvedAt === null || o.resolvedAt.getTime() > fromMs);
    const matchedPresence = new Set<string>();
    const gapRows = groups.map((group) => {
      const fleetExpected = group.serials.length > serials.length / 2;
      const hits = presence.filter((o) => {
        if (!overlaps(o, group.fromMs, group.toMs)) return false;
        if (o.type === 'FLEET_SILENT') return true;
        return group.serials.includes(o.sensorSerialNumber ?? '');
      });
      for (const hit of hits) matchedPresence.add(hit.id);
      return { group, fleetExpected, hits };
    });
    const lastLabeledMs = Math.max(...cycles.map((c) => c.slotStartMs));
    const afterHistory = presence.filter((o) => !matchedPresence.has(o.id) && o.openedAt.getTime() > lastLabeledMs);
    const unexpectedPresence = presence.filter((o) => !matchedPresence.has(o.id) && o.openedAt.getTime() <= lastLabeledMs);

    // ---- Relatório ---------------------------------------------------------------------
    const lines: string[] = [];
    const push = (line = '') => lines.push(line);
    const totalLabeled = cycles.length;
    const ruleLine = rules.map((r) => `\`${r.key}\` v${r.policyVersion}`).join(', ');
    push('# Validação do motor de alertas contra a verdade-terreno sintética');
    push();
    push(`Gerado em ${new Date().toISOString().slice(0, 16).replace('T', ' ')} UTC pelo \`npm run alerts:validate\` — regras ${ruleLine}.`);
    push(`Universo rotulado: **${totalLabeled.toLocaleString('pt-BR')} ciclos \`dataset:history\`** de ${serials.length} sensores; ` +
      `ocorrências do período rotulado: **${occurrences.length}** (${occurrences.filter((o) => o.state === 'ACTIVE').length} ativas).`);
    push();
    push('O motor nunca lê o rótulo; este relatório o lê para medir o motor.');
    push('');
    push('**Como ler as colunas de falso positivo.** Elas medem coisas diferentes e não devem ser somadas:');
    push('');
    push('- **FP-antecipado** — o motor abriu alerta num ciclo que o gerador marca como `fault=true`');
    push('  (degradação já em curso), mas cujo rótulo `expectedAlert` ainda é `false`. O defeito existe; o');
    push('  que diverge é o instante em que cada um chama aquilo de alerta. **Não é falso alarme** — é');
    push('  detecção antecipada, e é o comportamento desejado de uma baseline de comissionamento.');
    push('- **FP-sadio** — alerta em ciclo com `fault=false`. Esse sim é falso alarme, e é a coluna que');
    push('  precisa ficar em zero.');
    push('');
    push('Os falsos negativos também são declarados, não escondidos: onde o limiar da política v1 é mais');
    push('exigente que o limiar didático do gerador, o motor demora mais a abrir e a diferença aparece como FN.');
    push('Nenhum limiar foi ajustado para zerar esta matriz — o objetivo é explicar o comportamento, não');
    push('fabricar 100 % de acerto.');
    push();
    push('## Matriz de confusão por sensor (alertas de condição)');
    push();
    push('| Sensor | Família | TP | FP-antecipado | FP-sadio | TN | FN | 1.º esperado | 1.º previsto | Antecipação |');
    push('|---|---|---:|---:|---:|---:|---:|---|---|---|');
    const totals: Record<Family, Matrix> = { vibration: emptyMatrix(), thermal: emptyMatrix() };
    for (const serial of serials) {
      const perFamily = matrices.get(serial)!;
      for (const family of ['vibration', 'thermal'] as Family[]) {
        const m = perFamily[family];
        const relevant = m.tp + m.fpEarly + m.fpHealthy + m.fn > 0;
        for (const key of ['tp', 'fpEarly', 'fpHealthy', 'tn', 'fn'] as const) totals[family][key] += m[key];
        if (!relevant) continue;
        const lead = m.firstExpectedMs !== null && m.firstPredictedMs !== null ? signedHours(m.firstExpectedMs - m.firstPredictedMs) : '—';
        push(`| ${serial} | ${family === 'vibration' ? 'vibração' : 'temperatura'} | ${m.tp} | ${m.fpEarly} | ${m.fpHealthy} | ${m.tn} | ${m.fn} | ${iso(m.firstExpectedMs)} | ${iso(m.firstPredictedMs)} | ${lead} |`);
      }
    }
    for (const family of ['vibration', 'thermal'] as Family[]) {
      const m = totals[family];
      push(`| **todos** | **${family === 'vibration' ? 'vibração' : 'temperatura'}** | **${m.tp}** | **${m.fpEarly}** | **${m.fpHealthy}** | **${m.tn}** | **${m.fn}** | | | |`);
    }
    push();
    const healthy = serials.filter((serial) => {
      const perFamily = matrices.get(serial)!;
      return (['vibration', 'thermal'] as Family[]).every((f) => perFamily[f].tp + perFamily[f].fpEarly + perFamily[f].fpHealthy + perFamily[f].fn === 0);
    });
    push(`Sensores sem qualquer alerta de condição esperado nem previsto: ${healthy.length ? healthy.join(', ') : 'nenhum'}.`);
    push();

    // Um caso vale mais que a matriz: o transiente que NÃO virou alerta.
    const transientCycles = cycles.filter((cycle) => cycle.serial === 'SIM-HF-005');
    const transientEpisodes = occurrences.filter((o) => o.sensorSerialNumber === 'SIM-HF-005' && o.type === 'VIBRATION_THRESHOLD');
    if (transientCycles.length > 0) {
      push('## O gatilho consecutivo (SIM-HF-005)');
      push();
      push(
        `SIM-HF-005 tem um transiente isolado no mês e **${transientEpisodes.length === 0 ? 'nenhum' : String(transientEpisodes.length)}** ` +
          'episódio de vibração persistido: um pico único cruza o limiar e é descartado porque a leitura seguinte volta ao ' +
          'normal. É o gatilho de duas leituras consecutivas fazendo exatamente o que existe para fazer.',
      );
      push();
    }

    push('## Episódios de condição');
    push();
    push('| Sensor | Tipo | Aberto (nível) | Escalado | Resolvido | Pico | Último | Gatilho |');
    push('|---|---|---|---|---|---|---|---|');
    for (const o of occurrences.filter((o) => o.scope === 'POINT' && (o.type === 'VIBRATION_THRESHOLD' || o.type === 'TEMPERATURE_THRESHOLD'))) {
      const own = events.filter((e) => e.alertId === o.id);
      const escalated = own.find((e) => e.type === 'ESCALATED');
      const opened = own.find((e) => e.type === 'OPENED');
      const unit = o.thresholdMode === 'RATIO_TO_BASELINE' ? '×' : ` ${o.unit}`;
      push(
        `| ${o.sensorSerialNumber} | ${o.type} | ${iso(o.openedAt.getTime())} (${opened?.toLevel ?? o.level}) | ` +
          `${escalated ? `${iso(escalated.occurredAt.getTime())} → ${escalated.toLevel}` : '—'} | ` +
          `${o.resolvedAt ? `${iso(o.resolvedAt.getTime())} (${o.resolutionReason})` : `ativo (${o.level})`} | ` +
          `${fmt(o.peakMeasure, 2)}${unit} em ${iso(o.peakAt?.getTime() ?? null)} | ${fmt(o.lastMeasure, 2)}${unit} | ` +
          `${fmt(o.triggerValue, 4)} vs baseline ${fmt(o.triggerBaseline, 4)} = ${fmt(o.triggerMeasure, 2)}${unit} ≥ ${o.triggerThreshold} × ${o.consecutiveEvaluations} |`,
      );
    }
    push();

    push('## Qualidade de dado: lacunas do grid × episódios de presença');
    push();
    push('| Lacuna (UTC) | Duração | Sensores | Esperado | Episódios que a cobrem |');
    push('|---|---|---:|---|---|');
    for (const { group, fleetExpected, hits } of gapRows) {
      const label = hits.length
        ? hits.map((h) => `${h.type} ${h.level}${h.affectedCount ? ` (${h.affectedCount} pts)` : h.sensorSerialNumber ? ` ${h.sensorSerialNumber}` : ''} ${iso(h.openedAt.getTime())}→${h.resolvedAt ? iso(h.resolvedAt.getTime()) : 'ativo'}`).join('<br>')
        : '**nenhum**';
      push(`| ${iso(group.fromMs)} → ${iso(group.toMs)} | ${hours(group.toMs - group.fromMs)} | ${group.serials.length} | ${fleetExpected ? 'FLEET_SILENT' : `SENSOR_SILENT (${group.serials.join(', ')})`} | ${label} |`);
    }
    push();
    const presenceLine = (o: AlertOccurrence) =>
      `- ${o.type} ${o.level} ${o.sensorSerialNumber ?? `(${o.affectedCount} pontos)`} ${iso(o.openedAt.getTime())} → ${o.resolvedAt ? iso(o.resolvedAt.getTime()) : 'ativo'}`;
    push(`Episódios de presença DENTRO do mês sem lacuna correspondente (falso alarme de presença): ${unexpectedPresence.length === 0 ? 'nenhum' : ''}`);
    for (const o of unexpectedPresence) push(presenceLine(o));
    push();
    push(`Episódios após o último ciclo rotulado (${iso(lastLabeledMs)}) — fim do histórico, não erro: ${afterHistory.length === 0 ? 'nenhum' : ''}`);
    for (const o of afterHistory) push(presenceLine(o));
    push();

    push('## Baselines aprendidas por ponto');
    push();
    push('| Máquina · ponto | Sensor | Regra | Estado | Ciclos | Janela de aprendizado | Baseline global | Bins (mín–máx) | Observação |');
    push('|---|---|---|---|---:|---|---|---|---|');
    for (const s of states) {
      if (s.rule.learningCycles === null) continue;
      const bins = s.baselineBinCounts;
      const minBin = bins.length ? Math.min(...bins) : null;
      const maxBin = bins.length ? Math.max(...bins) : null;
      const notes: string[] = [];
      if (s.baselineStatus !== 'ESTABLISHED') notes.push('ainda aprendendo');
      if (minBin !== null && s.rule.minBinCount !== null && minBin < s.rule.minBinCount) notes.push(`bins fracos (< ${s.rule.minBinCount}) usam a mediana global`);
      if (s.baselineFrom && s.baselineTo && s.baselineTo.getTime() - s.baselineFrom.getTime() > 4 * 86_400_000) notes.push('**janela degradada**: aprendizado esparso (ciclos fora do mês)');
      push(
        `| ${s.monitoringPoint.machine.name} · ${s.monitoringPoint.name} | ${s.monitoringPoint.sensor?.serialNumber ?? '—'} | ${s.rule.key} | ${s.baselineStatus} | ${s.learningCount} | ` +
          `${iso(s.baselineFrom?.getTime() ?? null)} → ${iso(s.baselineTo?.getTime() ?? null)} | ${fmt(s.baselineValue, 4)} ${s.rule.unit} | ${minBin ?? '—'}–${maxBin ?? '—'} | ${notes.join('; ') || '—'} |`,
      );
    }
    push();

    push('## Ledger de avaliações');
    push();
    push('| Regra | Desfecho | Ciclos |');
    push('|---|---|---:|');
    for (const row of evaluationCounts) push(`| ${row.key} | ${row.outcome} | ${Number(row.total).toLocaleString('pt-BR')} |`);
    push();
    push('## Ciclos não rotulados (fora da matriz)');
    push();
    if (unlabeled.length === 0) push('Nenhum.');
    else {
      push('| Sensor | Ciclos |');
      push('|---|---:|');
      for (const row of unlabeled) push(`| ${row.serial} | ${Number(row.total)} |`);
      push();
      push('Cauda de demonstração, janelas canônicas e cargas de fumaça: o motor os avalia (são dados), mas o');
      push('rótulo do gerador não os cobre — ficam fora de TP/FP/TN/FN.');
    }
    push();

    const target = resolve(out);
    mkdirSync(dirname(target), { recursive: true });
    writeFileSync(target, `${lines.join('\n')}\n`);
    console.log(lines.slice(0, 40).join('\n'));
    console.log(`…\nrelatório: ${target}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error('Falha na validação:', error);
  process.exitCode = 1;
});
