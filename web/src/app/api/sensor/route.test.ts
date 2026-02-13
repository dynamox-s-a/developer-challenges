/** biome-ignore-all lint/complexity/useOptionalChain: idk*/
import { POST } from './route'
import type { NextRequest } from 'next/server'
import dbConnect from '@/lib/database/mongoose'
import sensorRepository from '@/lib/database/sensor/repository'
import { CreateSensorSchema } from '@/types/zod/sensor'

jest.mock('@/lib/database/mongoose', () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve()),
}))

jest.mock('@/lib/database/sensor/repository', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
  },
}))

jest.mock('@/types/zod/sensor', () => ({
  CreateSensorSchema: {
    safeParse: jest.fn(),
  },
}))

const mockSensorData = {
  name: 'Sensor T1',
  model: 'XYZ-123',
  machineId: '507f1f77bcf86cd799439011',
  monitoringPointId: '507f1f77bcf86cd799439012',
}
const mockParsedData = { ...mockSensorData }
const mockCreatedSensor = {
  _id: '507f1f77bcf86cd799439013',
  ...mockSensorData,
}
const mockSuccessMessage = 'Sensor criado com sucesso'

let req: NextRequest

beforeEach(() => {
  jest.clearAllMocks()

  ;(dbConnect as jest.Mock).mockResolvedValue(undefined)

  ;(sensorRepository.create as jest.Mock).mockResolvedValue({
    success: true,
    message: mockSuccessMessage,
    data: mockCreatedSensor,
  })

  ;(CreateSensorSchema.safeParse as jest.Mock).mockImplementation(val => {
    if (val && val.name && val.model && val.machineId) {
      return { success: true, data: val }
    }
    return {
      success: false,
      error: { message: 'Dados inválidos' },
    }
  })

  req = {
    json: jest.fn(),
  } as unknown as NextRequest
})

describe('POST /api/sensor', () => {
  it('deve retornar 200 e os dados do sensor criado quando o cadastro for bem-sucedido', async () => {
    ;(req.json as jest.Mock).mockResolvedValue(mockSensorData)

    const response = await POST(req)
    const json = await response.json()

    expect(dbConnect).toHaveBeenCalledTimes(1)
    expect(req.json).toHaveBeenCalledTimes(1)
    expect(CreateSensorSchema.safeParse).toHaveBeenCalledWith(mockSensorData)
    expect(sensorRepository.create).toHaveBeenCalledWith(mockParsedData)

    expect(response.status).toBe(200)
    expect(json).toEqual({
      success: true,
      message: mockSuccessMessage,
      data: mockCreatedSensor,
    })
  })

  it('deve retornar 400 quando a validação falhar', async () => {
    const invalidBody = { name: 'Sensor T1' } // faltam campos
    ;(req.json as jest.Mock).mockResolvedValue(invalidBody)
    ;(CreateSensorSchema.safeParse as jest.Mock).mockReturnValueOnce({
      success: false,
      error: { message: 'Campos obrigatórios: model, machineId' },
    })

    const response = await POST(req)
    const json = await response.json()

    expect(dbConnect).toHaveBeenCalledTimes(1)
    expect(req.json).toHaveBeenCalledTimes(1)
    expect(CreateSensorSchema.safeParse).toHaveBeenCalledWith(invalidBody)
    expect(sensorRepository.create).not.toHaveBeenCalled()

    expect(response.status).toBe(400)
    expect(json).toEqual({
      success: false,
      message: 'Campos obrigatórios: model, machineId',
    })
  })

  it('deve retornar 400 quando o repositório falhar ao criar o sensor', async () => {
    ;(req.json as jest.Mock).mockResolvedValue(mockSensorData)
    ;(sensorRepository.create as jest.Mock).mockResolvedValueOnce({
      success: false,
      message: 'Erro ao inserir no banco',
    })

    const response = await POST(req)
    const json = await response.json()

    expect(dbConnect).toHaveBeenCalledTimes(1)
    expect(req.json).toHaveBeenCalledTimes(1)
    expect(CreateSensorSchema.safeParse).toHaveBeenCalledWith(mockSensorData)
    expect(sensorRepository.create).toHaveBeenCalledWith(mockParsedData)

    expect(response.status).toBe(400)
    expect(json).toEqual({
      success: false,
      message: 'Erro ao inserir no banco',
    })
  })

  it('deve propagar o erro quando o repositório lançar uma exceção', async () => {
    ;(req.json as jest.Mock).mockResolvedValue(mockSensorData)
    const dbError = new Error('Erro inesperado')
    ;(sensorRepository.create as jest.Mock).mockRejectedValueOnce(dbError)

    await expect(POST(req)).rejects.toThrow('Erro inesperado')
    expect(sensorRepository.create).toHaveBeenCalledWith(mockParsedData)
  })
})
