import { createMonitoringPointService } from './monitoring-point.service';

describe('MonitoringPointService', () => {
  let service: ReturnType<typeof createMonitoringPointService>;
  const mockMonitoringPointRepository = {
    findAll: jest.fn(),
    count: jest.fn(),
    findByMachineId: jest.fn(),
    findById: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };
  const mockMachineRepository = {
    findById: jest.fn(),
  };

  beforeEach(() => {
    service = createMonitoringPointService(
      mockMonitoringPointRepository as any,
      mockMachineRepository as any
    );
    jest.clearAllMocks();
  });

  describe('findAll', () => {
    it('should return paginated data', async () => {
      const mockData = [{ id: '1', name: 'MP1' }];
      const mockTotal = 1;
      mockMonitoringPointRepository.findAll.mockResolvedValue(mockData);
      mockMonitoringPointRepository.count.mockResolvedValue(mockTotal);

      const result = await service.findAll({ page: 1, limit: 5 });

      expect(result).toEqual({
        data: mockData,
        meta: {
          total: mockTotal,
          page: 1,
          limit: 5,
          totalPages: 1,
        },
      });
      expect(mockMonitoringPointRepository.findAll).toHaveBeenCalledWith({
        skip: 0,
        take: 5,
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('create', () => {
    it('should create a monitoring point if machine exists', async () => {
      const mockMachine = { id: 'm1', name: 'Machine 1' };
      const mockPoint = { id: 'mp1', name: 'Point 1', machineId: 'm1' };
      mockMachineRepository.findById.mockResolvedValue(mockMachine);
      mockMonitoringPointRepository.create.mockResolvedValue(mockPoint);

      const result = await service.create({ name: 'Point 1', machineId: 'm1' });

      expect(result).toEqual(mockPoint);
      expect(mockMachineRepository.findById).toHaveBeenCalledWith('m1');
      expect(mockMonitoringPointRepository.create).toHaveBeenCalledWith({
        name: 'Point 1',
        machineId: 'm1',
      });
    });

    it('should throw error if machine does not exist', async () => {
      mockMachineRepository.findById.mockResolvedValue(null);

      await expect(service.create({ name: 'Point 1', machineId: 'm1' }))
        .rejects.toEqual({ statusCode: 404, message: 'Machine not found' });
    });
  });

  describe('findById', () => {
    it('should return monitoring point if found', async () => {
      const mockPoint = { id: 'mp1', name: 'Point 1' };
      mockMonitoringPointRepository.findById.mockResolvedValue(mockPoint);

      const result = await service.findById('mp1');
      expect(result).toEqual(mockPoint);
    });

    it('should throw error if not found', async () => {
      mockMonitoringPointRepository.findById.mockResolvedValue(null);
      await expect(service.findById('mp1')).rejects.toEqual({
        statusCode: 404,
        message: 'Monitoring point not found',
      });
    });
  });

  describe('update', () => {
    it('should update monitoring point if exists', async () => {
      const mockPoint = { id: 'mp1', name: 'Point 1' };
      mockMonitoringPointRepository.findById.mockResolvedValue(mockPoint);
      mockMonitoringPointRepository.update.mockResolvedValue({ ...mockPoint, name: 'Updated' });

      const result = await service.update('mp1', { name: 'Updated' });
      expect(result.name).toBe('Updated');
    });

    it('should throw error if not found', async () => {
      mockMonitoringPointRepository.findById.mockResolvedValue(null);
      await expect(service.update('mp1', { name: 'Updated' })).rejects.toEqual({
        statusCode: 404,
        message: 'Monitoring point not found',
      });
    });
  });

  describe('delete', () => {
    it('should delete monitoring point if exists', async () => {
      const mockPoint = { id: 'mp1', name: 'Point 1' };
      mockMonitoringPointRepository.findById.mockResolvedValue(mockPoint);
      mockMonitoringPointRepository.delete.mockResolvedValue(mockPoint);

      const result = await service.delete('mp1');
      expect(result).toEqual(mockPoint);
    });

    it('should throw error if not found', async () => {
      mockMonitoringPointRepository.findById.mockResolvedValue(null);
      await expect(service.delete('mp1')).rejects.toEqual({
        statusCode: 404,
        message: 'Monitoring point not found',
      });
    });
  });
});
