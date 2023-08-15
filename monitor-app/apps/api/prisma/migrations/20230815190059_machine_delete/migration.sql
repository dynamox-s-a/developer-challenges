-- DropForeignKey
ALTER TABLE "spots" DROP CONSTRAINT "spots_machineId_fkey";

-- AddForeignKey
ALTER TABLE "spots" ADD CONSTRAINT "spots_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "machines"("id") ON DELETE CASCADE ON UPDATE CASCADE;
