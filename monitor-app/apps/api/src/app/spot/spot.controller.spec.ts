import { Test, TestingModule } from '@nestjs/testing'
import { SpotController } from './spot.controller'
import { SpotService } from './spot.service'

describe('SpotController', () => {
  let controller: SpotController
  let service: SpotService

  const mockSpot = [
    {
      id: 'cllb7aysh0002ve6n6fqn1a94',
      name: 'spot 001',
      machineId: 'cllb77zgp0000ve6n8vyz4uf9',
      sensorId: 'Dyp.30.000.0001',
      sensorModel: 'HF+'
    }
  ]

  const mockNewSpot = {
    name: 'spot 001',
    machineId: 'cllb77zgp0000ve6n8vyz4uf9',
    sensorId: 'Dyp.30.000.0001',
    sensorModel: 'HF+'
  }

  const mockUpdatedSpot = {
    name: 'spot 001',
    machineId: 'cllb77zgp0000ve6n8vyz4uf9',
    sensorId: 'Dyp.30.000.0001',
    sensorModel: 'HF+'
  }

  const mockSpotService = {
    findAll: jest.fn().mockResolvedValue(mockSpot),
    create: jest.fn().mockResolvedValue({ ...mockNewSpot, id: 'my-unique-id' }),
    findOne: jest.fn().mockResolvedValue(mockSpot[0]),
    update: jest.fn().mockResolvedValue({ ...mockUpdatedSpot, id: 'my-unique-id' }),
    remove: jest.fn()
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SpotController],
      providers: [{ provide: SpotService, useValue: mockSpotService }]
    }).compile()

    controller = module.get<SpotController>(SpotController)
    service = module.get<SpotService>(SpotService)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should create a new spot', async () => {
    const response = await controller.create(mockNewSpot)
    const expected = { ...mockNewSpot, id: 'my-unique-id' }
    expect(response).toEqual(expected)
  })

  it('should return all spots', async () => {
    const response = await controller.findAll()
    const expected = mockSpot
    expect(response).toEqual(expected)
  })

  it('should return a spot by id', async () => {
    const response = await controller.findOne('cllb7aysh0002ve6n6fqn1a94')
    const expected = mockSpot[0]
    expect(response).toEqual(expected)
  })

  it('should update a spot by id', async () => {
    const response = await controller.update('my-unique-id', mockUpdatedSpot)
    const expected = { id: 'my-unique-id', ...mockUpdatedSpot }
    expect(response).toEqual(expected)
  })

  it('should remove a machine by id', async () => {
    await controller.remove('my-unique-id')
    expect(service.remove).toHaveBeenCalledWith('my-unique-id')
  })
})
