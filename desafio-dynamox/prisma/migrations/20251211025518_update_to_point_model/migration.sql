/*
  Warnings:

  - You are about to drop the `Sensor` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Machine` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sensorModel` to the `MonitoringPoint` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `MonitoringPoint` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Sensor_monitoringPointId_key";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Sensor";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Machine" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "status" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Machine" ("createdAt", "id", "name", "type") SELECT "createdAt", "id", "name", "type" FROM "Machine";
DROP TABLE "Machine";
ALTER TABLE "new_Machine" RENAME TO "Machine";
CREATE TABLE "new_MonitoringPoint" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "sensorModel" TEXT NOT NULL,
    "status" TEXT,
    "machineId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MonitoringPoint_machineId_fkey" FOREIGN KEY ("machineId") REFERENCES "Machine" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_MonitoringPoint" ("id", "machineId", "name") SELECT "id", "machineId", "name" FROM "MonitoringPoint";
DROP TABLE "MonitoringPoint";
ALTER TABLE "new_MonitoringPoint" RENAME TO "MonitoringPoint";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
