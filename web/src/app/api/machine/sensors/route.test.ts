/** biome-ignore-all lint/style/useTemplate: idk */


jest.mock('@/lib/database/mongoose', () => ({
  default: jest.fn(() => Promise.resolve()),
}))

jest.mock('@/lib/database/sensor/repository')

jest.mock('zod', () => ({
  string: jest.fn(() => ({
    safeParse: jest.fn(),
  })),
}))

jest.spyOn(console, 'log').mockImplementation(() => {})
jest.spyOn(console, 'error').mockImplementation(() => {})

import { POST } from './route'
import type { NextRequest } from 'next/server'
import dbConnect from '@/lib/database/mongoose'
import sensorRepository from '@/lib/database/sensor/repository'
import z from 'zod'

const mockMachineId = '507f1f77bcf86cd799439011'
const mockSensors = [
  { _id: 'sensor1', name: 'Sensor A', value: 100 },
  { _id: 'sensor2', name: 'Sensor B', value: 200 },
]

let req: NextRequest

beforeEach(() => {
  jest.clearAllMocks()

  ;(dbConnect as jest.Mock).mockResolvedValue(undefined)

  ;(sensorRepository.getMachineSensors as jest.Mock).mockResolvedValue({
    success: true,
    data: mockSensors,
  })

  ;(z.string().safeParse as jest.Mock).mockImplementation(val => {
    if (typeof val === 'string') {
      return { success: true, data: val }
    }
    return {
      success: false,
      error: { message: 'Expected string, received object' },
    }
  })

  req = {
    json: jest.fn(),
  } as unknown as NextRequest
})

describe('POST /api/sensor', () => {
  it('deve retornar 200 e os sensores quando o ID for uma string válida', async () => {
    ;(req.json as jest.Mock).mockResolvedValue(mockMachineId)

    const response = await POST(req)
    const json = await response.json()

    expect(dbConnect).toHaveBeenCalledTimes(1)
    expect(req.json).toHaveBeenCalledTimes(1)
    expect(z.string().safeParse).toHaveBeenCalledWith(mockMachineId)
    expect(sensorRepository.getMachineSensors).toHaveBeenCalledWith(
      mockMachineId,
    )

    expect(response.status).toBe(200)
    expect(json).toEqual({
      success: true,
      message: 'Dados recebidos com sucesso',
      data: mockSensors,
    })
  })

  it('deve retornar 400 quando o corpo não for uma string (validação falha)', async () => {
    const invalidBody = { id: 123 } // objeto inválido
    ;(req.json as jest.Mock).mockResolvedValue(invalidBody)

    ;(z.string().safeParse as jest.Mock).mockReturnValueOnce({
      success: false,
      error: { message: 'Expected string, received object' },
    })

    const response = await POST(req)
    const json = await response.json()

    expect(dbConnect).toHaveBeenCalledTimes(1)
    expect(req.json).toHaveBeenCalledTimes(1)
    expect(z.string().safeParse).toHaveBeenCalledWith(invalidBody)
    expect(sensorRepository.getMachineSensors).not.toHaveBeenCalled()

    expect(response.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.message).toContain('ID da máquina deve ser uma string')
  })

  it('deve retornar 400 quando o repositório falhar', async () => {
    ;(req.json as jest.Mock).mockResolvedValue(mockMachineId)

    const errorMessage = 'Máquina não encontrada'
    ;(sensorRepository.getMachineSensors as jest.Mock).mockResolvedValueOnce({
      success: false,
      message: errorMessage,
    })

    const response = await POST(req)
    const json = await response.json()

    expect(dbConnect).toHaveBeenCalledTimes(1)
    expect(req.json).toHaveBeenCalledTimes(1)
    expect(z.string().safeParse).toHaveBeenCalledWith(mockMachineId)
    expect(sensorRepository.getMachineSensors).toHaveBeenCalledWith(
      mockMachineId,
    )

    expect(response.status).toBe(400)
    expect(json).toEqual({
      success: false,
      message: errorMessage,
    })
  })

  it('deve retornar 400 com mensagem padrão quando o repositório falhar sem mensagem', async () => {
    ;(req.json as jest.Mock).mockResolvedValue(mockMachineId)

    ;(sensorRepository.getMachineSensors as jest.Mock).mockResolvedValueOnce({
      success: false,
    })

    const response = await POST(req)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json).toEqual({
      success: false,
      message: 'Erro ao buscar sensores',
    })
  })

  it('deve retornar 500 quando ocorrer um erro inesperado (ex: dbConnect falha)', async () => {
    ;(req.json as jest.Mock).mockResolvedValue(mockMachineId)

    const errorMessage = 'Falha na conexão com o banco'
    ;(dbConnect as jest.Mock).mockRejectedValueOnce(new Error(errorMessage))

    const response = await POST(req)
    const json = await response.json()

    expect(dbConnect).toHaveBeenCalledTimes(1)
    expect(req.json).toHaveBeenCalledTimes(1)
    expect(z.string().safeParse).toHaveBeenCalledWith(mockMachineId)
    expect(sensorRepository.getMachineSensors).not.toHaveBeenCalled()

    expect(response.status).toBe(500)
    expect(json).toEqual({
      success: false,
      message: errorMessage,
    })
  })

  it('deve retornar 500 com mensagem genérica quando o erro não for uma instância de Error', async () => {
    ;(req.json as jest.Mock).mockResolvedValue(mockMachineId)

    ;(dbConnect as jest.Mock).mockRejectedValueOnce(
      'Erro desconhecido (string)',
    )

    const response = await POST(req)
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json).toEqual({
      success: false,
      message: 'Erro interno do servidor',
    })
  })

  it('deve lidar com corpo vazio (undefined) e retornar 400', async () => {
    ;(req.json as jest.Mock).mockResolvedValue(undefined)

    ;(z.string().safeParse as jest.Mock).mockReturnValueOnce({
      success: false,
      error: { message: 'Expected string, received undefined' },
    })

    const response = await POST(req)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.message).toContain('ID da máquina deve ser uma string')
  })
})
