// Generates the next migration from the change to schema.prisma since the last commit.
//
// `prisma migrate dev` is not used: it diffs schema.prisma against the database and
// would write a migration dropping what Prisma cannot model, the CHECK constraints and
// the partial unique index written by hand in earlier migrations (ADR 0006). Diffing the
// committed schema against the edited one yields only the change being made.
//
// Usage, from the workspace root: npm run db:migration -- --name=add_something
import { execFileSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const name = process.argv.find((arg) => arg.startsWith('--name='))?.slice('--name='.length);
if (!name || !/^[a-z][a-z0-9_]{2,60}$/.test(name)) {
  console.error('Give the migration a snake_case name: --name=add_something');
  process.exit(2);
}

// UTC, as Prisma names its migrations, so the folders sort in the order they apply.
const stamp = new Date().toISOString().replace(/\D/g, '').slice(0, 14);
const folder = join('prisma', 'migrations', `${stamp}_${name}`);

const scratch = mkdtempSync(join(tmpdir(), 'migration-'));
try {
  const committed = join(scratch, 'schema.prisma');
  writeFileSync(
    committed,
    execFileSync('git', ['show', 'HEAD:./prisma/schema.prisma'], { encoding: 'utf8' }),
  );
  mkdirSync(folder);
  execFileSync(
    'npx',
    [
      '--no-install',
      'prisma',
      'migrate',
      'diff',
      '--from-schema',
      committed,
      '--to-schema',
      join('prisma', 'schema.prisma'),
      '--script',
      '--output',
      join(folder, 'migration.sql'),
    ],
    { stdio: 'inherit' },
  );
} finally {
  rmSync(scratch, { recursive: true, force: true });
}

const sql = readFileSync(join(folder, 'migration.sql'), 'utf8');
if (!/^\s*(CREATE|ALTER|DROP)/im.test(sql)) {
  console.warn('schema.prisma has no change since the last commit: the migration is empty.');
}
console.log(`Created ${folder}/migration.sql`);
console.log('Add the SQL Prisma cannot model (CHECK, partial index), then: npm run db:deploy');
