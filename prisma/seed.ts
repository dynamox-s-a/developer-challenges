/**
 * Seed determinístico e mínimo: exatamente o suficiente para demonstrar a cadeia
 * máquina -> ponto de monitoramento -> sensor -> série temporal, com dados sintéticos.
 * Rodar duas vezes não duplica nada (tudo é upsert por chave natural).
 */
import { randomBytes, scryptSync } from 'node:crypto';

import { PrismaClient } from '@prisma/client';

import { seedOperationalHistory } from './operational-history';
import { demoAnchorMs, deterministicResourceId } from '@dynamox/contracts';

const prisma = new PrismaClient();

const SEED_USER_EMAIL = process.env.SEED_USER_EMAIL ?? 'analista@dynamox.local';
const SEED_USER_PASSWORD = process.env.SEED_USER_PASSWORD ?? 'Dynamox@2026';

/**
 * Segunda credencial fixa, somente leitura. Existe para demonstrar a autorização por
 * perfil sem administração de usuários: o desafio continua usando credenciais fixas.
 */
const SEED_VIEWER_EMAIL = process.env.SEED_VIEWER_EMAIL ?? 'consulta@dynamox.local';
const SEED_VIEWER_PASSWORD = process.env.SEED_VIEWER_PASSWORD ?? 'Consulta@2026';

const MACHINE_NAME = 'P-101';

/**
 * O enunciado pede pelo menos dois pontos de monitoramento. Ambos ficam na P-101
 * (mancais dos dois lados do eixo), cada um com seu sensor HF+ — único modelo
 * permitido em uma Pump.
 */
const MONITORING_POINTS = [
  { name: 'Mancal lado acoplamento', sensorSerial: 'SIM-HF-001' },
  { name: 'Mancal lado oposto ao acoplamento', sensorSerial: 'SIM-HF-002' },
] as const;

/**
 * Amostras da demonstração: 30 pontos a cada 10 s, terminando na âncora do bloco de 6 h
 * da execução (ver `demoAnchorMs`). Instantes relativos, e não uma data fixa: o painel
 * classifica recência contra o relógio, então uma data absoluta envelhece e o dashboard
 * abre vazio dias depois. Reexecutar o seed dentro do mesmo bloco recalcula exatamente os
 * mesmos instantes — `skipDuplicates` os reconhece e nada é duplicado.
 *
 * A janela é curta (≈5 min) e termina na âncora, sem sobreposição com as janelas da planta
 * do BON-06 (âncora −3 h, −2 h e −1 h) nem com o exemplo versionado em
 * contracts/dynamox/examples, cujos instantes são fixos em 2026-08-26.
 */
const SAMPLE_COUNT = 30;
const SAMPLE_INTERVAL_MS = 10_000;
const SERIES_END = demoAnchorMs();

function hashPassword(password: string): string {
  const salt = randomBytes(16).toString('hex');
  const derived = scryptSync(password, salt, 64).toString('hex');
  return `scrypt$${salt}$${derived}`;
}

/**
 * Gerador pseudoaleatório próprio (LCG) em vez de Math.random: a mesma seed precisa
 * produzir exatamente a mesma série em qualquer máquina, para que a evidência do
 * desafio seja reproduzível.
 */
function createDeterministicNoise(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state * 1_664_525 + 1_013_904_223) >>> 0;
    return state / 0xffffffff - 0.5;
  };
}

async function main(): Promise<void> {
  // O update também redefine o passwordHash: a credencial fixa anunciada precisa valer
  // mesmo que o registro já exista com outra senha.
  const user = await prisma.user.upsert({
    where: { email: SEED_USER_EMAIL },
    update: {
      name: 'Analista de Manutenção',
      passwordHash: hashPassword(SEED_USER_PASSWORD),
      role: 'ADMIN',
    },
    create: {
      email: SEED_USER_EMAIL,
      name: 'Analista de Manutenção',
      passwordHash: hashPassword(SEED_USER_PASSWORD),
      role: 'ADMIN',
    },
  });

  // O perfil é reafirmado no update para que reexecutar o seed não deixe as credenciais
  // anunciadas com privilégio diferente do documentado.
  const viewer = await prisma.user.upsert({
    where: { email: SEED_VIEWER_EMAIL },
    update: {
      name: 'Consulta (somente leitura)',
      passwordHash: hashPassword(SEED_VIEWER_PASSWORD),
      role: 'VIEWER',
    },
    create: {
      email: SEED_VIEWER_EMAIL,
      name: 'Consulta (somente leitura)',
      passwordHash: hashPassword(SEED_VIEWER_PASSWORD),
      role: 'VIEWER',
    },
  });

  const machine = await prisma.machine.upsert({
    where: { name: MACHINE_NAME },
    update: { type: 'PUMP' },
    create: { name: MACHINE_NAME, type: 'PUMP' },
  });

  const points = [];
  for (const { name, sensorSerial } of MONITORING_POINTS) {
    // Derivação INTENCIONALMENTE pelo NOME da máquina (e não pelo id, como faz a API):
    // o id é um UUID gerado pelo banco e mudaria a cada ambiente, destruindo o
    // determinismo do seed e quebrando o resourceId 42d726ba... referenciado pelo
    // exemplo de ingestão em contracts/dynamox/examples.
    const externalResourceId = deterministicResourceId(
      'dynamox-challenge',
      'monitoring-point',
      MACHINE_NAME,
      name,
    );

    const monitoringPoint = await prisma.monitoringPoint.upsert({
      where: { machineId_name: { machineId: machine.id, name } },
      update: { externalResourceId },
      create: { name, machineId: machine.id, externalResourceId },
    });

    // HF+ é o único modelo compatível com uma máquina Pump (TcAg e TcAs são proibidos
    // pelo enunciado). A regra é aplicada em @dynamox/domain e validada nos testes.
    const sensor = await prisma.sensor.upsert({
      where: { serialNumber: sensorSerial },
      update: { model: 'HF_PLUS', monitoringPointId: monitoringPoint.id },
      create: {
        serialNumber: sensorSerial,
        model: 'HF_PLUS',
        monitoringPointId: monitoringPoint.id,
      },
    });

    points.push({ monitoringPoint, sensor });
  }

  // A série temporal de demonstração fica no sensor do primeiro ponto (lado acoplamento).
  const [{ sensor }] = points;

  const timeSeries = await prisma.timeSeries.upsert({
    where: {
      sensorId_physicalQuantity_axis: {
        sensorId: sensor.id,
        physicalQuantity: 'ACCELERATION',
        axis: 'Y',
      },
    },
    update: { unit: 'g' },
    create: {
      sensorId: sensor.id,
      physicalQuantity: 'ACCELERATION',
      axis: 'Y',
      unit: 'g',
      displayName: {
        pt: 'Aceleração RMS — eixo Y',
        en: 'Acceleration RMS — Y axis',
      },
    },
  });

  const noise = createDeterministicNoise(20_260_826);
  const samples = Array.from({ length: SAMPLE_COUNT }, (_, index) => {
    const timestamp = new Date(SERIES_END - (SAMPLE_COUNT - 1 - index) * SAMPLE_INTERVAL_MS);
    const trend = 0.02 + 0.0004 * index;
    const value = Number((trend + 0.004 * noise()).toFixed(6));
    return { timeSeriesId: timeSeries.id, timestamp, value };
  });

  // As amostras de demonstração existem para um banco VAZIO mostrar alguma coisa. Se a série
  // já recebeu aquisições reais pela API (planta de demonstração, histórico sintético),
  // gravar 30 amostras avulsas ancoradas no relógio de agora só criaria uma "última leitura"
  // falsa, à frente de todo o dado real. Reexecutar o seed precisa continuar seguro.
  const realAcquisitions = await prisma.timeSeriesSample.count({
    where: { timeSeriesId: timeSeries.id, ingestionCycleId: { not: null } },
  });
  if (realAcquisitions === 0) {
    await prisma.timeSeriesSample.createMany({ data: samples, skipDuplicates: true });
  } else {
    console.log('  amostras demo......: não inseridas — a série já tem aquisições reais');
  }

  const sampleCount = await prisma.timeSeriesSample.count({
    where: { timeSeriesId: timeSeries.id },
  });

  console.log('Seed concluído (dados sintéticos de demonstração):');
  console.log(`  usuário............: ${user.email} (${user.role})`);
  console.log(`  usuário............: ${viewer.email} (${viewer.role})`);
  console.log(`  máquina............: ${machine.name} (${machine.type})`);
  for (const point of points) {
    console.log(
      `  ponto de monitor...: ${point.monitoringPoint.name} — sensor ` +
        `${point.sensor.serialNumber} (${point.sensor.model}) — ` +
        `resourceId ${point.monitoringPoint.externalResourceId}`,
    );
  }
  console.log(`  série temporal.....: ${timeSeries.id} — ${sampleCount} amostras`);

  // Histórico operacional de alertas (mar–mai): só quando a planta completa já existe.
  // No seed mínimo (este arquivo recém-executado num banco vazio) ele apenas se anuncia;
  // o demo:prepare o executa de novo após o cadastro completo e o backfill do motor.
  const history = await seedOperationalHistory(prisma);
  if (history.skipped) {
    console.log(`  alertas anteriores.: pulado — ${history.skipped}`);
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error('Falha no seed:', error);
    await prisma.$disconnect();
    process.exit(1);
  });
