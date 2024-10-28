-- CreateEnum
CREATE TYPE "MachineType" AS ENUM ('Pump', 'Fan');

-- CreateTable
CREATE TABLE "Machine" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "type" "MachineType" NOT NULL,

    CONSTRAINT "Machine_pkey" PRIMARY KEY ("id")
);
