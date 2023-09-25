import { Test, TestingModule } from '@nestjs/testing'
import { MachineService } from './machine.service'
import { PrismaService } from '../prisma/prisma.service'
import { Prisma } from '@prisma/client'
import { ForbiddenException, NotFoundException } from '@nestjs/common'

describe('MachineService', () => {
  let service: MachineService
  let prisma: PrismaService

  const mockMachine = [
    {
      id: 'cll5luz8p0000veihrodwvomu',
      name: 'machine 001',
      type: 'Pump'
    }
  ]

  const mockNewMachine = { name: 'machine 001', type: 'Pump' }

  const mockUpdatedMachine = {
    name: 'updated machine',
    type: 'Fan'
  }

  const mockSpot = {
    id: 'cllb7aysh0002ve6n6fqn1a94',
    name: 'spot 001',
    machineId: 'cllb77zgp0000ve6n8vyz4uf9',
    sensorId: 'Dyp.30.000.0001',
    sensorModel: 'TcAs'
  }

  const mockPrismaService = {
    machine: {
      create: jest.fn().mockReturnValue({ ...mockNewMachine, id: 'my-unique-id' }),
      findMany: jest.fn().mockResolvedValue(mockMachine),
      findUniqueOrThrow: jest.fn().mockResolvedValue(mockMachine[0]),
      update: jest.fn().mockResolvedValue({ id: 'my-unique-id', ...mockUpdatedMachine }),
      delete: jest.fn()
    },
    spot: {
      findMany: jest.fn().mockResolvedValue(mockMachine)
    }
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MachineService, { provide: PrismaService, useValue: mockPrismaService }]
    }).compile()
    prisma = module.get<PrismaService>(PrismaService)
    service = module.get<MachineService>(MachineService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should handle unique constraint violation on create when machine already exists', async () => {
    const createMock = jest.spyOn(prisma.machine, 'create').mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError('P2002', {
        code: 'P2002',
        clientVersion: '',
        meta: { target: ['name'] }
      })
    )

    expect.assertions(2)
    try {
      await service.create(mockNewMachine)
    } catch (error) {
      expect(error.response.message).toMatch('Error: Machine already exists. Try another name.')
    }

    expect(createMock).toHaveBeenCalledWith({
      data: mockNewMachine
    })
  })

  it('should handle other Prisma errors on create', async () => {
    const createMock = jest.spyOn(prisma.machine, 'create').mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError('SOME_OTHER_ERROR', {
        code: 'P9999',
        clientVersion: '',
        meta: {}
      })
    )

    expect.assertions(2)
    try {
      await service.create(mockNewMachine)
    } catch (error) {
      expect(error.message).toMatch('SOME_OTHER_ERROR')
    }

    expect(createMock).toHaveBeenCalledWith({
      data: mockNewMachine
    })
  })

  it('should create a new machine', async () => {
    const response = await service.create(mockNewMachine)
    const expected = { ...mockNewMachine, id: 'my-unique-id' }
    expect(prisma.machine.create).toHaveBeenCalledWith({
      data: { name: mockNewMachine.name, type: mockNewMachine.type }
    })
    expect(response).toEqual(expected)
  })

  it('should return all machines', async () => {
    const response = await service.findAll()
    const expected = mockMachine
    expect(prisma.machine.findMany).toHaveBeenCalled()
    expect(response).toEqual(expected)
  })

  it('should throw NotFoundException when machine id not found', async () => {
    const findOneMock = jest
      .spyOn(prisma.machine, 'findUniqueOrThrow')
      .mockRejectedValueOnce(new NotFoundException(`Error: Machine not found`))

    expect.assertions(2)
    try {
      await service.findOne('invalid-id')
    } catch (error) {
      expect(error.message).toMatch('Error: Machine not found')
    }
    expect(findOneMock).toHaveBeenCalledWith({
      where: { id: 'invalid-id' }
    })
  })

  it('should return a machine by id', async () => {
    const response = await service.findOne('cll5luz8p0000veihrodwvomu')
    const expected = mockMachine[0]
    expect(prisma.machine.findUniqueOrThrow).toHaveBeenCalledWith({
      where: { id: 'cll5luz8p0000veihrodwvomu' }
    })
    expect(response).toEqual(expected)
  })

  it('should handle unique constraint violation on update when machine already exists', async () => {
    jest.spyOn(prisma.machine, 'update').mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError('P2002', {
        code: 'P2002',
        clientVersion: ''
      })
    )

    expect.assertions(2)
    try {
      await service.update('my-unique-id', { ...mockUpdatedMachine })
    } catch (error) {
      expect(error.response.message).toMatch('Error: Machine already exists. Try another name.')
    }
    expect(prisma.machine.update).toHaveBeenCalledWith({
      data: { name: mockUpdatedMachine.name, type: mockUpdatedMachine.type },
      where: { id: 'my-unique-id' }
    })
  })

  it('should handle other Prisma errors on update', async () => {
    jest.spyOn(prisma.machine, 'update').mockRejectedValueOnce(
      new Prisma.PrismaClientKnownRequestError('SOME_OTHER_ERROR', {
        code: 'P9999',
        clientVersion: ''
      })
    )

    expect.assertions(2)
    try {
      await service.update('my-unique-id', { ...mockUpdatedMachine })
    } catch (error) {
      expect(error.message).toMatch('SOME_OTHER_ERROR')
    }

    expect(prisma.machine.update).toHaveBeenCalledWith({
      data: { name: mockUpdatedMachine.name, type: mockUpdatedMachine.type },
      where: { id: 'my-unique-id' }
    })
  })

  it('should update a machine by id', async () => {
    const response = await service.update('my-unique-id', { ...mockUpdatedMachine })
    const expected = { id: 'my-unique-id', ...mockUpdatedMachine }
    expect(prisma.machine.update).toHaveBeenCalledWith({
      data: { name: mockUpdatedMachine.name, type: mockUpdatedMachine.type },
      where: { id: 'my-unique-id' }
    })
    expect(response).toEqual(expected)
  })

  it('should handle machine type error on update', async () => {
    jest.spyOn(prisma.spot, 'findMany').mockResolvedValueOnce([mockSpot])
    jest
      .spyOn(prisma.machine, 'update')
      .mockRejectedValueOnce(
        new ForbiddenException(
          `Error: model ${mockSpot.sensorModel} sensors cannot be associated with machines of type Pump`
        )
      )
    const expected = `Error: model ${mockSpot.sensorModel} sensors cannot be associated with machines of type Pump`
    try {
      await service.update('my-unique-id', {
        name: 'updated machine',
        type: 'Pump'
      })
    } catch (error) {
      expect(error.message).toMatch(expected)
    }
    expect(prisma.machine.update).toHaveBeenCalledWith({
      data: {
        name: 'updated machine',
        type: 'Fan'
      },
      where: { id: 'my-unique-id' }
    })
  })

  it('should remove a machine by id', async () => {
    await service.remove('my-unique-id')
    expect(prisma.machine.delete).toHaveBeenCalledWith({ where: { id: 'my-unique-id' } })
  })
})
