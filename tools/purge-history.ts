/**
 * Remove o histórico sintético (ciclos marcados com a tag do dataset) sem tocar na seed,
 * nas fases da planta nem nas séries. Amostras saem ANTES dos ciclos: a FK é SetNull e
 * apagar o ciclo primeiro deixaria as amostras órfãs e irrastreáveis.
 *
 *   npm run history:purge -- --dry-run          # só conta
 *   npm run history:purge -- --yes              # apaga
 *   npm run history:purge -- --tag dataset:history --batch 200 --yes
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

interface Options {
  tag: string;
  dryRun: boolean;
  yes: boolean;
  batch: number;
}

function parseArgs(argv: string[]): Options {
  const options: Options = { tag: 'dataset:history', dryRun: false, yes: false, batch: 200 };
  for (let i = 0; i < argv.length; i += 1) {
    const flag = argv[i];
    if (flag === '--tag') options.tag = argv[++i] ?? options.tag;
    else if (flag === '--batch') options.batch = Math.max(1, Number(argv[++i]) || 200);
    else if (flag === '--dry-run') options.dryRun = true;
    else if (flag === '--yes') options.yes = true;
    else throw new Error(`Argumento desconhecido: ${flag}`);
  }
  return options;
}

function assertLocalDatabase(): void {
  const url = process.env.DATABASE_URL ?? '';
  const host = (() => {
    try {
      return new URL(url).hostname;
    } catch {
      return '';
    }
  })();
  if (!['localhost', '127.0.0.1', 'db'].includes(host)) {
    throw new Error(`Purge só roda contra banco local (DATABASE_URL aponta para "${host || 'inválido'}").`);
  }
}

async function main(): Promise<void> {
  const options = parseArgs(process.argv.slice(2));
  assertLocalDatabase();

  const cycles = await prisma.ingestionCycle.findMany({
    where: { tags: { has: options.tag } },
    select: { id: true, sampleCount: true },
    orderBy: { createdAt: 'asc' },
  });
  const samplesBefore = await prisma.timeSeriesSample.count({ where: { ingestionCycleId: { in: cycles.map((c) => c.id) } } });
  const totalBefore = await prisma.timeSeriesSample.count();

  console.log(`tag................: ${options.tag}`);
  console.log(`ciclos marcados....: ${cycles.length}`);
  console.log(`amostras marcadas..: ${samplesBefore} (de ${totalBefore} no banco)`);
  if (options.dryRun) {
    console.log('dry-run: nada apagado.');
    return;
  }
  if (!options.yes) {
    console.log('Nada apagado. Repita com --yes para confirmar (ou --dry-run para só contar).');
    process.exitCode = 2;
    return;
  }

  const startedAt = Date.now();
  let removedSamples = 0;
  let removedCycles = 0;
  for (let offset = 0; offset < cycles.length; offset += options.batch) {
    const ids = cycles.slice(offset, offset + options.batch).map((c) => c.id);
    const samples = await prisma.timeSeriesSample.deleteMany({ where: { ingestionCycleId: { in: ids } } });
    const removed = await prisma.ingestionCycle.deleteMany({ where: { id: { in: ids } } });
    removedSamples += samples.count;
    removedCycles += removed.count;
    if ((offset / options.batch) % 20 === 0) {
      console.log(`  ${removedCycles}/${cycles.length} ciclos · ${removedSamples} amostras removidas`);
    }
  }
  const totalAfter = await prisma.timeSeriesSample.count();
  console.log(`removidos..........: ${removedCycles} ciclos · ${removedSamples} amostras em ${((Date.now() - startedAt) / 1000).toFixed(1)} s`);
  console.log(`amostras no banco..: ${totalAfter}`);
  console.log('Séries preservadas; o espaço em disco volta com o autovacuum (ou npm run db:reset para recriar do zero).');
}

main()
  .catch((error) => {
    console.error('Falha no purge:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
