

jest.mock('@/lib/database/mongoose', () => ({
  default: jest.fn(() => Promise.resolve()),
}))

jest.mock('@/lib/database/monitoring_point/repository')

jest.spyOn(console, 'log').mockImplementation(() => {})

import { GET } from './route'
import dbConnect from '@/lib/database/mongoose'
import monitoringPointRepository from '@/lib/database/monitoring_point/repository'

const mockAnalysisData = [
  {
    _id: 'point1',
    name: 'Point A',
    machine: { _id: 'machine1', name: 'Machine 1' },
  },
  {
    _id: 'point2',
    name: 'Point B',
    machine: { _id: 'machine2', name: 'Machine 2' },
  },
]
const mockSuccessMessage = 'Pontos de monitoramento encontrados'
const mockErrorMessage = 'Erro ao buscar pontos'

beforeEach(() => {
  jest.clearAllMocks()

  ;(dbConnect as jest.Mock).mockResolvedValue(undefined)

  ;(monitoringPointRepository.getAllPopulate as jest.Mock).mockResolvedValue({
    success: true,
    data: mockAnalysisData,
    message: mockSuccessMessage,
  })
})

describe('GET /api/monitoring-point', () => {
  it('deve retornar 200 e os dados quando a busca for bem-sucedida', async () => {
    const response = await GET()
    const json = await response.json()

    expect(dbConnect).toHaveBeenCalledTimes(1)
    expect(monitoringPointRepository.getAllPopulate).toHaveBeenCalledTimes(1)

    expect(response.status).toBe(200)
    expect(json).toEqual({
      success: true,
      message: mockSuccessMessage,
      data: mockAnalysisData,
    })
  })

  it('deve retornar 400 quando o repositório falhar', async () => {
    ;(
      monitoringPointRepository.getAllPopulate as jest.Mock
    ).mockResolvedValueOnce({
      success: false,
      data: null,
      message: mockErrorMessage,
    })

    const response = await GET()
    const json = await response.json()

    expect(dbConnect).toHaveBeenCalledTimes(1)
    expect(monitoringPointRepository.getAllPopulate).toHaveBeenCalledTimes(1)

    expect(response.status).toBe(400)
    expect(json).toEqual({
      success: false,
      message: mockErrorMessage,
      data: null,
    })
  })

  it('deve retornar 500 quando a conexão com o banco falhar', async () => {
    const dbError = new Error('Falha na conexão')
    ;(dbConnect as jest.Mock).mockRejectedValueOnce(dbError)

    const response = await GET()
    const json = await response.json()

    expect(dbConnect).toHaveBeenCalledTimes(1)
    expect(monitoringPointRepository.getAllPopulate).not.toHaveBeenCalled()
    expect(response.status).toBe(500)
    expect(json).toEqual({
      success: false,
      message: 'Falha na conexão',
      data: null,
    })
  })
})
