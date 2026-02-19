

// Mocks das dependências
jest.mock('@/lib/database/mongoose', () => ({
  __esModule: true,
  default: jest.fn(() => Promise.resolve()),
}))

jest.mock('@/lib/database/timeSeries/repository', () => ({
  __esModule: true,
  default: {
    create: jest.fn(),
  },
}))

jest.mock('@/types/zod/timeSeries', () => ({
  CreateTimeSeriesPointSchema: {
    safeParse: jest.fn(),
  },
  CreateTimeSeriesBatchSchema: {
    safeParse: jest.fn(),
  },
}))

import { POST } from './route'
import type { NextRequest } from 'next/server'
import dbConnect from '@/lib/database/mongoose'
import timeSeriesRepository from '@/lib/database/timeSeries/repository'
import {
  CreateTimeSeriesPointSchema,
  CreateTimeSeriesBatchSchema,
} from '@/types/zod/timeSeries'

// Dados mockados
const mockSinglePoint = {
  monitoringPointId: '507f1f77bcf86cd799439011',
  value: 25.5,
  timestamp: '2025-01-01T12:00:00Z',
}

const mockBatch = [
  {
    monitoringPointId: '507f1f77bcf86cd799439011',
    value: 25.5,
    timestamp: '2025-01-01T12:00:00Z',
  },
  {
    monitoringPointId: '507f1f77bcf86cd799439011',
    value: 26.1,
    timestamp: '2025-01-01T12:05:00Z',
  },
]

const mockCreatedResult = {
  _id: '507f1f77bcf86cd799439012',
  ...mockSinglePoint,
}

let req: NextRequest

beforeEach(() => {
  jest.clearAllMocks()

  // Mock bem‑sucedido do dbConnect
  ;(dbConnect as jest.Mock).mockResolvedValue(undefined)

  // Mock bem‑sucedido do repositório
  ;(timeSeriesRepository.create as jest.Mock).mockResolvedValue(
    mockCreatedResult,
  )

  // Mock padrão para os schemas (sucesso)
  ;(CreateTimeSeriesPointSchema.safeParse as jest.Mock).mockImplementation(
    val => ({
      success: true,
      data: val,
    }),
  )
  ;(CreateTimeSeriesBatchSchema.safeParse as jest.Mock).mockImplementation(
    val => ({
      success: true,
      data: val,
    }),
  )

  req = {
    json: jest.fn(),
  } as unknown as NextRequest
})

describe('POST /api/time-series', () => {
  describe('criação de um único ponto', () => {
    it('deve retornar 201 e os dados quando a criação for bem‑sucedida', async () => {
      ;(req.json as jest.Mock).mockResolvedValue(mockSinglePoint)

      const response = await POST(req)
      const json = await response.json()

      expect(dbConnect).toHaveBeenCalledTimes(1)
      expect(req.json).toHaveBeenCalledTimes(1)
      expect(CreateTimeSeriesPointSchema.safeParse).toHaveBeenCalledWith(
        mockSinglePoint,
      )
      expect(CreateTimeSeriesBatchSchema.safeParse).not.toHaveBeenCalled()
      expect(timeSeriesRepository.create).toHaveBeenCalledWith(mockSinglePoint)

      expect(response.status).toBe(201)
      expect(json).toEqual({
        success: true,
        message: 'Ponto de série temporal criado com sucesso',
        data: mockCreatedResult,
      })
    })

    it('deve retornar 400 quando a validação do ponto falhar', async () => {
      const invalidPoint = { value: 25.5 } // sem monitoringPointId
      ;(req.json as jest.Mock).mockResolvedValue(invalidPoint)
      ;(CreateTimeSeriesPointSchema.safeParse as jest.Mock).mockReturnValueOnce(
        {
          success: false,
          error: {
            issues: [{ path: ['monitoringPointId'], message: 'Required' }],
          },
        },
      )

      const response = await POST(req)
      const json = await response.json()

      expect(dbConnect).toHaveBeenCalledTimes(1)
      expect(req.json).toHaveBeenCalledTimes(1)
      expect(CreateTimeSeriesPointSchema.safeParse).toHaveBeenCalledWith(
        invalidPoint,
      )
      expect(timeSeriesRepository.create).not.toHaveBeenCalled()

      expect(response.status).toBe(400)
      expect(json).toEqual({
        success: false,
        message: [{ path: ['monitoringPointId'], message: 'Required' }],
      })
    })
  })

  describe('criação em lote (array)', () => {
    it('deve retornar 201 e os dados quando a criação do lote for bem‑sucedida', async () => {
      ;(req.json as jest.Mock).mockResolvedValue(mockBatch)

      const response = await POST(req)
      const json = await response.json()

      expect(dbConnect).toHaveBeenCalledTimes(1)
      expect(req.json).toHaveBeenCalledTimes(1)
      expect(CreateTimeSeriesBatchSchema.safeParse).toHaveBeenCalledWith(
        mockBatch,
      )
      expect(CreateTimeSeriesPointSchema.safeParse).not.toHaveBeenCalled()
      expect(timeSeriesRepository.create).toHaveBeenCalledWith(mockBatch)

      expect(response.status).toBe(201)
      expect(json).toEqual({
        success: true,
        message: 'Dados de série temporal criados com sucesso',
        data: mockCreatedResult,
      })
    })

    it('deve retornar 400 quando a validação do lote falhar', async () => {
      const invalidBatch = [{ value: 25.5 }] // sem monitoringPointId
      ;(req.json as jest.Mock).mockResolvedValue(invalidBatch)
      ;(CreateTimeSeriesBatchSchema.safeParse as jest.Mock).mockReturnValueOnce(
        {
          success: false,
          error: {
            issues: [
              {
                path: [0, 'monitoringPointId'],
                message: 'Required',
              },
            ],
          },
        },
      )

      const response = await POST(req)
      const json = await response.json()

      expect(dbConnect).toHaveBeenCalledTimes(1)
      expect(req.json).toHaveBeenCalledTimes(1)
      expect(CreateTimeSeriesBatchSchema.safeParse).toHaveBeenCalledWith(
        invalidBatch,
      )
      expect(timeSeriesRepository.create).not.toHaveBeenCalled()

      expect(response.status).toBe(400)
      expect(json).toEqual({
        success: false,
        message: [{ path: [0, 'monitoringPointId'], message: 'Required' }],
      })
    })
  })

  describe('casos de erro comuns', () => {
    it('deve retornar 500 quando o dbConnect falhar', async () => {
      ;(req.json as jest.Mock).mockResolvedValue(mockSinglePoint)
      const errorMessage = 'Falha na conexão com o banco'
      ;(dbConnect as jest.Mock).mockRejectedValueOnce(new Error(errorMessage))

      const response = await POST(req)
      const json = await response.json()

      expect(dbConnect).toHaveBeenCalledTimes(1)
      expect(req.json).toHaveBeenCalledTimes(1)
      expect(timeSeriesRepository.create).not.toHaveBeenCalled()

      expect(response.status).toBe(500)
      expect(json).toEqual({
        success: false,
        message: errorMessage,
      })
    })

    it('deve retornar 500 quando o repositório lançar uma exceção', async () => {
      ;(req.json as jest.Mock).mockResolvedValue(mockSinglePoint)
      const errorMessage = 'Erro ao inserir no banco'
      ;(timeSeriesRepository.create as jest.Mock).mockRejectedValueOnce(
        new Error(errorMessage),
      )

      const response = await POST(req)
      const json = await response.json()

      expect(dbConnect).toHaveBeenCalledTimes(1)
      expect(req.json).toHaveBeenCalledTimes(1)
      expect(CreateTimeSeriesPointSchema.safeParse).toHaveBeenCalled()
      expect(timeSeriesRepository.create).toHaveBeenCalled()

      expect(response.status).toBe(500)
      expect(json).toEqual({
        success: false,
        message: errorMessage,
      })
    })

    it('deve retornar 500 com mensagem genérica quando o erro não for uma instância de Error', async () => {
      ;(req.json as jest.Mock).mockResolvedValue(mockSinglePoint)
      ;(dbConnect as jest.Mock).mockRejectedValueOnce('Erro desconhecido')

      const response = await POST(req)
      const json = await response.json()

      expect(response.status).toBe(500)
      expect(json).toEqual({
        success: false,
        message: 'Erro interno',
      })
    })
  })
})
