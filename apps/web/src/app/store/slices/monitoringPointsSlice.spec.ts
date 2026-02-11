import monitoringPointsReducer, {
  fetchMonitoringPoints,
  createMonitoringPoint,
  updateMonitoringPoint,
  deleteMonitoringPoint,
} from './monitoringPointsSlice';

describe('monitoringPoints reducer', () => {
  const initialState = {
    items: [],
    total: 0,
    page: 1,
    limit: 5,
    totalPages: 0,
    loading: false,
    error: null,
  };

  it('should handle initial state', () => {
    expect(monitoringPointsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('fetchMonitoringPoints', () => {
    it('should handle pending', () => {
      const action = { type: fetchMonitoringPoints.pending.type };
      const state = monitoringPointsReducer(initialState, action);
      expect(state.loading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('should handle fulfilled', () => {
      const mockPayload = {
        data: [{ id: '1', name: 'MP1' }],
        meta: { total: 1, page: 1, limit: 5, totalPages: 1 },
      };
      const action = { type: fetchMonitoringPoints.fulfilled.type, payload: mockPayload };
      const state = monitoringPointsReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.items).toEqual(mockPayload.data);
      expect(state.total).toBe(1);
    });

    it('should handle rejected', () => {
      const action = { type: fetchMonitoringPoints.rejected.type, payload: 'Error' };
      const state = monitoringPointsReducer(initialState, action);
      expect(state.loading).toBe(false);
      expect(state.error).toBe('Error');
    });
  });

  describe('updateMonitoringPoint', () => {
    it('should update item in list', () => {
      const startState = {
        ...initialState,
        items: [{ id: '1', name: 'Old Name', machineId: 'm1' }],
      };
      const updatedItem = { id: '1', name: 'New Name', machineId: 'm1' };
      const action = { type: updateMonitoringPoint.fulfilled.type, payload: updatedItem };
      const state = monitoringPointsReducer(startState, action);
      expect(state.items[0].name).toBe('New Name');
    });
  });

  describe('deleteMonitoringPoint', () => {
    it('should remove item from list', () => {
      const startState = {
        ...initialState,
        items: [{ id: '1', name: 'MP1', machineId: 'm1' }],
        total: 1,
      };
      const action = { type: deleteMonitoringPoint.fulfilled.type, payload: '1' };
      const state = monitoringPointsReducer(startState, action);
      expect(state.items).toHaveLength(0);
      expect(state.total).toBe(0);
    });
  });
});
