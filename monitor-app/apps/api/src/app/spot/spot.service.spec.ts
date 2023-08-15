import { Test, TestingModule } from '@nestjs/testing'
import { SpotService } from './spot.service'
import { PrismaService } from '../prisma/prisma.service'
import { Prisma } from '@prisma/client'
import { MachineService } from '../machine/machine.service'

describe('SpotService', () => {
  let service: SpotService
  let prisma: PrismaService
  let machineService: MachineService

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

  const mockValidSpot = {
    name: 'spot 000',
    machineId: 'cllb822060000vezfv766mmwu',
    sensorId: 'Dyp.30.000.0000',
    sensorModel: 'TcAs'
  }

  const mockMachine = {
    id: 'cll5luz8p0000veihrodwvomu',
    name: 'machine 001',
    type: 'Pump'
  }

  const mockPrismaService = {
    spot: {
      create: jest.fn().mockReturnValue({ ...mockNewSpot, id: 'my-unique-id' }),
      findMany: jest.fn().mockResolvedValue(mockSpot),
      findFirst: jest.fn().mockResolvedValue(mockSpot[0]),
      update: jest.fn().mockResolvedValue({ id: 'my-unique-id', ...mockUpdatedSpot }),
      delete: jest.fn()
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SpotService,
        { provide: PrismaService, useValue: mockPrismaService },
        { provide: MachineService, useValue: { findOne: jest.fn().mockResolvedValue(mockSpot) } }
      ]
    }).compile()
    prisma = module.get<PrismaService>(PrismaService)
    service = module.get<SpotService>(SpotService)
    machineService = module.get<MachineService>(MachineService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should throw forbidden exception on create when sensor cannot be associated with machine', async () => {
    const createMock = jest.spyOn(machineService, 'findOne').mockResolvedValue(mockMachine)
    try {
      await service.create(mockValidSpot)
    } catch (error) {
      expect(error.response.message).toMatch(
        `Error: model ${mockValidSpot.sensorModel} sensors cannot be associated with machines of type Pump`
      )
    }
    expect(createMock).toHaveBeenCalledWith(mockValidSpot.machineId)
  })

  it('should handle unique constraint violation on create when spot already exists', async () => {
    const createMock = jest.spyOn(prisma.spot, 'create').mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError('P2002', {
        code: 'P2002',
        clientVersion: '',
        meta: { target: ['name'] }
      })
    )

    expect.assertions(2)
    try {
      await service.create(mockNewSpot)
    } catch (error) {
      expect(error.response.message).toMatch('Error: Spot already exists. Try another name.')
    }

    expect(createMock).toHaveBeenCalledWith({
      data: mockNewSpot
    })
  })

  it('should handle unique constraint violation on create when sensor is already being used', async () => {
    const createMock = jest.spyOn(prisma.spot, 'create').mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError('P2002', {
        code: 'P2002',
        clientVersion: '',
        meta: { target: ['sensorId'] }
      })
    )

    expect.assertions(2)
    try {
      await service.create(mockNewSpot)
    } catch (error) {
      expect(error.response.message).toMatch('Error: Sensor is already being used. Try another ID.')
    }

    expect(createMock).toHaveBeenCalledWith({
      data: mockNewSpot
    })
  })

  it('should handle other Prisma errors on create', async () => {
    const createMock = jest.spyOn(prisma.spot, 'create').mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError('SOME_OTHER_ERROR', {
        code: 'P9999',
        clientVersion: '',
        meta: {}
      })
    )

    expect.assertions(2)
    try {
      await service.create(mockNewSpot)
    } catch (error) {
      expect(error.message).toMatch('SOME_OTHER_ERROR')
    }

    expect(createMock).toHaveBeenCalledWith({
      data: mockNewSpot
    })
  })

  it('should create a new spot', async () => {
    const response = await service.create(mockNewSpot)
    const expected = { ...mockNewSpot, id: 'my-unique-id' }
    expect(prisma.spot.create).toHaveBeenCalledWith({
      data: {
        name: mockNewSpot.name,
        machineId: mockNewSpot.machineId,
        sensorId: mockNewSpot.sensorId,
        sensorModel: mockNewSpot.sensorModel
      }
    })
    expect(response).toEqual(expected)
  })

  it('should return all spots', async () => {
    const response = await service.findAll()
    const expected = mockSpot
    expect(prisma.spot.findMany).toHaveBeenCalled()
    expect(response).toEqual(expected)
  })

  it('should return a spot by id', async () => {
    const response = await service.findOne('cllb7aysh0002ve6n6fqn1a94')
    const expected = mockSpot[0]
    expect(prisma.spot.findFirst).toHaveBeenCalledWith({
      where: { id: 'cllb7aysh0002ve6n6fqn1a94' }
    })
    expect(response).toEqual(expected)
  })

  it('should throw forbidden exception on update when sensor cannot be associated with machine', async () => {
    const createMock = jest.spyOn(machineService, 'findOne').mockResolvedValue(mockMachine)
    try {
      await service.update('my-unique-id', mockValidSpot)
    } catch (error) {
      expect(error.response.message).toMatch(
        `Error: model ${mockValidSpot.sensorModel} sensors cannot be associated with machines of type Pump`
      )
    }
    expect(createMock).toHaveBeenCalledWith(mockValidSpot.machineId)
  })

  it('should handle unique constraint violation on update when spot already exists', async () => {
    jest.spyOn(prisma.spot, 'update').mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError('P2002', {
        code: 'P2002',
        clientVersion: '',
        meta: { target: ['name'] }
      })
    )

    expect.assertions(2)
    try {
      await service.update('my-unique-id', { ...mockUpdatedSpot })
    } catch (error) {
      expect(error.response.message).toMatch('Error: Spot already exists. Try another name.')
    }
    expect(prisma.spot.update).toHaveBeenCalledWith({
      data: {
        name: mockUpdatedSpot.name,
        machineId: mockUpdatedSpot.machineId,
        sensorId: mockUpdatedSpot.sensorId,
        sensorModel: mockUpdatedSpot.sensorModel
      },
      where: { id: 'my-unique-id' }
    })
  })

  it('should handle unique constraint violation on update when sensor is already being used', async () => {
    jest.spyOn(prisma.spot, 'update').mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError('P2002', {
        code: 'P2002',
        clientVersion: '',
        meta: { target: ['sensorId'] }
      })
    )

    expect.assertions(2)
    try {
      await service.update('my-unique-id', { ...mockUpdatedSpot })
    } catch (error) {
      expect(error.response.message).toMatch('Error: Sensor is already being used. Try another ID.')
    }
    expect(prisma.spot.update).toHaveBeenCalledWith({
      data: {
        name: mockUpdatedSpot.name,
        machineId: mockUpdatedSpot.machineId,
        sensorId: mockUpdatedSpot.sensorId,
        sensorModel: mockUpdatedSpot.sensorModel
      },
      where: { id: 'my-unique-id' }
    })
  })

  it('should handle other Prisma errors on update', async () => {
    jest.spyOn(prisma.spot, 'update').mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError('SOME_OTHER_ERROR', {
        code: 'P9999',
        clientVersion: '',
        meta: {}
      })
    )

    expect.assertions(2)
    try {
      await service.update('my-unique-id', { ...mockUpdatedSpot })
    } catch (error) {
      expect(error.message).toMatch('SOME_OTHER_ERROR')
    }

    expect(prisma.spot.update).toHaveBeenCalledWith({
      data: {
        name: mockUpdatedSpot.name,
        machineId: mockUpdatedSpot.machineId,
        sensorId: mockUpdatedSpot.sensorId,
        sensorModel: mockUpdatedSpot.sensorModel
      },
      where: { id: 'my-unique-id' }
    })
  })

  it('should update a spot by id', async () => {
    const response = await service.update('my-unique-id', { ...mockUpdatedSpot })
    const expected = { id: 'my-unique-id', ...mockUpdatedSpot }
    expect(prisma.spot.update).toHaveBeenCalledWith({
      data: {
        name: mockUpdatedSpot.name,
        machineId: mockUpdatedSpot.machineId,
        sensorId: mockUpdatedSpot.sensorId,
        sensorModel: mockUpdatedSpot.sensorModel
      },
      where: { id: 'my-unique-id' }
    })
    expect(response).toEqual(expected)
  })

  it('should remove a spot by id', async () => {
    await service.remove('my-unique-id')
    expect(prisma.spot.delete).toHaveBeenCalledWith({ where: { id: 'my-unique-id' } })
  })
})
