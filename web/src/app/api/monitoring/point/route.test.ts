/** biome-ignore-all lint/complexity/useOptionalChain: kek*/


jest.mock('@/lib/database/monitoring_point/repository')
jest.mock('@/types/zod/monitoring-point', () => ({
  CreateMonitoringPointSchema: {
    safeParse: jest.fn(),
  },
}))

import { POST } from './route'
import type { NextRequest } from 'next/server'
import monitoringPointRepository from '@/lib/database/monitoring_point/repository'
import { CreateMonitoringPointSchema } from '@/types/zod/monitoring-point'

const mockValidBody = {
  name: 'Ponto A',
  machineId: '507f1f77bcf86cd799439011',
  sensorId: '507f1f77bcf86cd799439012',
}
const mockParsedData = { ...mockValidBody }

let req: NextRequest

beforeEach(() => {
  jest.clearAllMocks()

  ;(monitoringPointRepository.create as jest.Mock).mockResolvedValue({
    success: true,
  })

  ;(CreateMonitoringPointSchema.safeParse as jest.Mock).mockImplementation(
    val => {
      if (val && val.name && val.machineId && val.sensorId) {
        return { success: true, data: val }
      }
      return {
        success: false,
        error: { message: 'Dados inválidos' },
      }
    },
  )

  req = {
    json: jest.fn(),
  } as unknown as NextRequest
})

describe('POST /api/monitoring-point', () => {
  it('should return 200 and success message when creation succeeds', async () => {
    ;(req.json as jest.Mock).mockResolvedValue(mockValidBody)

    const response = await POST(req)
    const json = await response.json()

    expect(req.json).toHaveBeenCalledTimes(1)
    expect(CreateMonitoringPointSchema.safeParse).toHaveBeenCalledWith(
      mockValidBody,
    )
    expect(monitoringPointRepository.create).toHaveBeenCalledWith(
      mockParsedData,
    )

    expect(response.status).toBe(200)
    expect(json).toEqual({
      success: true,
      message: 'Ponto de monitoramento criado com sucesso',
    })
  })

  it('should return 400 when validation fails', async () => {
    const invalidBody = { name: 'Ponto A' }
    ;(req.json as jest.Mock).mockResolvedValue(invalidBody)
    ;(CreateMonitoringPointSchema.safeParse as jest.Mock).mockReturnValueOnce({
      success: false,
      error: { message: 'Campos obrigatórios faltando' },
    })

    const response = await POST(req)
    const json = await response.json()

    expect(req.json).toHaveBeenCalledTimes(1)
    expect(CreateMonitoringPointSchema.safeParse).toHaveBeenCalledWith(
      invalidBody,
    )
    expect(monitoringPointRepository.create).not.toHaveBeenCalled()

    expect(response.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.message).toBe(
      'Erro no parseamento dos dados Campos obrigatórios faltando',
    )
  })

  it('should return 400 when repository creation fails', async () => {
    ;(req.json as jest.Mock).mockResolvedValue(mockValidBody)
    ;(monitoringPointRepository.create as jest.Mock).mockResolvedValueOnce({
      success: false,
      message: 'Erro ao salvar no banco',
    })

    const response = await POST(req)
    const json = await response.json()

    expect(req.json).toHaveBeenCalledTimes(1)
    expect(CreateMonitoringPointSchema.safeParse).toHaveBeenCalledWith(
      mockValidBody,
    )
    expect(monitoringPointRepository.create).toHaveBeenCalledWith(
      mockParsedData,
    )

    expect(response.status).toBe(400)
    expect(json).toEqual({
      success: false,
      message:
        'Erro na criação do ponto de monitoramentoErro ao salvar no banco',
    })
  })

  it('should throw when repository.create throws an error', async () => {
    ;(req.json as jest.Mock).mockResolvedValue(mockValidBody)
    const dbError = new Error('Database error')
    ;(monitoringPointRepository.create as jest.Mock).mockRejectedValueOnce(
      dbError,
    )

    await expect(POST(req)).rejects.toThrow('Database error')
    expect(monitoringPointRepository.create).toHaveBeenCalledWith(
      mockParsedData,
    )
  })
})
