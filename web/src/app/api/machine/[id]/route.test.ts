/** biome-ignore-all lint/style/useTemplate: idk */


jest.mock('@/lib/database/mongoose', () => ({
  default: jest.fn(() => Promise.resolve()),
}))
jest.mock('@/lib/database/machine/repository')
jest.mock('@/types/zod/machine', () => ({
  UpdateMachineSchema: {
    safeParse: jest.fn(),
  },
}))

import { PUT } from './route'
import type { NextRequest } from 'next/server'
import dbConnect from '@/lib/database/mongoose'
import machineRepository from '@/lib/database/machine/repository'
import { UpdateMachineSchema } from '@/types/zod/machine'

const mockId = '507f1f77bcf86cd799439011'
const mockValidBody = { name: 'Updated Machine', status: 'active' }
const mockParsedData = { name: 'Updated Machine', status: 'active' }

let req: NextRequest
let params: Promise<{ id: string }>

beforeEach(() => {
  jest.clearAllMocks()

  ;(dbConnect as jest.Mock).mockResolvedValue(undefined)
  ;(machineRepository.update as jest.Mock).mockResolvedValue({
    success: true,
    data: mockParsedData,
  })

  req = {
    json: jest.fn().mockResolvedValue(mockValidBody),
  } as unknown as NextRequest

  params = Promise.resolve({ id: mockId })
})

it('should return 200 and success message when update is successful', async () => {
  ;(UpdateMachineSchema.safeParse as jest.Mock).mockReturnValue({
    success: true,
    data: mockParsedData,
  })

  const response = await PUT(req, { params })
  const json = await response.json()

  expect(dbConnect).toHaveBeenCalledTimes(1)
  expect(req.json).toHaveBeenCalledTimes(1)
  expect(UpdateMachineSchema.safeParse).toHaveBeenCalledWith(mockValidBody)
  expect(machineRepository.update).toHaveBeenCalledWith(mockId, mockParsedData)

  expect(response.status).toBe(200)
  expect(json).toEqual({
    success: true,
    message: 'Maquina atualizada com sucesso',
  })
})

it('should return 400 if validation fails', async () => {
  const mockError = new Error('Invalid data')
  ;(UpdateMachineSchema.safeParse as jest.Mock).mockReturnValue({
    success: false,
    error: { message: mockError.message },
  })

  const response = await PUT(req, { params })
  const json = await response.json()

  expect(dbConnect).toHaveBeenCalledTimes(1)
  expect(req.json).toHaveBeenCalledTimes(1)
  expect(UpdateMachineSchema.safeParse).toHaveBeenCalledWith(mockValidBody)
  expect(machineRepository.update).not.toHaveBeenCalled()

  expect(response.status).toBe(400)
  expect(json).toEqual({
    success: false,
    message: 'Erro ao parsear a requisição: ' + mockError.message,
  })
})

it('should return 400 if repository update fails', async () => {
  ;(UpdateMachineSchema.safeParse as jest.Mock).mockReturnValue({
    success: true,
    data: mockParsedData,
  })

  ;(machineRepository.update as jest.Mock).mockResolvedValue({
    success: false,
  })

  const response = await PUT(req, { params })
  const json = await response.json()

  expect(dbConnect).toHaveBeenCalledTimes(1)
  expect(req.json).toHaveBeenCalledTimes(1)
  expect(UpdateMachineSchema.safeParse).toHaveBeenCalledWith(mockValidBody)
  expect(machineRepository.update).toHaveBeenCalledWith(mockId, mockParsedData)

  expect(response.status).toBe(400)
  expect(json).toEqual({
    success: false,
    message: 'Erro ao atualizar maquina ',
  })
})

it('should handle empty request body gracefully', async () => {
  req.json = jest.fn().mockResolvedValue({})
  ;(UpdateMachineSchema.safeParse as jest.Mock).mockReturnValue({
    success: false,
    error: { message: 'Body is required' },
  })

  const response = await PUT(req, { params })
  const json = await response.json()

  expect(response.status).toBe(400)
  expect(json.success).toBe(false)
  expect(json.message).toContain('Erro ao parsear a requisição')
})
