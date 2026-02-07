import { createMachineService } from './machine.service';
import { MachineType } from '@prisma/client';

const mockRepo = {
  findAll: jest.fn(),
  findById: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

const service = createMachineService(mockRepo as any);

beforeEach(() => {
  jest.clearAllMocks();
});

describe('machine.service', () => {
  describe('findById', () => {
    it('throws when machine not found', async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(service.findById('invalid')).rejects.toThrow('Machine not found');
    });

    it('returns machine when found', async () => {
      const machine = { id: 'm1', name: 'Test', type: MachineType.Pump };
      mockRepo.findById.mockResolvedValue(machine);

      const result = await service.findById('m1');
      expect(result).toEqual(machine);
    });
  });

  describe('create', () => {
    it('delegates to repository', async () => {
      const data = { name: 'Pump 1', type: MachineType.Pump };
      mockRepo.create.mockResolvedValue({ id: 'm1', ...data });

      const result = await service.create(data);
      expect(mockRepo.create).toHaveBeenCalledWith(data);
      expect(result.name).toBe('Pump 1');
    });
  });

  describe('update', () => {
    it('throws when machine not found', async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(
        service.update('invalid', { name: 'Updated' })
      ).rejects.toThrow('Machine not found');
      expect(mockRepo.update).not.toHaveBeenCalled();
    });

    it('updates when machine exists', async () => {
      mockRepo.findById.mockResolvedValue({ id: 'm1' });
      mockRepo.update.mockResolvedValue({ id: 'm1', name: 'Updated', type: MachineType.Pump });

      await service.update('m1', { name: 'Updated' });
      expect(mockRepo.update).toHaveBeenCalledWith('m1', { name: 'Updated' });
    });
  });

  describe('delete', () => {
    it('throws when machine not found', async () => {
      mockRepo.findById.mockResolvedValue(null);

      await expect(service.delete('invalid')).rejects.toThrow('Machine not found');
      expect(mockRepo.delete).not.toHaveBeenCalled();
    });

    it('deletes when machine exists', async () => {
      mockRepo.findById.mockResolvedValue({ id: 'm1' });
      mockRepo.delete.mockResolvedValue(undefined);

      await service.delete('m1');
      expect(mockRepo.delete).toHaveBeenCalledWith('m1');
    });
  });
});
