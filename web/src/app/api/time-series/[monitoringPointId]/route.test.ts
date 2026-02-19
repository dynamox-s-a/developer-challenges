

jest.mock('@/lib/database/mongoose', () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve()),
}))

jest.mock('@/lib/database/timeSeries/repository', () => ({
  __esModule: true,
  default: {
    getByMonitoringPoint: jest.fn(),
    deleteAllByMonitoringPoint: jest.fn(),
  },
}))

import { GET, DELETE } from './route'
import type { NextRequest } from 'next/server'
import dbConnect from '@/lib/database/mongoose'
import timeSeriesRepository from '@/lib/database/timeSeries/repository'

const mockMonitoringPointId = '507f1f77bcf86cd799439011'
const mockTimeSeriesData = [
  { _id: '1', value: 10.5, timestamp: '2024-01-01T00:00:00Z' },
  { _id: '2', value: 20.3, timestamp: '2024-01-01T01:00:00Z' },
]

let params: Promise<{ monitoringPointId: string }>

beforeEach(() => {
  jest.clearAllMocks()
  ;(dbConnect as jest.Mock).mockResolvedValue(undefined)
  ;(timeSeriesRepository.getByMonitoringPoint as jest.Mock).mockResolvedValue(
    mockTimeSeriesData,
  )
  ;(
    timeSeriesRepository.deleteAllByMonitoringPoint as jest.Mock
  ).mockResolvedValue(undefined)
  params = Promise.resolve({ monitoringPointId: mockMonitoringPointId })
})

describe('GET /api/time-series/[monitoringPointId]', () => {
  it('deve retornar 200 e os dados quando a busca for bem-sucedida (page/pageSize padrão)', async () => {
    const req = { url: 'http://localhost/api/time-series/123' } as NextRequest
    const response = await GET(req, { params })
    const json = await response.json()

    expect(dbConnect).toHaveBeenCalledTimes(1)
    expect(timeSeriesRepository.getByMonitoringPoint).toHaveBeenCalledWith(
      mockMonitoringPointId,
      0,
      50,
    )
    expect(response.status).toBe(200)
    expect(json).toEqual({
      success: true,
      message: 'Dados recuperados com sucesso',
      data: mockTimeSeriesData,
    })
  })

  it('deve usar os parâmetros de consulta page e pageSize quando fornecidos', async () => {
    const req = {
      url: 'http://localhost/api/time-series/123?page=2&pageSize=25',
    } as NextRequest
    const response = await GET(req, { params })
    await response.json()

    expect(timeSeriesRepository.getByMonitoringPoint).toHaveBeenCalledWith(
      mockMonitoringPointId,
      2,
      25,
    )
  })

  it('deve usar os valores padrão (0 e 50) quando page/pageSize não forem números válidos', async () => {
    const req = {
      url: 'http://localhost/api/time-series/123?page=abc&pageSize=xyz',
    } as NextRequest
    const response = await GET(req, { params })
    await response.json()

    expect(timeSeriesRepository.getByMonitoringPoint).toHaveBeenCalledWith(
      mockMonitoringPointId,
      0,
      50,
    )
  })

  it('deve retornar 500 quando dbConnect falhar', async () => {
    const req = { url: 'http://localhost/api/time-series/123' } as NextRequest
    const errorMessage = 'Erro de conexão com o banco'
    ;(dbConnect as jest.Mock).mockRejectedValueOnce(new Error(errorMessage))

    const response = await GET(req, { params })
    const json = await response.json()

    expect(dbConnect).toHaveBeenCalledTimes(1)
    expect(timeSeriesRepository.getByMonitoringPoint).not.toHaveBeenCalled()
    expect(response.status).toBe(500)
    expect(json).toEqual({
      success: false,
      message: errorMessage,
    })
  })

  it('deve retornar 500 quando o repositório lançar uma exceção', async () => {
    const req = { url: 'http://localhost/api/time-series/123' } as NextRequest
    const errorMessage = 'Falha ao buscar séries temporais'
    ;(
      timeSeriesRepository.getByMonitoringPoint as jest.Mock
    ).mockRejectedValueOnce(new Error(errorMessage))

    const response = await GET(req, { params })
    const json = await response.json()

    expect(timeSeriesRepository.getByMonitoringPoint).toHaveBeenCalled()
    expect(response.status).toBe(500)
    expect(json).toEqual({
      success: false,
      message: errorMessage,
    })
  })

  it('deve retornar 500 com mensagem genérica quando o erro não for uma instância de Error', async () => {
    const req = { url: 'http://localhost/api/time-series/123' } as NextRequest
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

describe('DELETE /api/time-series/[monitoringPointId]', () => {
  it('deve retornar 200 e mensagem de sucesso quando a deleção for bem-sucedida', async () => {
    const req = {} as NextRequest
    const response = await DELETE(req, { params })
    const json = await response.json()

    expect(dbConnect).toHaveBeenCalledTimes(1)
    expect(
      timeSeriesRepository.deleteAllByMonitoringPoint,
    ).toHaveBeenCalledWith(mockMonitoringPointId)
    expect(response.status).toBe(200)
    expect(json).toEqual({
      success: true,
      message: 'Todos os pontos foram deletados',
    })
  })

  it('deve retornar 500 quando dbConnect falhar', async () => {
    const req = {} as NextRequest
    const errorMessage = 'Falha na conexão com o banco'
    ;(dbConnect as jest.Mock).mockRejectedValueOnce(new Error(errorMessage))

    const response = await DELETE(req, { params })
    const json = await response.json()

    expect(dbConnect).toHaveBeenCalledTimes(1)
    expect(
      timeSeriesRepository.deleteAllByMonitoringPoint,
    ).not.toHaveBeenCalled()
    expect(response.status).toBe(500)
    expect(json).toEqual({
      success: false,
      message: errorMessage,
    })
  })

  it('deve retornar 500 quando o repositório lançar uma exceção', async () => {
    const req = {} as NextRequest
    const errorMessage = 'Erro ao deletar pontos'
    ;(
      timeSeriesRepository.deleteAllByMonitoringPoint as jest.Mock
    ).mockRejectedValueOnce(new Error(errorMessage))

    const response = await DELETE(req, { params })
    const json = await response.json()

    expect(
      timeSeriesRepository.deleteAllByMonitoringPoint,
    ).toHaveBeenCalledWith(mockMonitoringPointId)
    expect(response.status).toBe(500)
    expect(json).toEqual({
      success: false,
      message: errorMessage,
    })
  })

  it('deve retornar 500 com mensagem genérica quando o erro não for uma instância de Error', async () => {
    const req = {} as NextRequest
    ;(dbConnect as jest.Mock).mockRejectedValueOnce('Erro desconhecido')

    const response = await DELETE(req, { params })
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json).toEqual({
      success: false,
      message: 'Erro interno',
    })
  })
})
