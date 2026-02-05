/*
  Warnings:

  - You are about to drop the column `userId` on the `Machine` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Machine" DROP CONSTRAINT "Machine_userId_fkey";

-- AlterTable
ALTER TABLE "Machine" DROP COLUMN "userId";

-- DropTable
DROP TABLE "User";
