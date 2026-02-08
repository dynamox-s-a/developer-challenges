-- CreateTable
CREATE TABLE "TimeSeries" (
    "id" TEXT NOT NULL,
    "monitoringPointId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TimeSeries_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "TimeSeries_monitoringPointId_timestamp_idx" ON "TimeSeries"("monitoringPointId", "timestamp");

-- CreateIndex
CREATE UNIQUE INDEX "TimeSeries_monitoringPointId_timestamp_key" ON "TimeSeries"("monitoringPointId", "timestamp");

-- AddForeignKey
ALTER TABLE "TimeSeries" ADD CONSTRAINT "TimeSeries_monitoringPointId_fkey" FOREIGN KEY ("monitoringPointId") REFERENCES "MonitoringPoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;
