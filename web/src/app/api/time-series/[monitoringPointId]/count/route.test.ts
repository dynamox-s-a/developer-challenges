

jest.mock('@/lib/database/mongoose', () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve()),
}))

jest.mock('@/lib/database/timeSeries/repository', () => ({
  __esModule: true,
  default: {
    getCount: jest.fn(),
  },
}))

import { GET } from './route'
import type { NextRequest } from 'next/server'
import dbConnect from '@/lib/database/mongoose'
import timeSeriesRepository from '@/lib/database/timeSeries/repository'

const mockMonitoringPointId = '507f1f77bcf86cd799439011'
const mockCount = 42

let params: Promise<{ monitoringPointId: string }>
let req: NextRequest

beforeEach(() => {
  jest.clearAllMocks()

  ;(dbConnect as jest.Mock).mockResolvedValue(undefined)

  ;(timeSeriesRepository.getCount as jest.Mock).mockResolvedValue(mockCount)
  params = Promise.resolve({ monitoringPointId: mockMonitoringPointId })
  req = {} as NextRequest
})

describe('GET /api/time-series/[monitoringPointId]/count', () => {
  it('deve retornar 200 e a contagem quando a operação for bem‑sucedida', async () => {
    const response = await GET(req, { params })
    const json = await response.json()

    expect(dbConnect).toHaveBeenCalledTimes(1)
    expect(timeSeriesRepository.getCount).toHaveBeenCalledWith(
      mockMonitoringPointId,
    )

    expect(response.status).toBe(200)
    expect(json).toEqual({
      success: true,
      message: 'Contagem obtida com sucesso',
      data: { count: mockCount },
    })
  })

  it('deve retornar 500 quando o dbConnect lançar um erro', async () => {
    const errorMessage = 'Falha na conexão com o banco'
    ;(dbConnect as jest.Mock).mockRejectedValueOnce(new Error(errorMessage))

    const response = await GET(req, { params })
    const json = await response.json()

    expect(dbConnect).toHaveBeenCalledTimes(1)
    expect(timeSeriesRepository.getCount).not.toHaveBeenCalled()

    expect(response.status).toBe(500)
    expect(json).toEqual({
      success: false,
      message: errorMessage,
    })
  })

  it('deve retornar 500 quando o repositório lançar um erro', async () => {
    const errorMessage = 'Erro ao consultar contagem'
    ;(timeSeriesRepository.getCount as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage),
    )

    const response = await GET(req, { params })
    const json = await response.json()

    expect(dbConnect).toHaveBeenCalledTimes(1)
    expect(timeSeriesRepository.getCount).toHaveBeenCalledWith(
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
