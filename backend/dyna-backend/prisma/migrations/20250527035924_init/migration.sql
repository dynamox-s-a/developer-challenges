-- CreateEnum
CREATE TYPE "Type" AS ENUM ('PUMP', 'FAN');

-- CreateEnum
CREATE TYPE "SensorType" AS ENUM ('HFp', 'TcAs', 'TcAg');

-- CreateEnum
CREATE TYPE "StatusMachine" AS ENUM ('ON', 'OFF');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Machine" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "typeOfMachine" "Type" NOT NULL,
    "statusMachine" "StatusMachine" NOT NULL,
    "pointmonitoring1_id" INTEGER,
    "pointmonitoring2_id" INTEGER,

    CONSTRAINT "Machine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SensorMonitoring" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "sensorType" "SensorType" NOT NULL,

    CONSTRAINT "SensorMonitoring_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- AddForeignKey
ALTER TABLE "Machine" ADD CONSTRAINT "Machine_pointmonitoring1_id_fkey" FOREIGN KEY ("pointmonitoring1_id") REFERENCES "SensorMonitoring"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Machine" ADD CONSTRAINT "Machine_pointmonitoring2_id_fkey" FOREIGN KEY ("pointmonitoring2_id") REFERENCES "SensorMonitoring"("id") ON DELETE CASCADE ON UPDATE CASCADE;
