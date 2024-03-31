-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "fullName" VARCHAR(255) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Machine" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "Machine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Machine_Type" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "machineId" INTEGER NOT NULL,

    CONSTRAINT "Machine_Type_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Monitoring_Point" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR(255) NOT NULL,
    "machineId" INTEGER NOT NULL,

    CONSTRAINT "Monitoring_Point_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Sensor" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "monitoringPointId" INTEGER NOT NULL,

    CONSTRAINT "Sensor_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Machine_Type_machineId_key" ON "Machine_Type"("machineId");

-- CreateIndex
CREATE UNIQUE INDEX "Monitoring_Point_machineId_key" ON "Monitoring_Point"("machineId");

-- CreateIndex
CREATE UNIQUE INDEX "Sensor_monitoringPointId_key" ON "Sensor"("monitoringPointId");

-- AddForeignKey
ALTER TABLE "Machine_Type" ADD CONSTRAINT "Machine_Type_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Monitoring_Point" ADD CONSTRAINT "Monitoring_Point_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sensor" ADD CONSTRAINT "Sensor_monitoringPointId_fkey" FOREIGN KEY ("monitoringPointId") REFERENCES "Monitoring_Point"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
