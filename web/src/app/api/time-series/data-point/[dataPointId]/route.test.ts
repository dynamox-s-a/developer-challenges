import { DELETE } from './route'
import type { NextRequest } from 'next/server'
import dbConnect from '@/lib/database/mongoose'
import timeSeriesRepository from '@/lib/database/timeSeries/repository'

// Mocks das dependências
jest.mock('@/lib/database/mongoose', () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve()),
}))

jest.mock('@/lib/database/timeSeries/repository', () => ({
  __esModule: true,
  default: {
    delete: jest.fn(),
  },
}))

const mockDataPointId = '507f1f77bcf86cd799439011'

let params: Promise<{ dataPointId: string }>
let req: NextRequest

beforeEach(() => {
  jest.clearAllMocks()

  // Mock bem‑sucedido do dbConnect
  ;(dbConnect as jest.Mock).mockResolvedValue(undefined)

  // Mock bem‑sucedido do repositório (sucesso por padrão)
  ;(timeSeriesRepository.delete as jest.Mock).mockResolvedValue(true)

  // Params mockado
  params = Promise.resolve({ dataPointId: mockDataPointId })

  // Request não é usado, mas precisa ser passado
  req = {} as NextRequest
})

describe('DELETE /api/time-series/[dataPointId]', () => {
  it('deve retornar 200 e mensagem de sucesso quando a deleção for bem‑sucedida', async () => {
    const response = await DELETE(req, { params })
    const json = await response.json()

    expect(dbConnect).toHaveBeenCalledTimes(1)
    expect(timeSeriesRepository.delete).toHaveBeenCalledWith(mockDataPointId)

    expect(response.status).toBe(200)
    expect(json).toEqual({
      success: true,
      message: 'Ponto deletado com sucesso',
    })
  })

  it('deve retornar 404 e mensagem de não encontrado quando o repositório retornar false', async () => {
    ;(timeSeriesRepository.delete as jest.Mock).mockResolvedValueOnce(false)

    const response = await DELETE(req, { params })
    const json = await response.json()

    expect(dbConnect).toHaveBeenCalledTimes(1)
    expect(timeSeriesRepository.delete).toHaveBeenCalledWith(mockDataPointId)

    expect(response.status).toBe(404)
    expect(json).toEqual({
      success: false,
      message: 'Ponto não encontrado',
    })
  })

  it('deve retornar 500 quando dbConnect falhar', async () => {
    const errorMessage = 'Falha na conexão com o banco'
    ;(dbConnect as jest.Mock).mockRejectedValueOnce(new Error(errorMessage))

    const response = await DELETE(req, { params })
    const json = await response.json()

    expect(dbConnect).toHaveBeenCalledTimes(1)
    expect(timeSeriesRepository.delete).not.toHaveBeenCalled()

    expect(response.status).toBe(500)
    expect(json).toEqual({
      success: false,
      message: errorMessage,
    })
  })

  it('deve retornar 500 quando o repositório lançar uma exceção', async () => {
    const errorMessage = 'Erro ao deletar ponto'
    ;(timeSeriesRepository.delete as jest.Mock).mockRejectedValueOnce(
      new Error(errorMessage),
    )

    const response = await DELETE(req, { params })
    const json = await response.json()

    expect(dbConnect).toHaveBeenCalledTimes(1)
    expect(timeSeriesRepository.delete).toHaveBeenCalledWith(mockDataPointId)

    expect(response.status).toBe(500)
    expect(json).toEqual({
      success: false,
      message: errorMessage,
    })
  })

  it('deve retornar 500 com mensagem genérica quando o erro não for uma instância de Error', async () => {
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
