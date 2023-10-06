import 'whatwg-fetch'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import machinesSlice, {
  createMachine,
  deleteMachine,
  getMachineById,
  getMachines,
  resetError,
  updateMachine
} from './machinesSlice'
import store from 'redux/store'

const baseUrl = process.env.NEXT_PUBLIC_API_URL

const mockData = [
  {
    id: 'cllo1jq950000vev2qykl9o6j',
    name: 'machine 001',
    type: 'Fan'
  },
  {
    id: 'cllpkfnp90000vejobymmn6xh',
    name: 'machine 002',
    type: 'Pump'
  },
  {
    id: 'cllpllgr10001vejo6eq0ebqf',
    name: 'machine 003',
    type: 'Pump'
  },
  {
    id: 'cllpp14ml0000vewl7cygvrj1',
    name: 'machine 004',
    type: 'Fan'
  },
  {
    id: 'cllpp18700001vewljr6bphlc',
    name: 'machine 005',
    type: 'Fan'
  }
]

export const handlers = [
  rest.get(baseUrl + '/api/machine', (req, res, ctx) => {
    return res(ctx.json(mockData), ctx.delay(100))
  }),
  rest.post(baseUrl + '/api/machine', (req, res, ctx) => {
    return res(ctx.json({ id: 'newId', name: 'machine test', type: 'Pump' }), ctx.delay(100))
  }),
  rest.patch(baseUrl + '/api/machine/cllo1jq950000vev2qykl9o6j', (req, res, ctx) => {
    return res(ctx.json(mockData[0]))
  }),
  rest.delete(baseUrl + '/api/machine/id', (req, res, ctx) => {
    return res(ctx.json({}))
  })
]

const server = setupServer(...handlers)

// Enable API mocking before tests.
beforeAll(() => server.listen())

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers())

// Disable API mocking after the tests are done.
afterAll(() => server.close())

describe('machinesSlice', () => {
  test('should return the machine list', async () => {
    const response = await store.dispatch(getMachines())
    expect(response.payload).toEqual(mockData)
  })

  test('should return a error when the machine list fetch fails', async () => {
    server.use(
      rest.get(baseUrl + '/api/machine', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({
            message: 'error'
          })
        )
      })
    )
    const response = await store.dispatch(getMachines())
    expect(response.type).toBe('machines/getMachines/rejected')
  })

  test('should return a machine by id', async () => {
    server.use(
      rest.get(baseUrl + '/api/machine/cllo1jq950000vev2qykl9o6j', (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json({
            id: 'cllo1jq950000vev2qykl9o6j',
            name: 'machine 001',
            type: 'Fan'
          })
        )
      })
    )
    const response = await store.dispatch(getMachineById('cllo1jq950000vev2qykl9o6j'))
    expect(response.payload).toEqual(mockData[0])
  })

  test('should return a error when id is invalid', async () => {
    server.use(
      rest.get(baseUrl + '/api/machine/invalid-id', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({
            message: 'error'
          })
        )
      })
    )
    const response = await store.dispatch(getMachineById('invalid-id'))
    expect(response.type).toBe('machines/getMachineById/rejected')
  })

  test('should create a new machine', async () => {
    const newMachine = { name: 'machine test', type: 'Pump' }
    const response = await store.dispatch(createMachine(newMachine))
    expect(response.payload).toEqual({ id: 'newId', name: 'machine test', type: 'Pump' })
  })

  test('should return a error when create a new machine fails', async () => {
    server.use(
      rest.post(baseUrl + '/api/machine', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({
            message: 'error'
          })
        )
      })
    )
    const newMachine = { name: '', type: '' }
    const response = await store.dispatch(createMachine(newMachine))
    expect(response.type).toBe('machines/createMachine/rejected')
  })

  test('should update a machine', async () => {
    const response = await store.dispatch(updateMachine(mockData[0]))
    expect(response.payload).toEqual(mockData[0])
  })

  test('should return a error when update machine fails', async () => {
    server.use(
      rest.patch(baseUrl + '/api/machine/id', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({
            message: 'error'
          })
        )
      })
    )
    const machine = { id: 'id', name: 'machine test', type: 'Pump' }
    const response = await store.dispatch(updateMachine(machine))
    expect(response.type).toBe('machines/updateMachine/rejected')
  })

  test('should delete a machine', async () => {
    const machine = { id: 'id', name: 'machine test', type: 'Pump' }
    const response = await store.dispatch(deleteMachine(machine.id))
    expect(response.payload).toEqual(200)
  })

  test('should return a error when delete machine fails', async () => {
    server.use(
      rest.delete(baseUrl + '/api/machine/id', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({
            message: 'error'
          })
        )
      })
    )
    const machine = { id: 'id', name: 'machine test', type: 'Pump' }
    const response = await store.dispatch(deleteMachine(machine.id))
    expect(response.type).toBe('machines/deleteMachine/rejected')
  })

  test('should reset error state', () => {
    const state = {
      machines: [],
      machine: { id: '', name: '', type: '' },
      status: 'failed',
      error: undefined
    }
    const action = {
      type: 'machines/resetError',
      payload: {
        machines: [],
        machine: { id: '', name: '', type: '' },
        status: 'succeeded',
        error: undefined
      }
    }
    const newState = machinesSlice(state, resetError(action.payload))
    expect(newState).toEqual(action.payload)
  })
})
