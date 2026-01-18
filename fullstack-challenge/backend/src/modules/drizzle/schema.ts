import { int, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const machinesTable = sqliteTable('machines_table', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  type: text().notNull(),
});

export const monitoringPointsTable = sqliteTable('monitoring_points_table', {
  id: int().primaryKey({ autoIncrement: true }),
  name: text().notNull(),
  type: text().notNull(),
  machineId: int().references(() => machinesTable.id).notNull(),
});
