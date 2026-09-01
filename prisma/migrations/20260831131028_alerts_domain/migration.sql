-- CreateEnum
CREATE TYPE "AlertType" AS ENUM ('VIBRATION_THRESHOLD', 'TEMPERATURE_THRESHOLD', 'SENSOR_SILENT', 'FLEET_SILENT');

-- CreateEnum
CREATE TYPE "AlertScope" AS ENUM ('POINT', 'FLEET');

-- CreateEnum
CREATE TYPE "AlertLevel" AS ENUM ('A1', 'A2');

-- CreateEnum
CREATE TYPE "AlertState" AS ENUM ('ACTIVE', 'RESOLVED');

-- CreateEnum
CREATE TYPE "AlertEventType" AS ENUM ('OPENED', 'ESCALATED', 'ACKNOWLEDGED', 'RESOLVED');

-- CreateEnum
CREATE TYPE "AlertThresholdMode" AS ENUM ('RATIO_TO_BASELINE', 'DELTA_FROM_BASELINE', 'ELAPSED_INTERVALS');

-- CreateEnum
CREATE TYPE "AlertResolutionReason" AS ENUM ('CONDITION_CLEARED', 'TELEMETRY_RESUMED');

-- CreateEnum
CREATE TYPE "AlertBaselineStatus" AS ENUM ('LEARNING', 'ESTABLISHED');

-- CreateEnum
CREATE TYPE "AlertEvaluationOutcome" AS ENUM ('EVALUATED', 'LEARNING', 'SUPPRESSED', 'NO_EVIDENCE', 'UNASSIGNED', 'OUT_OF_ORDER');

-- CreateTable
CREATE TABLE "alert_rules" (
    "id" TEXT NOT NULL,
    "key" VARCHAR(64) NOT NULL,
    "type" "AlertType" NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "metric" VARCHAR(64) NOT NULL,
    "unit" VARCHAR(16) NOT NULL,
    "thresholdMode" "AlertThresholdMode" NOT NULL,
    "a1Threshold" DOUBLE PRECISION NOT NULL,
    "a2Threshold" DOUBLE PRECISION,
    "clearThreshold" DOUBLE PRECISION NOT NULL,
    "consecutiveTrigger" INTEGER NOT NULL DEFAULT 2,
    "consecutiveClear" INTEGER NOT NULL DEFAULT 4,
    "learningCycles" INTEGER,
    "minBinCount" INTEGER,
    "expectedIntervalSeconds" INTEGER,
    "postGapSuppressionMinutes" INTEGER,
    "fleetCollapseFraction" DOUBLE PRECISION,
    "policyVersion" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "alert_rules_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alert_cycle_evidence" (
    "cycleId" TEXT NOT NULL,
    "monitoringPointId" TEXT,
    "sensorId" TEXT,
    "sensorSerialNumber" VARCHAR(64) NOT NULL,
    "startedAt" TIMESTAMPTZ(3) NOT NULL,
    "endedAt" TIMESTAMPTZ(3) NOT NULL,
    "radialRms" DOUBLE PRECISION,
    "radialSampleCount" INTEGER NOT NULL DEFAULT 0,
    "temperatureAvg" DOUBLE PRECISION,
    "temperatureCount" INTEGER NOT NULL DEFAULT 0,
    "rpmAvg" DOUBLE PRECISION,
    "computedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alert_cycle_evidence_pkey" PRIMARY KEY ("cycleId")
);

-- CreateTable
CREATE TABLE "alert_rule_evaluations" (
    "id" TEXT NOT NULL,
    "cycleId" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "policyVersion" INTEGER NOT NULL,
    "outcome" "AlertEvaluationOutcome" NOT NULL,
    "measure" DOUBLE PRECISION,
    "evaluatedAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alert_rule_evaluations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alert_rule_states" (
    "id" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "monitoringPointId" TEXT NOT NULL,
    "baselineStatus" "AlertBaselineStatus" NOT NULL DEFAULT 'LEARNING',
    "baselineSensorId" TEXT,
    "learningCount" INTEGER NOT NULL DEFAULT 0,
    "baselineValue" DOUBLE PRECISION,
    "baselineProfile" DOUBLE PRECISION[],
    "baselineBinCounts" INTEGER[],
    "baselineFrom" TIMESTAMPTZ(3),
    "baselineTo" TIMESTAMPTZ(3),
    "baselineEstablishedAt" TIMESTAMPTZ(3),
    "aboveA1Streak" INTEGER NOT NULL DEFAULT 0,
    "aboveA2Streak" INTEGER NOT NULL DEFAULT 0,
    "belowClearStreak" INTEGER NOT NULL DEFAULT 0,
    "suppressedUntil" TIMESTAMPTZ(3),
    "lastSeenAt" TIMESTAMPTZ(3),
    "lastEvaluatedAt" TIMESTAMPTZ(3),
    "lastEvaluatedCycleId" TEXT,
    "lastValue" DOUBLE PRECISION,
    "lastMeasure" DOUBLE PRECISION,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "alert_rule_states_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alert_occurrences" (
    "id" TEXT NOT NULL,
    "ruleId" TEXT NOT NULL,
    "type" "AlertType" NOT NULL,
    "scope" "AlertScope" NOT NULL DEFAULT 'POINT',
    "level" "AlertLevel" NOT NULL,
    "state" "AlertState" NOT NULL DEFAULT 'ACTIVE',
    "activeKey" VARCHAR(128),
    "machineId" TEXT,
    "machineName" TEXT,
    "monitoringPointId" TEXT,
    "monitoringPointName" TEXT,
    "sensorId" TEXT,
    "sensorSerialNumber" TEXT,
    "openedAt" TIMESTAMPTZ(3) NOT NULL,
    "lastEvaluatedAt" TIMESTAMPTZ(3) NOT NULL,
    "acknowledgedAt" TIMESTAMPTZ(3),
    "acknowledgedById" TEXT,
    "acknowledgedByEmail" TEXT,
    "acknowledgedLevel" "AlertLevel",
    "acknowledgeNote" TEXT,
    "resolvedAt" TIMESTAMPTZ(3),
    "resolutionReason" "AlertResolutionReason",
    "metric" VARCHAR(64) NOT NULL,
    "unit" VARCHAR(16) NOT NULL,
    "thresholdMode" "AlertThresholdMode" NOT NULL,
    "triggerCycleId" TEXT,
    "triggerAt" TIMESTAMPTZ(3) NOT NULL,
    "triggerValue" DOUBLE PRECISION,
    "triggerBaseline" DOUBLE PRECISION,
    "triggerMeasure" DOUBLE PRECISION,
    "triggerThreshold" DOUBLE PRECISION NOT NULL,
    "consecutiveEvaluations" INTEGER NOT NULL,
    "peakValue" DOUBLE PRECISION,
    "peakMeasure" DOUBLE PRECISION,
    "peakAt" TIMESTAMPTZ(3),
    "peakCycleId" TEXT,
    "lastValue" DOUBLE PRECISION,
    "lastMeasure" DOUBLE PRECISION,
    "lastCycleId" TEXT,
    "affectedCount" INTEGER,
    "policyVersion" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(3) NOT NULL,

    CONSTRAINT "alert_occurrences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "alert_events" (
    "id" TEXT NOT NULL,
    "alertId" TEXT NOT NULL,
    "type" "AlertEventType" NOT NULL,
    "fromState" "AlertState",
    "toState" "AlertState" NOT NULL,
    "fromLevel" "AlertLevel",
    "toLevel" "AlertLevel",
    "occurredAt" TIMESTAMPTZ(3) NOT NULL,
    "cycleId" TEXT,
    "value" DOUBLE PRECISION,
    "measure" DOUBLE PRECISION,
    "threshold" DOUBLE PRECISION,
    "actorUserId" TEXT,
    "actorEmail" TEXT,
    "note" TEXT,
    "createdAt" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "alert_events_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "alert_rules_key_key" ON "alert_rules"("key");

-- CreateIndex
CREATE INDEX "alert_cycle_evidence_monitoringPointId_startedAt_idx" ON "alert_cycle_evidence"("monitoringPointId", "startedAt");

-- CreateIndex
CREATE INDEX "alert_cycle_evidence_sensorSerialNumber_startedAt_idx" ON "alert_cycle_evidence"("sensorSerialNumber", "startedAt");

-- CreateIndex
CREATE INDEX "alert_rule_evaluations_ruleId_outcome_idx" ON "alert_rule_evaluations"("ruleId", "outcome");

-- CreateIndex
CREATE UNIQUE INDEX "alert_rule_evaluations_cycleId_ruleId_policyVersion_key" ON "alert_rule_evaluations"("cycleId", "ruleId", "policyVersion");

-- CreateIndex
CREATE INDEX "alert_rule_states_monitoringPointId_idx" ON "alert_rule_states"("monitoringPointId");

-- CreateIndex
CREATE UNIQUE INDEX "alert_rule_states_ruleId_monitoringPointId_key" ON "alert_rule_states"("ruleId", "monitoringPointId");

-- CreateIndex
CREATE UNIQUE INDEX "alert_occurrences_activeKey_key" ON "alert_occurrences"("activeKey");

-- CreateIndex
CREATE INDEX "alert_occurrences_state_openedAt_idx" ON "alert_occurrences"("state", "openedAt" DESC);

-- CreateIndex
CREATE INDEX "alert_occurrences_machineId_state_idx" ON "alert_occurrences"("machineId", "state");

-- CreateIndex
CREATE INDEX "alert_occurrences_monitoringPointId_state_idx" ON "alert_occurrences"("monitoringPointId", "state");

-- CreateIndex
CREATE INDEX "alert_occurrences_sensorId_state_idx" ON "alert_occurrences"("sensorId", "state");

-- CreateIndex
CREATE INDEX "alert_occurrences_type_state_idx" ON "alert_occurrences"("type", "state");

-- CreateIndex
CREATE INDEX "alert_occurrences_openedAt_idx" ON "alert_occurrences"("openedAt");

-- CreateIndex
CREATE INDEX "alert_events_alertId_occurredAt_idx" ON "alert_events"("alertId", "occurredAt");

-- AddForeignKey
ALTER TABLE "alert_cycle_evidence" ADD CONSTRAINT "alert_cycle_evidence_cycleId_fkey" FOREIGN KEY ("cycleId") REFERENCES "ingestion_cycles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alert_rule_evaluations" ADD CONSTRAINT "alert_rule_evaluations_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "alert_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alert_rule_states" ADD CONSTRAINT "alert_rule_states_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "alert_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alert_rule_states" ADD CONSTRAINT "alert_rule_states_monitoringPointId_fkey" FOREIGN KEY ("monitoringPointId") REFERENCES "monitoring_points"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alert_occurrences" ADD CONSTRAINT "alert_occurrences_ruleId_fkey" FOREIGN KEY ("ruleId") REFERENCES "alert_rules"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alert_occurrences" ADD CONSTRAINT "alert_occurrences_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "machines"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alert_occurrences" ADD CONSTRAINT "alert_occurrences_monitoringPointId_fkey" FOREIGN KEY ("monitoringPointId") REFERENCES "monitoring_points"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alert_occurrences" ADD CONSTRAINT "alert_occurrences_sensorId_fkey" FOREIGN KEY ("sensorId") REFERENCES "sensors"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alert_occurrences" ADD CONSTRAINT "alert_occurrences_acknowledgedById_fkey" FOREIGN KEY ("acknowledgedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alert_events" ADD CONSTRAINT "alert_events_alertId_fkey" FOREIGN KEY ("alertId") REFERENCES "alert_occurrences"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "alert_events" ADD CONSTRAINT "alert_events_actorUserId_fkey" FOREIGN KEY ("actorUserId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Migração ADITIVA: só cria tipos, tabelas, índices e chaves para o domínio de alertas.
-- Nenhuma tabela existente é reescrita — em particular time_series_samples (10 M linhas)
-- não é tocada. As chaves para máquina/ponto/sensor nas ocorrências são anuláveis com
-- SET NULL de propósito: o histórico de alertas sobrevive à exclusão do cadastro, e o
-- escopo de frota não pertence a máquina alguma. Regras da política v1 não são inseridas
-- aqui: a API as garante na subida (create-only), para que edições posteriores sobrevivam.
