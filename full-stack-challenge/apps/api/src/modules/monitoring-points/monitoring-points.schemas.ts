import { MONITORING_POINT_SORT_FIELDS } from '@dynapredict/shared-types';
import { z } from 'zod';
import { paginationQuery } from '../../lib/pagination';

export const monitoringPointIdParams = z.object({ id: z.uuid() });
export const machineIdParams = z.object({ machineId: z.uuid() });

export const monitoringPointInputSchema = z.object({
  name: z.string().trim().min(1).max(100),
});

export const listMonitoringPointsQuery = paginationQuery(5).extend({
  sortBy: z.enum(MONITORING_POINT_SORT_FIELDS).default('machineName'),
  sortDir: z.enum(['asc', 'desc']).default('asc'),
});

export type MonitoringPointInput = z.infer<typeof monitoringPointInputSchema>;
export type ListMonitoringPointsQuery = z.infer<
  typeof listMonitoringPointsQuery
>;
