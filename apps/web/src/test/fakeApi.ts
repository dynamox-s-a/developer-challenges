import type { ApiClient } from "../api/client";

function notConfigured(name: string): never {
  throw new Error(`Fake API method ${name} was not configured.`);
}

export function createFakeApi(overrides: Partial<ApiClient> = {}): ApiClient {
  return {
    register: async () => notConfigured("register"),
    login: async () => notConfigured("login"),
    getMe: async () => notConfigured("getMe"),
    listMachines: async () => [],
    createMachine: async () => notConfigured("createMachine"),
    updateMachine: async () => notConfigured("updateMachine"),
    deleteMachine: async () => undefined,
    createMonitoringPoint: async () => notConfigured("createMonitoringPoint"),
    listMachineMonitoringPoints: async () => [],
    listMonitoringPoints: async (query) => ({
      items: [],
      page: query.page,
      pageSize: 5,
      total: 0,
      totalPages: 0,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
    }),
    attachSensor: async () => notConfigured("attachSensor"),
    createTimeSeries: async () => notConfigured("createTimeSeries"),
    listTimeSeries: async (filters) => ({
      items: [],
      page: filters.page ?? 1,
      pageSize: filters.pageSize ?? 20,
      total: 0,
      totalPages: 0,
    }),
    getTimeSeriesMetrics: async () => notConfigured("getTimeSeriesMetrics"),
    getFullTimeSeries: async () => notConfigured("getFullTimeSeries"),
    deleteTimeSeries: async () => undefined,
    ...overrides,
  };
}
