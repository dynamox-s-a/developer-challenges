import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

jest.mock('@source/persistence', () => ({
  prisma: {},
  MachineType: { Pump: 'Pump', Fan: 'Fan' },
  SensorModel: { TcAg: 'TcAg', TcAs: 'TcAs', HF_Plus: 'HF_Plus' },
}));

describe('AppController', () => {
  let appController: AppController;

  beforeAll(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  it('should be defined', () => {
    expect(appController).toBeDefined();
  });

  describe('healthCheck', () => {
    it('should return { status: "ok" }', () => {
      expect(appController.healthCheck()).toEqual({ status: 'ok' });
    });
  });
});
