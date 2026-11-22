-- O Postgres ordena um enum pela ordem em que os valores foram criados (Pump
-- antes de Fan), e não pela ordem alfabética. Recria o tipo com Fan antes de
-- Pump para que ordenar pelo tipo da máquina siga a ordem alfabética.
-- O Prisma não percebe mudança de ordem num enum, por isso o SQL é escrito à mão
BEGIN;
CREATE TYPE "MachineType_new" AS ENUM ('Fan', 'Pump');
ALTER TABLE "Machine" ALTER COLUMN "type" TYPE "MachineType_new" USING ("type"::text::"MachineType_new");
ALTER TYPE "MachineType" RENAME TO "MachineType_old";
ALTER TYPE "MachineType_new" RENAME TO "MachineType";
DROP TYPE "MachineType_old";
COMMIT;

