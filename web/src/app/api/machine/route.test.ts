/** biome-ignore-all lint/style/useTemplate: idk */


jest.mock('@/lib/database/mongoose', () => ({
  default: jest.fn(() => Promise.resolve()),
}))

jest.mock('@/lib/database/machine/repository')

jest.mock('@/types/zod/machine', () => ({
  CreateMachineSchema: {
    safeParse: jest.fn(),
  },
}))

jest.mock('zod', () => ({
  string: jest.fn(() => ({
    safeParse: jest.fn(),
  })),
}))

import { POST, GET, DELETE } from './route'
import type { NextRequest } from 'next/server'
import dbConnect from '@/lib/database/mongoose'
import machineRepository from '@/lib/database/machine/repository'
import { CreateMachineSchema } from '@/types/zod/machine'
import z from 'zod'

const mockMachineId = '507f1f77bcf86cd799439011'
const mockMachineData = {
  name: 'New Machine',
  status: 'active',
  location: 'Factory A',
}
const mockCreatedMachine = {
  _id: mockMachineId,
  ...mockMachineData,
}
const mockMachinesList = [
  { _id: '1', name: 'Machine 1' },
  { _id: '2', name: 'Machine 2' },
]

let req: NextRequest

beforeEach(() => {
  jest.clearAllMocks()

  ;(dbConnect as jest.Mock).mockResolvedValue(undefined)

  ;(machineRepository.create as jest.Mock).mockResolvedValue({
    success: true,
    data: mockCreatedMachine,
  })
  ;(machineRepository.getAllMachines as jest.Mock).mockResolvedValue({
    success: true,
    data: mockMachinesList,
    message: 'Máquinas encontradas',
  })
  ;(machineRepository.delete as jest.Mock).mockResolvedValue({
    success: true,
    message: 'Máquina deletada',
  })

  ;(CreateMachineSchema.safeParse as jest.Mock).mockImplementation(val => {
    if (val && typeof val === 'object' && val.name) {
      return { success: true, data: val }
    }
    return {
      success: false,
      error: { issues: ['Campo nome é obrigatório'] },
    }
  })

  ;(z.string().safeParse as jest.Mock).mockImplementation(val => {
    if (typeof val === 'string') {
      return { success: true, data: val }
    }
    return {
      success: false,
      error: { message: 'Expected string, received ' + typeof val },
    }
  })

  req = {
    json: jest.fn(),
  } as unknown as NextRequest
})

describe('POST /api/machine', () => {
  it('deve retornar 200 e os dados da máquina criada quando o cadastro for bem-sucedido', async () => {
    ;(req.json as jest.Mock).mockResolvedValue(mockMachineData)

    const response = await POST(req)
    const json = await response.json()

    expect(dbConnect).toHaveBeenCalledTimes(1)
    expect(req.json).toHaveBeenCalledTimes(1)
    expect(CreateMachineSchema.safeParse).toHaveBeenCalledWith(mockMachineData)
    expect(machineRepository.create).toHaveBeenCalledWith(mockMachineData)

    expect(response.status).toBe(200)
    expect(json).toEqual({
      success: true,
      message: 'Máquina cadastrada com sucesso',
      data: mockCreatedMachine,
    })
  })

  it('deve retornar 400 quando a validação do CreateMachineSchema falhar', async () => {
    const invalidData = { name: '' }
    ;(req.json as jest.Mock).mockResolvedValue(invalidData)
    ;(CreateMachineSchema.safeParse as jest.Mock).mockReturnValueOnce({
      success: false,
      error: { issues: ['name: String must contain at least 1 character'] },
    })

    const response = await POST(req)
    const json = await response.json()

    expect(dbConnect).toHaveBeenCalledTimes(1)
    expect(req.json).toHaveBeenCalledTimes(1)
    expect(CreateMachineSchema.safeParse).toHaveBeenCalledWith(invalidData)
    expect(machineRepository.create).not.toHaveBeenCalled()

    expect(response.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.message).toEqual([
      'name: String must contain at least 1 character',
    ])
  })

  it('deve retornar 400 quando o repositório falhar ao criar a máquina', async () => {
    ;(req.json as jest.Mock).mockResolvedValue(mockMachineData)
    ;(machineRepository.create as jest.Mock).mockResolvedValueOnce({
      success: false,
      message: 'Erro ao inserir no banco',
    })

    const response = await POST(req)
    const json = await response.json()

    expect(dbConnect).toHaveBeenCalledTimes(1)
    expect(req.json).toHaveBeenCalledTimes(1)
    expect(CreateMachineSchema.safeParse).toHaveBeenCalledWith(mockMachineData)
    expect(machineRepository.create).toHaveBeenCalledWith(mockMachineData)

    expect(response.status).toBe(400)
    expect(json).toEqual({
      success: false,
      message: 'Erro ao inserir no banco',
    })
  })

  it('deve retornar 500 quando ocorrer uma exceção inesperada (ex: dbConnect)', async () => {
    ;(req.json as jest.Mock).mockResolvedValue(mockMachineData)
    const errorMessage = 'Falha na conexão'
    ;(dbConnect as jest.Mock).mockRejectedValueOnce(new Error(errorMessage))

    const response = await POST(req)
    const json = await response.json()

    expect(dbConnect).toHaveBeenCalledTimes(1)
    expect(req.json).toHaveBeenCalledTimes(1)
    expect(CreateMachineSchema.safeParse).toHaveBeenCalledWith(mockMachineData)
    expect(machineRepository.create).not.toHaveBeenCalled()

    expect(response.status).toBe(500)
    expect(json).toEqual({
      success: false,
      message: errorMessage,
    })
  })

  it('deve retornar 500 com mensagem genérica quando o erro não for instância de Error', async () => {
    ;(req.json as jest.Mock).mockResolvedValue(mockMachineData)
    ;(dbConnect as jest.Mock).mockRejectedValueOnce('Erro sem stack')

    const response = await POST(req)
    const json = await response.json()

    expect(response.status).toBe(500)
    expect(json).toEqual({
      success: false,
      message: 'Erro interno do servidor',
    })
  })
})

describe('GET /api/machine', () => {
  it('deve retornar 200 e a lista de máquinas quando a busca for bem-sucedida', async () => {
    const response = await GET()
    const json = await response.json()

    expect(dbConnect).toHaveBeenCalledTimes(1)
    expect(machineRepository.getAllMachines).toHaveBeenCalledTimes(1)

    expect(response.status).toBe(200)
    expect(json).toEqual({
      success: true,
      message: 'Máquinas encontradas',
      data: mockMachinesList,
    })
  })

  it('deve retornar 400 quando o repositório falhar ao buscar as máquinas', async () => {
    ;(machineRepository.getAllMachines as jest.Mock).mockResolvedValueOnce({
      success: false,
      message: 'Erro ao consultar banco',
    })

    const response = await GET()
    const json = await response.json()

    expect(dbConnect).toHaveBeenCalledTimes(1)
    expect(machineRepository.getAllMachines).toHaveBeenCalledTimes(1)

    expect(response.status).toBe(400)
    expect(json).toEqual({
      success: false,
      message: 'Erro ao consultar banco',
    })
  })
})

describe('DELETE /api/machine', () => {
  it('deve retornar 200 e mensagem de sucesso quando a deleção for bem-sucedida', async () => {
    ;(req.json as jest.Mock).mockResolvedValue(mockMachineId)

    const response = await DELETE(req)
    const json = await response.json()

    expect(dbConnect).toHaveBeenCalledTimes(1)
    expect(req.json).toHaveBeenCalledTimes(1)
    expect(z.string().safeParse).toHaveBeenCalledWith(mockMachineId)
    expect(machineRepository.delete).toHaveBeenCalledWith(mockMachineId)

    expect(response.status).toBe(200)
    expect(json).toEqual({
      success: true,
      message: 'Maquina deletada com sucesso',
    })
  })

  it('deve retornar 400 quando o corpo não for uma string (validação falha)', async () => {
    const invalidBody = { id: 123 }
    ;(req.json as jest.Mock).mockResolvedValue(invalidBody)
    ;(z.string().safeParse as jest.Mock).mockReturnValueOnce({
      success: false,
      error: { message: 'Expected string, received object' },
    })

    const response = await DELETE(req)
    const json = await response.json()

    expect(dbConnect).toHaveBeenCalledTimes(1)
    expect(req.json).toHaveBeenCalledTimes(1)
    expect(z.string().safeParse).toHaveBeenCalledWith(invalidBody)
    expect(machineRepository.delete).not.toHaveBeenCalled()

    expect(response.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.message).toContain('Erro ao realizar o parsing dos dados')
  })

  it('deve retornar 400 quando o repositório falhar ao deletar', async () => {
    ;(req.json as jest.Mock).mockResolvedValue(mockMachineId)
    ;(machineRepository.delete as jest.Mock).mockResolvedValueOnce({
      success: false,
      message: 'Máquina não encontrada',
    })

    const response = await DELETE(req)
    const json = await response.json()

    expect(dbConnect).toHaveBeenCalledTimes(1)
    expect(req.json).toHaveBeenCalledTimes(1)
    expect(z.string().safeParse).toHaveBeenCalledWith(mockMachineId)
    expect(machineRepository.delete).toHaveBeenCalledWith(mockMachineId)

    expect(response.status).toBe(400)
    expect(json).toEqual({
      success: false,
      message: 'Erro ao deletar a machine: Máquina não encontrada',
    })
  })

  it('deve lidar com corpo vazio (undefined) e retornar 400', async () => {
    ;(req.json as jest.Mock).mockResolvedValue(undefined)
    ;(z.string().safeParse as jest.Mock).mockReturnValueOnce({
      success: false,
      error: { message: 'Expected string, received undefined' },
    })

    const response = await DELETE(req)
    const json = await response.json()

    expect(response.status).toBe(400)
    expect(json.success).toBe(false)
    expect(json.message).toContain('Erro ao realizar o parsing dos dados')
  })
})
