/**
 * CLI do gêmeo digital.
 *
 *   generate --scenario normal|imbalance [--seed N] [--json]
 *     gera e valida um ciclo localmente (sem API), imprimindo o resumo auditável.
 *
 *   ingest --scenario normal|imbalance [--seed N]
 *     gera, autentica na API local e envia; depois PROVA a persistência lendo de volta
 *     as séries e amostras pelos endpoints reais.
 *
 *   plant history [--dry-run] [--days 30] [--every 15] [--sensors A,B] [--report path]
 *     popula o histórico sintético (grade absoluta, narrativa com verdade-terreno) pelo
 *     mesmo POST /telemetry-cycles — reexecutar é idempotente.
 */
import { mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

import { canonicalJson, computePayloadFingerprint } from '@dynamox/contracts';

import { buildCycle } from './payload';
import { runPlantHistory } from './history/run';
import { assessFleet, type FleetAssessment } from './assess';
import { ensurePlant, resolveResourceIds, type PlantBootstrapResult } from './bootstrap';
import { deliberate } from './deliberate';
import { buildConfirmatoryCycle, identityFor, runFleetPhase, type PlantPhase } from './fleet';
import { PLANT, plantSensors, validatePlantManifest } from './plant';
import {
  acquisitionRecords,
  parseProvenance,
  payloadFromRecords,
  serializeProvenance,
} from './provenance';
import { ROS_REQUIREMENTS, rosAvailable, runRosBridge } from './rosbridge';
import {
  fetchAllSamples,
  fetchSeries,
  ingestCycle,
  ingestPayload,
  loadTwinConfig,
  login,
} from './ingest';

interface CliArgs {
  command: string | undefined;
  scenario: string | undefined;
  seed: number | undefined;
  json: boolean;
}

function parseArgs(argv: string[]): CliArgs {
  const args: CliArgs = { command: argv[0], scenario: undefined, seed: undefined, json: false };
  for (let i = 1; i < argv.length; i += 1) {
    if (argv[i] === '--scenario') args.scenario = argv[++i];
    else if (argv[i] === '--seed') args.seed = Number(argv[++i]);
    else if (argv[i] === '--json') args.json = true;
    else throw new Error(`Argumento desconhecido: ${argv[i]}`);
  }
  return args;
}

function summarize(cycle: ReturnType<typeof buildCycle>): void {
  const { measurements } = cycle.payload.telemetryCycleData;
  const points = measurements.reduce((sum, m) => sum + m.dataPoints.length, 0);
  const meanOf = (index: number) => {
    const values = measurements[index].dataPoints.map((p) => p.value);
    return values.reduce((sum, v) => sum + v, 0) / values.length;
  };

  console.log(`cenário............: ${cycle.config.scenario}`);
  console.log(`sensor.............: ${cycle.identity.sensorSerial} (${cycle.identity.sensorModel}) em ${cycle.identity.machineName}/${cycle.identity.monitoringPointName}`);
  console.log(`janela.............: ${cycle.config.baseTimestamp} +${cycle.config.durationSeconds}s (seed ${cycle.config.seed})`);
  console.log(`measurements.......: ${measurements.length} (${points} dataPoints)`);
  console.log(`RMS médio (g)......: x=${meanOf(0).toFixed(6)} y=${meanOf(1).toFixed(6)} z=${meanOf(2).toFixed(6)}`);
  console.log(`Idempotency-Key....: ${cycle.idempotencyKey}`);
  console.log(`fingerprint........: ${cycle.fingerprint}`);
}

async function runPlantBootstrap(): Promise<void> {
  validatePlantManifest(PLANT);
  const config = loadTwinConfig();
  const token = await login(config);
  console.log(`planta.............: ${PLANT.plantName} (${PLANT.plantId})`);
  console.log(`login..............: OK (${config.email} em ${config.baseUrl})`);

  const result = await ensurePlant(config, token, PLANT);
  const show = (label: string, c: { created: number; existing: number }) =>
    console.log(`${label}: created=${c.created} existing=${c.existing}`);
  show('máquinas...........', result.machines);
  show('pontos.............', result.points);
  show('sensores...........', result.sensors);

  // F2.1 — prova de resourceId: ingerir um ciclo REAL de um ponto criado pelo bootstrap.
  const proofSensor = plantSensors(PLANT).find((s) => s.resourceIdStrategy === 'api-machine-id')!;
  const proofCycle = buildCycle(
    'normal',
    {
      seed: proofSensor.seed,
      rpm: proofSensor.rpm,
      loadPercent: proofSensor.loadPercent,
      baseTimestamp: PLANT.windows.baseline,
    },
    identityFor(proofSensor, result.resourceIds),
  );
  const proof = await ingestCycle(config, token, proofCycle);
  console.log(
    `prova resourceId...: ${proofSensor.sensorSerial} → HTTP ${proof.status} duplicate=${proof.body.duplicate} (RESOURCE_ID_MISMATCH falharia aqui)`,
  );
}

async function plantSession(): Promise<{ config: ReturnType<typeof loadTwinConfig>; token: string; bootstrap: PlantBootstrapResult }> {
  validatePlantManifest(PLANT);
  const config = loadTwinConfig();
  const token = await login(config);
  // ensure idempotente: descobre machineIds/resourceIds sem criar nada novo.
  const bootstrap = await ensurePlant(config, token, PLANT);
  return { config, token, bootstrap };
}

async function runPlantPhaseCommand(phase: PlantPhase): Promise<void> {
  const { config, token, bootstrap } = await plantSession();
  console.log(`fase...............: ${phase} @ ${PLANT.windows[phase]}`);
  const results = await runFleetPhase(config, token, PLANT, phase, bootstrap.resourceIds);
  const created = results.filter((r) => r.status === 201).length;
  const duplicates = results.filter((r) => r.body.duplicate).length;
  for (const r of results) {
    console.log(
      `  ${r.sensorSerial.padEnd(13)} HTTP ${r.status} duplicate=${r.body.duplicate} fp=${r.body.payloadFingerprint.slice(0, 12)}…`,
    );
  }
  console.log(`resumo.............: ${results.length} ciclos — ${created} novos, ${duplicates} duplicates`);
}

function printAssessment(assessment: FleetAssessment): void {
  console.log('Fleet assessment');
  console.log('─'.repeat(72));
  console.log(
    'Rank  ' + 'Asset'.padEnd(34) + 'Point  ' + 'Sensor'.padEnd(14) + 'Ratio    State',
  );
  assessment.ranked.forEach((sensor, index) => {
    console.log(
      String(index + 1).padEnd(6) +
        sensor.machineName.slice(0, 32).padEnd(34) +
        sensor.shortLabel.padEnd(7) +
        sensor.sensorSerial.padEnd(14) +
        `${sensor.deviationRatio.toFixed(2)}x`.padEnd(9) +
        sensor.state,
    );
  });
  console.log('─'.repeat(72));
  const stable = assessment.sensors.filter((s) => s.state === 'STABLE').length;
  const suspect = assessment.sensors.filter((s) => s.state === 'SUSPECT').length;
  console.log(`janelas............: baseline ${assessment.baselineWindow} · condition ${assessment.conditionWindow}`);
  console.log(`estados............: ${stable} STABLE · ${suspect} SUSPECT (limiar sintético ${assessment.thresholdRatio}x)`);
  if (assessment.selected) {
    console.log(`selecionado........: ${assessment.selected.machineName} / ${assessment.selected.shortLabel} / ${assessment.selected.sensorSerial}`);
    console.log(`ação...............: ${assessment.selectedAction}`);
  } else {
    console.log('selecionado........: nenhum (todos abaixo do limiar) — ação: NONE');
  }
}

async function runPlantAssess(): Promise<void> {
  // assess é ESTRITAMENTE observacional: login + leitura. Nenhum ensure/bootstrap —
  // criar entidades pertence só aos comandos que agem (achado da revisão incorporado).
  validatePlantManifest(PLANT);
  const config = loadTwinConfig();
  const token = await login(config);
  printAssessment(await assessFleet(config, token, PLANT));
}

async function runPlantDeliberate(): Promise<void> {
  const { config, token, bootstrap } = await plantSession();
  const result = await deliberate(config, token, PLANT, bootstrap.resourceIds);
  printAssessment(result.assessment);

  if (result.action === 'NONE' || !result.confirmation) {
    console.log('deliberação........: nenhuma aquisição confirmatória necessária');
    return;
  }
  const c = result.confirmation;
  console.log('deliberação........: ACT — aquisição confirmatória do selecionado');
  console.log(`confirmação........: HTTP ${c.ingestStatus} duplicate=${c.ingestDuplicate} fp=${c.fingerprint.slice(0, 12)}…`);
  console.log(`confirmRatio.......: ${c.confirmRatio.toFixed(2)}x (re-observado pelo banco)`);
  console.log(`transição..........: SUSPECT → ${result.finalState}`);
  if (result.recommendation) console.log(`recomendação.......: ${result.recommendation}`);
}

/**
 * F8 — proveniência ROS da aquisição confirmatória: a origem é o resultado REAL do
 * ciclo deliberativo (o sensor selecionado pelo assessment observacional), nunca um
 * alvo hardcoded. Fluxo: observar → reconstruir o artefato confirmatório canônico →
 * JSONL → rosbag → JSONL reconstruído → payload → fingerprint idêntico → replay na API
 * (duplicate:true) → prova de que nenhuma amostra nova nasceu.
 */
async function runPlantRosbag(): Promise<void> {
  if (!rosAvailable()) {
    throw new Error(`Runtime ROS indisponível. ${ROS_REQUIREMENTS}`);
  }
  validatePlantManifest(PLANT);
  const config = loadTwinConfig();
  const token = await login(config);

  // OBSERVE: quem define o alvo é o supervisor, pelos dados persistidos.
  const assessment = await assessFleet(config, token, PLANT);
  if (!assessment.selected) {
    console.log('nenhum sensor acima do limiar — não há aquisição confirmatória para preservar.');
    return;
  }
  const serial = assessment.selected.sensorSerial;
  const sensor = plantSensors(PLANT).find((s) => s.sensorSerial === serial)!;
  console.log(`alvo (supervisor)..: ${assessment.selected.machineName} / ${assessment.selected.shortLabel} / ${serial} (${assessment.selected.deviationRatio.toFixed(2)}x)`);

  // Reconstrução determinística do MESMO artefato confirmatório ingerido no deliberate.
  const resourceIds = await resolveResourceIds(config, token, PLANT);
  const cycle = buildConfirmatoryCycle(PLANT, resourceIds, serial);
  console.log(`artefato...........: ${cycle.idempotencyKey}`);
  console.log(`fingerprint........: ${cycle.fingerprint}`);

  const dir = join(__dirname, '..', 'artifacts');
  mkdirSync(dir, { recursive: true });
  const slug = serial.toLowerCase();
  const jsonlPath = join(dir, `${slug}-confirm.jsonl`);
  const bagPath = join(dir, `${slug}-confirm.bag`);
  const reconstructedPath = join(dir, `${slug}-confirm.reconstructed.jsonl`);

  const records = acquisitionRecords(cycle, sensor.machineType);
  writeFileSync(jsonlPath, serializeProvenance(records), 'utf8');
  console.log(`JSONL canônico.....: ${jsonlPath} (${records.length} registros)`);

  const toBag = runRosBridge('to-bag', jsonlPath, bagPath);
  console.log(`rosbag.............: ${bagPath} (${statSync(bagPath).size} bytes, ${toBag.messages} mensagens)`);
  console.log(`tópicos............: ${toBag.topics.join(' · ')}`);

  const fromBag = runRosBridge('from-bag', bagPath, reconstructedPath);
  const reconstructedRecords = parseProvenance(readFileSync(reconstructedPath, 'utf8'));
  const { payload, acquisition } = payloadFromRecords(reconstructedRecords);
  const reconstructedFingerprint = computePayloadFingerprint(payload);

  const identical = reconstructedFingerprint === cycle.fingerprint;
  console.log(`reconstrução.......: ${fromBag.messages} mensagens lidas → ${reconstructedRecords.length} registros`);
  console.log(`fingerprint (bag)..: ${reconstructedFingerprint}`);
  console.log(`identidade.........: ${identical ? 'IDÊNTICA (mesmo payloadFingerprint)' : 'DIVERGENTE'}`);
  if (!identical) {
    throw new Error('fingerprint reconstruído difere do original — round-trip ROS quebrou a identidade.');
  }

  // Evidência secundária: registros canônicos byte-idênticos após re-serialização.
  const canonicalOriginal = records.map((r) => canonicalJson(r));
  const canonicalReconstructed = reconstructedRecords.map((r) => canonicalJson(r));
  const byteIdentical =
    canonicalOriginal.length === canonicalReconstructed.length &&
    canonicalOriginal.every((line, i) => line === canonicalReconstructed[i]);
  console.log(`JSONL canônico.....: ${byteIdentical ? 'byte-idêntico após round-trip (evidência secundária)' : 'semanticamente equivalente (formatação difere)'}`);

  // Replay pela API com a identidade da aquisição confirmatória: duplicate esperado.
  const fleetSerials = new Set(plantSensors(PLANT).map((s) => s.sensorSerial));
  const seriesBefore = (await fetchSeries(config, token)).filter((s) => fleetSerials.has(s.sensorSerialNumber));

  const key = acquisition.telemetry.metadata.cycleId as string;
  if (key !== cycle.idempotencyKey) {
    throw new Error('cycleId reconstruído difere da Idempotency-Key original — artefato corrompido.');
  }
  const replay = await ingestPayload(config, token, payload, key);
  console.log(`replay API.........: HTTP ${replay.status} duplicate=${replay.body.duplicate} fp=${replay.body.payloadFingerprint.slice(0, 12)}…`);
  if (!replay.body.duplicate || replay.body.payloadFingerprint !== cycle.fingerprint) {
    throw new Error('replay do bag deveria ser duplicate:true com o MESMO fingerprint — investigar.');
  }

  const seriesAfter = (await fetchSeries(config, token)).filter((s) => fleetSerials.has(s.sensorSerialNumber));
  const grewNot =
    seriesAfter.length === seriesBefore.length &&
    seriesAfter.every((s) => seriesBefore.find((b) => b.id === s.id)?.sampleCount === s.sampleCount);
  console.log(`amostras novas.....: ${grewNot ? 'ZERO (todas as séries com contagem idêntica)' : 'CRESCERAM — replay violou a idempotência!'}`);
  if (!grewNot) throw new Error('replay criou amostras novas — idempotência violada.');
  console.log('proveniência ROS...: OK — mesma aquisição semântica, mesmo fingerprint, replay duplicate.');
}

async function main(): Promise<void> {
  if (process.argv[2] === 'plant') {
    const sub = process.argv[3];
    if (sub === 'bootstrap') {
      await runPlantBootstrap();
      return;
    }
    if (sub === 'baseline' || sub === 'condition') {
      await runPlantPhaseCommand(sub);
      return;
    }
    if (sub === 'assess') {
      await runPlantAssess();
      return;
    }
    if (sub === 'deliberate') {
      await runPlantDeliberate();
      return;
    }
    if (sub === 'rosbag') {
      await runPlantRosbag();
      return;
    }
    if (sub === 'history') {
      await runPlantHistory(process.argv.slice(4));
      return;
    }
    console.error('Uso: plant bootstrap|baseline|condition|assess|deliberate|rosbag|history [--dry-run --days N --every MIN --sensors A,B --workers N --concurrency N --report path]');
    process.exit(2);
  }

  const args = parseArgs(process.argv.slice(2));
  const overrides = args.seed !== undefined ? { seed: args.seed } : {};

  if (args.command === 'generate') {
    const cycle = buildCycle(args.scenario, overrides);
    summarize(cycle);
    console.log('validação..........: OK (Ajv real de @dynamox/contracts)');
    if (args.json) console.log(JSON.stringify(cycle.payload, null, 2));
    return;
  }

  if (args.command === 'ingest') {
    const cycle = buildCycle(args.scenario, overrides);
    summarize(cycle);

    const config = loadTwinConfig();
    const token = await login(config);
    console.log(`login..............: OK (${config.email} em ${config.baseUrl})`);

    const { status, body } = await ingestCycle(config, token, cycle);
    console.log(`ingestão...........: HTTP ${status} duplicate=${body.duplicate} cycleId=${body.cycleId}`);
    console.log(`fingerprint (API)..: ${body.payloadFingerprint}`);
    if (body.payloadFingerprint !== cycle.fingerprint) {
      throw new Error('fingerprint local difere do da API — investigar antes de confiar no ciclo.');
    }

    // Prova de persistência: ler de volta pelos endpoints reais.
    const series = (await fetchSeries(config, token)).filter(
      (s) => s.sensorSerialNumber === cycle.identity.sensorSerial,
    );
    console.log(`séries do sensor...: ${series.length}`);
    const accelerationY = series.find((s) => s.physicalQuantity === 'acceleration' && s.axis === 'y');
    if (!accelerationY) throw new Error('série acceleration/y não encontrada após a ingestão.');
    const windowStart = cycle.payload.telemetryCycleData.measurements[1].dataPoints[0].timestamp;
    const samples = await fetchAllSamples(config, token, accelerationY.id);
    const inWindow = samples.filter((s) => s.timestamp >= windowStart);
    console.log(
      `persistência.......: acceleration/y total=${samples.length}; ≥${windowStart}: ${inWindow.length} amostras`,
    );
    return;
  }

  console.error('Uso: generate|ingest --scenario normal|imbalance [--seed N] [--json]');
  process.exit(2);
}

main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
