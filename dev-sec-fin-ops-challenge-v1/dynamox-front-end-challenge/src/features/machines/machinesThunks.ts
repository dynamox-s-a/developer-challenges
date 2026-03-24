import { createAsyncThunk } from '@reduxjs/toolkit'
import { v4 as uuid } from 'uuid'

import type { Machine, MachineType } from './types'
import type { RootState } from '../../app/store'
import { api } from '../../services/api'

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const loadMachines = createAsyncThunk<Machine[]>(
  'machines/load',
  async () => {
    await delay(200)
    return api.get<Machine[]>('/machines')
  }
)

export const createMachine = createAsyncThunk<
  Machine,
  { name: string; type: MachineType },
  { state: RootState }
>('machines/create', async ({ name, type }, { getState }) => {
  await delay(200)

  const trimmed = name.trim()
  if (!trimmed) throw new Error('Nome é obrigatório')

  const newMachine: Machine = { id: uuid(), name: trimmed, type }

  return api.post<Machine>('/machines', newMachine)
})

export const updateMachine = createAsyncThunk<
  Machine,
  { id: string; name: string; type: MachineType },
  { state: RootState }
>('machines/update', async ({ id, name, type }, { getState }) => {
  await delay(200)

  const trimmed = name.trim()
  if (!trimmed) throw new Error('Nome é obrigatório')

  const current = getState().machines.items
  const exists = current.some((m) => m.id === id)
  if (!exists) throw new Error('Máquina não encontrada')

  const updated: Machine = { id, name: trimmed, type }

  return api.put<Machine>(`/machines/${id}`, updated)
})

export const deleteMachine = createAsyncThunk<
  string,
  { id: string }
>('machines/delete', async ({ id }) => {
  await delay(150)

  await api.del(`/machines/${id}`)
  return id
})
