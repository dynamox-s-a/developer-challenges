import type { AppType } from "@dyn/api/app";
import {
  type AttachSensorRequest,
  type AuthenticatedUser,
  apiErrorSchema,
  type CreateMachineRequest,
  type CreateMonitoringPointRequest,
  type CreateTimeSeriesRequest,
  type LoginRequest,
  type LoginResponse,
  loginResponseSchema,
  type Machine,
  type MonitoringPoint,
  type MonitoringPointListForMachineResponse,
  type MonitoringPointListQuery,
  type MonitoringPointListResponse,
  machineListResponseSchema,
  machineSchema,
  meResponseSchema,
  monitoringPointListForMachineResponseSchema,
  monitoringPointListResponseSchema,
  monitoringPointSchema,
  type RegisterRequest,
  type Sensor,
  type SortOrder,
  sensorSchema,
  type TimeSeriesDetail,
  type TimeSeriesListResponse,
  type TimeSeriesMetrics,
  type TimeSeriesSummary,
  timeSeriesDetailSchema,
  timeSeriesListResponseSchema,
  timeSeriesMetricsSchema,
  timeSeriesSummarySchema,
  type UpdateMachineRequest,
} from "@dyn/contracts";
import { hc } from "hono/client";

export interface MonitoringPointQuery {
  page: number;
  sortBy: MonitoringPointListQuery["sortBy"];
  sortOrder: SortOrder;
}

export interface TimeSeriesFilters {
  page?: number;
  pageSize?: number;
  monitoringPointId?: string;
}

export interface ApiClient {
  register(input: RegisterRequest): Promise<LoginResponse>;
  login(input: LoginRequest): Promise<LoginResponse>;
  getMe(): Promise<AuthenticatedUser>;
  listMachines(): Promise<Machine[]>;
  createMachine(input: CreateMachineRequest): Promise<Machine>;
  updateMachine(id: string, input: UpdateMachineRequest): Promise<Machine>;
  deleteMachine(id: string): Promise<void>;
  createMonitoringPoint(
    machineId: string,
    input: CreateMonitoringPointRequest
  ): Promise<MonitoringPoint>;
  listMachineMonitoringPoints(machineId: string): Promise<MonitoringPoint[]>;
  listMonitoringPoints(input: MonitoringPointQuery): Promise<MonitoringPointListResponse>;
  attachSensor(monitoringPointId: string, input: AttachSensorRequest): Promise<Sensor>;
  createTimeSeries(
    monitoringPointId: string,
    input: CreateTimeSeriesRequest
  ): Promise<TimeSeriesSummary>;
  listTimeSeries(filters: TimeSeriesFilters): Promise<TimeSeriesListResponse>;
  getTimeSeriesMetrics(id: string): Promise<TimeSeriesMetrics>;
  getFullTimeSeries(id: string): Promise<TimeSeriesDetail>;
  deleteTimeSeries(id: string): Promise<void>;
}

interface HttpApiClientOptions {
  // The API is same-origin behind the Vite proxy; set an origin only to reach a remote API.
  origin?: string;
  getToken: () => string | null;
  onUnauthorized: () => void;
}

interface ResponseSchema<T> {
  parse(value: unknown): T;
}

export function createHttpApiClient({
  origin = "",
  getToken,
  onUnauthorized,
}: HttpApiClientOptions): ApiClient {
  const rpc = hc<AppType>(origin, {
    headers: () => {
      const token = getToken();
      return token ? { Authorization: `Bearer ${token}` } : {};
    },
  });

  async function handleError(response: Response, invalidateSession: boolean): Promise<never> {
    if (response.status === 401 && invalidateSession) {
      onUnauthorized();
    }
    const value: unknown = await response.json().catch(() => null);
    const parsed = apiErrorSchema.safeParse(value);
    if (parsed.success) {
      throw new Error(parsed.data.error.message);
    }
    throw new Error(`Request failed with status ${response.status}.`);
  }

  async function requestJson<T>(
    responsePromise: Promise<Response>,
    schema: ResponseSchema<T>,
    invalidateSession = true
  ): Promise<T> {
    const response = await responsePromise;
    if (!response.ok) {
      return handleError(response, invalidateSession);
    }
    const value: unknown = await response.json();
    return schema.parse(value);
  }

  async function requestVoid(
    responsePromise: Promise<Response>,
    invalidateSession = true
  ): Promise<void> {
    const response = await responsePromise;
    if (!response.ok) {
      await handleError(response, invalidateSession);
    }
  }

  return {
    register: (input) =>
      requestJson(rpc.api.v1.auth.register.$post({ json: input }), loginResponseSchema, false),
    login: (input) =>
      requestJson(rpc.api.v1.auth.login.$post({ json: input }), loginResponseSchema, false),
    getMe: async () => {
      const response = await requestJson(rpc.api.v1.auth.me.$get(), meResponseSchema);
      return response.user;
    },
    listMachines: async () => {
      const response = await requestJson(rpc.api.v1.machines.$get(), machineListResponseSchema);
      return response.items;
    },
    createMachine: (input) =>
      requestJson(rpc.api.v1.machines.$post({ json: input }), machineSchema),
    updateMachine: (id, input) =>
      requestJson(
        rpc.api.v1.machines[":machineId"].$patch({
          param: { machineId: id },
          json: input,
        }),
        machineSchema
      ),
    deleteMachine: (id) =>
      requestVoid(rpc.api.v1.machines[":machineId"].$delete({ param: { machineId: id } })),
    createMonitoringPoint: (machineId, input) =>
      requestJson(
        rpc.api.v1.machines[":machineId"]["monitoring-points"].$post({
          param: { machineId },
          json: input,
        }),
        monitoringPointSchema
      ),
    listMachineMonitoringPoints: (machineId) =>
      requestJson<MonitoringPointListForMachineResponse>(
        rpc.api.v1.machines[":machineId"]["monitoring-points"].$get({
          param: { machineId },
        }),
        monitoringPointListForMachineResponseSchema
      ),
    listMonitoringPoints: (input) =>
      requestJson(
        rpc.api.v1["monitoring-points"].$get({
          query: {
            page: String(input.page),
            sortBy: input.sortBy,
            sortOrder: input.sortOrder,
          },
        }),
        monitoringPointListResponseSchema
      ),
    attachSensor: (monitoringPointId, input) =>
      requestJson(
        rpc.api.v1["monitoring-points"][":monitoringPointId"].sensor.$post({
          param: { monitoringPointId },
          json: input,
        }),
        sensorSchema
      ),
    createTimeSeries: (monitoringPointId, input) =>
      requestJson(
        rpc.api.v1["monitoring-points"][":monitoringPointId"]["time-series"].$post({
          param: { monitoringPointId },
          json: input,
        }),
        timeSeriesSummarySchema
      ),
    listTimeSeries: (filters) =>
      requestJson(
        rpc.api.v1["time-series"].$get({
          query: {
            ...(filters.page ? { page: String(filters.page) } : {}),
            ...(filters.pageSize ? { pageSize: String(filters.pageSize) } : {}),
            ...(filters.monitoringPointId ? { monitoringPointId: filters.monitoringPointId } : {}),
          },
        }),
        timeSeriesListResponseSchema
      ),
    getTimeSeriesMetrics: (id) =>
      requestJson(
        rpc.api.v1["time-series"][":seriesId"].metrics.$get({ param: { seriesId: id } }),
        timeSeriesMetricsSchema
      ),
    getFullTimeSeries: (id) =>
      requestJson(
        rpc.api.v1["time-series"][":seriesId"].$get({ param: { seriesId: id } }),
        timeSeriesDetailSchema
      ),
    deleteTimeSeries: (id) =>
      requestVoid(rpc.api.v1["time-series"][":seriesId"].$delete({ param: { seriesId: id } })),
  };
}
