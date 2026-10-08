import type {
  MonitoringPointListItemDto,
  Paginated,
} from '@dynapredict/shared-types';
import { setupStore } from '../../app/store';
import * as monitoringPointsApi from '../../services/monitoringPointsApi';
import { aPage, aPointListItem, deferred } from '../../testing/fixtures';
import { httpError } from '../../testing/renderWithProviders';
import { logout } from '../auth/authSlice';
import {
  DEFAULT_MONITORING_POINTS_QUERY,
  fetchMonitoringPoints,
  monitoringPointsReducer,
  pageChanged,
  pageSizeChanged,
  sortChanged,
} from './monitoringPointsSlice';

vi.mock('../../services/monitoringPointsApi');
vi.mock('../../services/authApi');

describe('monitoringPointsSlice', () => {
  beforeEach(() => vi.resetAllMocks());

  const initial = monitoringPointsReducer(undefined, { type: 'init' });

  it('starts with 5 rows per page, by machine name', () => {
    expect(initial.query).toEqual({
      page: 1,
      pageSize: 5,
      sortBy: 'machineName',
      sortDir: 'asc',
    });
  });

  it('changes the page, and resets it on a new size or sort', () => {
    const onPage3 = monitoringPointsReducer(initial, pageChanged(3));
    expect(onPage3.query.page).toBe(3);
    expect(
      monitoringPointsReducer(onPage3, pageSizeChanged(10)).query,
    ).toMatchObject({ page: 1, pageSize: 10 });
    expect(
      monitoringPointsReducer(
        onPage3,
        sortChanged({ sortBy: 'sensorModel', sortDir: 'desc' }),
      ).query,
    ).toMatchObject({ page: 1, sortBy: 'sensorModel', sortDir: 'desc' });
  });

  it('fetches the page for the current query', async () => {
    const response = aPage([aPointListItem()], { pageSize: 5, total: 1 });
    vi.mocked(monitoringPointsApi.listMonitoringPoints).mockResolvedValue(
      response,
    );
    const store = setupStore();
    store.dispatch(sortChanged({ sortBy: 'pointName', sortDir: 'desc' }));

    await store.dispatch(fetchMonitoringPoints());

    expect(monitoringPointsApi.listMonitoringPoints).toHaveBeenCalledWith({
      ...DEFAULT_MONITORING_POINTS_QUERY,
      sortBy: 'pointName',
      sortDir: 'desc',
    });
    expect(store.getState().monitoringPoints).toMatchObject({
      status: 'succeeded',
      rows: response.data,
      meta: response.meta,
    });
  });

  it('keeps the API error', async () => {
    vi.mocked(monitoringPointsApi.listMonitoringPoints).mockRejectedValue(
      httpError(503, { error: { code: 'UNAVAILABLE', message: 'Try later' } }),
    );
    const store = setupStore();
    await store.dispatch(fetchMonitoringPoints());
    expect(store.getState().monitoringPoints).toMatchObject({
      status: 'failed',
      error: { status: 503, message: 'Try later' },
    });
  });

  it('ignores a response that arrives after a newer request', async () => {
    const older = deferred<Paginated<MonitoringPointListItemDto>>();
    const newer = deferred<Paginated<MonitoringPointListItemDto>>();
    vi.mocked(monitoringPointsApi.listMonitoringPoints)
      .mockReturnValueOnce(older.promise)
      .mockReturnValueOnce(newer.promise);
    const store = setupStore();

    const first = store.dispatch(fetchMonitoringPoints());
    const second = store.dispatch(fetchMonitoringPoints());
    newer.resolve(aPage([aPointListItem({ id: 'new' })]));
    await second;
    older.resolve(aPage([aPointListItem({ id: 'old' })]));
    await first;

    expect(store.getState().monitoringPoints.rows.map((r) => r.id)).toEqual([
      'new',
    ]);
  });

  it('forgets everything on logout', async () => {
    vi.mocked(monitoringPointsApi.listMonitoringPoints).mockResolvedValue(
      aPage([aPointListItem()]),
    );
    const store = setupStore();
    store.dispatch(pageChanged(2));
    await store.dispatch(fetchMonitoringPoints());

    await store.dispatch(logout());

    expect(store.getState().monitoringPoints).toEqual(initial);
  });
});
