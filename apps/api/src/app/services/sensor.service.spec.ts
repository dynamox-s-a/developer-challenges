import { SensorModel, MachineType } from '@prisma/client';
import { createSensorService } from './sensor.service';

const mockSensorRepo = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const mockMonitoringPointRepo = {
  findById: jest.fn(),
  findAll: jest.fn(),
  count: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const service = createSensorService(mockSensorRepo as any, mockMonitoringPointRepo as any);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('sensor.service', () => {
  describe('create', () => {
    it('rejects TcAg for Pump machine', async () => {
      mockMonitoringPointRepo.findById.mockResolvedValue({
        id: 'mp1',
        machine: { type: MachineType.Pump },
        sensor: null,
      });

      await expect(
        service.create({ model: SensorModel.TcAg, monitoringPointId: 'mp1' })
      ).rejects.toMatchObject({ statusCode: 400, message: expect.stringContaining('TcAg') });
      expect(mockSensorRepo.create).not.toHaveBeenCalled();
    });

    it('rejects TcAs for Pump machine', async () => {
      mockMonitoringPointRepo.findById.mockResolvedValue({
        id: 'mp1',
        machine: { type: MachineType.Pump },
        sensor: null,
      });

      await expect(
        service.create({ model: SensorModel.TcAs, monitoringPointId: 'mp1' })
      ).rejects.toMatchObject({ statusCode: 400 });
      expect(mockSensorRepo.create).not.toHaveBeenCalled();
    });

    it('accepts HF+ for Pump machine', async () => {
      mockMonitoringPointRepo.findById.mockResolvedValue({
        id: 'mp1',
        machine: { type: MachineType.Pump },
        sensor: null,
      });
      mockSensorRepo.create.mockResolvedValue({ id: 's1', model: SensorModel.HFPlus });

      const result = await service.create({ model: SensorModel.HFPlus, monitoringPointId: 'mp1' });
      expect(mockSensorRepo.create).toHaveBeenCalledWith({
        model: SensorModel.HFPlus,
        monitoringPointId: 'mp1',
      });
      expect(result.model).toBe(SensorModel.HFPlus);
    });

    it('accepts TcAg for Fan machine', async () => {
      mockMonitoringPointRepo.findById.mockResolvedValue({
        id: 'mp1',
        machine: { type: MachineType.Fan },
        sensor: null,
      });
      mockSensorRepo.create.mockResolvedValue({ id: 's1', model: SensorModel.TcAg });

      await service.create({ model: SensorModel.TcAg, monitoringPointId: 'mp1' });
      expect(mockSensorRepo.create).toHaveBeenCalled();
    });

    it('throws 404 when monitoring point not found', async () => {
      mockMonitoringPointRepo.findById.mockResolvedValue(null);

      await expect(
        service.create({ model: SensorModel.HFPlus, monitoringPointId: 'invalid' })
      ).rejects.toMatchObject({ statusCode: 404, message: 'Monitoring point not found' });
    });

    it('throws 400 when monitoring point already has sensor', async () => {
      mockMonitoringPointRepo.findById.mockResolvedValue({
        id: 'mp1',
        machine: { type: MachineType.Fan },
        sensor: { id: 's1' },
      });

      await expect(
        service.create({ model: SensorModel.TcAg, monitoringPointId: 'mp1' })
      ).rejects.toMatchObject({ statusCode: 400, message: 'Monitoring point already has a sensor' });
    });
  });

  describe('update', () => {
    it('rejects changing to TcAg when machine is Pump', async () => {
      mockSensorRepo.findById.mockResolvedValue({
        id: 's1',
        monitoringPoint: { machine: { type: MachineType.Pump } },
      });

      await expect(
        service.update('s1', { model: SensorModel.TcAg })
      ).rejects.toMatchObject({ statusCode: 400 });
      expect(mockSensorRepo.update).not.toHaveBeenCalled();
    });

    it('accepts changing to HF+ when machine is Pump', async () => {
      mockSensorRepo.findById.mockResolvedValue({
        id: 's1',
        monitoringPoint: { machine: { type: MachineType.Pump } },
      });
      mockSensorRepo.update.mockResolvedValue({ id: 's1', model: SensorModel.HFPlus });

      await service.update('s1', { model: SensorModel.HFPlus });
      expect(mockSensorRepo.update).toHaveBeenCalledWith('s1', { model: SensorModel.HFPlus });
    });
  });

  describe('findById', () => {
    it('throws 404 when sensor not found', async () => {
      mockSensorRepo.findById.mockResolvedValue(null);

      await expect(service.findById('invalid')).rejects.toMatchObject({
        statusCode: 404,
        message: 'Sensor not found',
      });
    });
  });
});
