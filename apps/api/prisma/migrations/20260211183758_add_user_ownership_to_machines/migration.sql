/*
  Warnings:

  - A unique constraint covering the columns `[userId,name,type]` on the table `machines` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `userId` to the `machines` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "machines_name_type_key";

-- AlterTable
ALTER TABLE "machines" ADD COLUMN     "userId" INTEGER NOT NULL;

-- CreateIndex
CREATE INDEX "machines_userId_idx" ON "machines"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "machines_userId_name_type_key" ON "machines"("userId", "name", "type");

-- AddForeignKey
ALTER TABLE "machines" ADD CONSTRAINT "machines_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
