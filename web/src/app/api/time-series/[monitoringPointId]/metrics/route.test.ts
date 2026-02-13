import { GET } from './route'
import type { NextRequest } from 'next/server'
import dbConnect from '@/lib/database/mongoose'
import timeSeriesRepository from '@/lib/database/timeSeries/repository'

jest.mock('@/lib/database/mongoose', () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve()),
}))

jest.mock('@/lib/database/timeSeries/repository', () => ({
  __esModule: true,
  default: {
    getMetrics: jest.fn(),
  },
}))

const mockMonitoringPointId = '507f1f77bcf86cd799439011'
const mockMetrics = {
  avg: 25.4,
  min: 18.2,
  max: 32.1,
  count: 150,
}

let params: Promise<{ monitoringPointId: string }>
let req: NextRequest

beforeEach(() => {
  jest.clearAllMocks()

  // Mock bem‑sucedido do dbConnect
  ;(dbConnect as jest.Mock).mockResolvedValue(undefined)

  // Mock bem‑sucedido do repositório
  ;(timeSeriesRepository.getMetrics as jest.Mock).mockResolvedValue(mockMetrics)

  // Params mockado
  params = Promise.resolve({ monitoringPointId: mockMonitoringPointId })

  // Request não é usado, mas precisa ser passado
  req = {} as NextRequest
})

describe('GET /api/time-series/[monitoringPointId]/metrics', () => {
  it('deve retornar 200 e as métricas quando a operação for bem‑sucedida', async () => {
    const response = await GET(req, { params })
    const json = await response.json()

    expect(dbConnect).toHaveBeenCalledTimes(1)
    expect(timeSeriesRepository.getMetrics).toHaveBeenCalledWith(
      mockMonitoringPointId,
    )

    expect(response.status).toBe(200)
    expect(json).toEqual({
      success: true,
      message: 'Métricas calculadas com sucesso',
      data: mockMetrics,
    })
  })

  it('deve retornar 500 quando o dbConnect lançar um erro', async () => {
    const errorMessage = 'Falha na conexão com o banco'
    ;(dbConnect as jest.Mock).mockRejectedValueOnce(new Error(errorMessage))

    const response = await GET(req, { params })
    const json = await response.json()

    expect(dbConnect).toHaveBeenCalledTimes(1)
    expect(timeSeriesRepository.getMetrics).not.toHaveBeenCalled()

    expect(response.status).toBe(500)
    expect(json).toEqual({
      success: false,
      message: errorMessage,
    })
  })

  it('deve retornar 500 quando o repositório lançar um erro', async () => {
    const errorMessage = 'Erro ao calcular métricas'
    ;(timeSeriesRepository.getMetrics as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage),
    )

    const response = await GET(req, { params })
    const json = await response.json()

    expect(dbConnect).toHaveBeenCalledTimes(1)
    expect(timeSeriesRepository.getMetrics).toHaveBeenCalledWith(
      mockMonitoringPointId,
    )

    expect(response.status).toBe(500)
    expect(json).toEqual({
      success: false,
      message: errorMessage,
    })
  })

  it('deve retornar 500 com mensagem genérica quando o erro não for uma instância de Error', async () => {
    ;(dbConnect as jest.Mock).mockRejectedValueOnce('Erro desconhecido')

    const response = await GET(req, { params })
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json).toEqual({
      success: false,
      message: 'Erro interno',
    })
  })
})
