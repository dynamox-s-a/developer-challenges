-- CreateTable
CREATE TABLE "TimeSeries" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "unit" VARCHAR(20),
    "sensorSerialNumber" TEXT NOT NULL,
    "monitoringPointId" TEXT NOT NULL,
    "sampleCount" INTEGER NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL,
    "endedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TimeSeries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TimeSeriesSample" (
    "timeSeriesId" TEXT NOT NULL,
    "timestamp" TIMESTAMP(3) NOT NULL,
    "value" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "TimeSeriesSample_pkey" PRIMARY KEY ("timeSeriesId","timestamp")
);

-- CreateIndex
CREATE INDEX "TimeSeries_monitoringPointId_idx" ON "TimeSeries"("monitoringPointId");

-- AddForeignKey
ALTER TABLE "TimeSeries" ADD CONSTRAINT "TimeSeries_monitoringPointId_fkey" FOREIGN KEY ("monitoringPointId") REFERENCES "MonitoringPoint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TimeSeriesSample" ADD CONSTRAINT "TimeSeriesSample_timeSeriesId_fkey" FOREIGN KEY ("timeSeriesId") REFERENCES "TimeSeries"("id") ON DELETE CASCADE ON UPDATE CASCADE;
