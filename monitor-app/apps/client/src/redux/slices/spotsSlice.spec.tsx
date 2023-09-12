import 'whatwg-fetch'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { createSpot, deleteSpot, getSpotById, getSpots, updateSpot } from './spotsSlice'
import store from 'redux/store'

const baseUrl = process.env.NEXT_PUBLIC_API_URL

const mockData = [
  {
    id: 'clmb65ywp0001ve5536pogu57',
    name: 'spot 001',
    machineId: 'cllpp18700001vewljr6bphlc',
    sensorId: 'Dyp.30.014.4622',
    sensorModel: 'HF+'
  },
  {
    id: 'clmeytp880001ve5zx2zloyrq',
    name: 'spot 002',
    machineId: 'cllpkfnp90000vejobymmn6xh',
    sensorId: 'Dyp.10.022.8250',
    sensorModel: 'HF+'
  }
]

export const handlers = [
  rest.get(baseUrl + '/api/spot', (req, res, ctx) => {
    return res(ctx.json(mockData), ctx.delay(100))
  }),
  rest.post(baseUrl + '/api/spot', (req, res, ctx) => {
    return res(
      ctx.json({
        id: 'newId',
        name: 'spot test',
        machineId: 'machine-id',
        sensorId: 'sensor-id',
        sensorModel: 'HF+'
      }),
      ctx.delay(100)
    )
  }),
  rest.patch(baseUrl + '/api/spot', (req, res, ctx) => {
    return res(
      ctx.json({
        id: 'id',
        name: 'spot test',
        machineId: 'machine-id',
        sensorId: 'sensor-id',
        sensorModel: 'HF+'
      })
    )
  }),
  rest.delete(baseUrl + '/api/spot', (req, res, ctx) => {
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

describe('spotsSlice', () => {
  test('should return the spot list', async () => {
    const response = await store.dispatch(getSpots())
    expect(response.payload).toEqual(mockData)
  })
  test('should return a error when the spot list fetch fails', async () => {
    server.use(
      rest.get(baseUrl + '/api/spot', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({
            message: 'error'
          })
        )
      })
    )
    const response = await store.dispatch(getSpots())
    expect(response.type).toBe('spots/getSpots/rejected')
  })

  test('should return a spot by id', async () => {
    server.use(
      rest.get(baseUrl + '/api/spot', (req, res, ctx) => {
        return res(
          ctx.status(200),
          ctx.json([
            {
              ...mockData[0]
            }
          ])
        )
      })
    )
    const response = await store.dispatch(getSpotById('cllo1jq950000vev2qykl9o6j'))
    expect(response.payload).toEqual([mockData[0]])
  })
  test('should return a error when id is invalid', async () => {
    server.use(
      rest.get(baseUrl + '/api/spot', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({
            message: 'error'
          })
        )
      })
    )
    const response = await store.dispatch(getSpotById('invalid-id'))
    expect(response.type).toBe('spots/getSpotById/rejected')
  })

  test('should create a new spot', async () => {
    const newSpot = {
      name: 'spot test',
      machineId: 'machine-id',
      sensorId: 'sensor-id',
      sensorModel: 'HF+'
    }
    const response = await store.dispatch(createSpot(newSpot))
    expect(response.payload).toEqual({
      id: 'newId',
      name: 'spot test',
      machineId: 'machine-id',
      sensorId: 'sensor-id',
      sensorModel: 'HF+'
    })
  })
  test('should return a error when create a new spot fails', async () => {
    server.use(
      rest.post(baseUrl + '/api/spot', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({
            message: 'error'
          })
        )
      })
    )
    const newSpot = { name: '', machineId: '', sensorId: '', sensorModel: '' }
    const response = await store.dispatch(createSpot(newSpot))
    expect(response.type).toBe('spots/createSpot/rejected')
  })

  test('should update a spot', async () => {
    const spot = {
      id: 'id',
      name: 'spot test',
      machineId: 'machine-id',
      sensorId: 'sensor-id',
      sensorModel: 'HF+'
    }
    const response = await store.dispatch(updateSpot(spot))
    expect(response.payload).toEqual(spot)
  })
  test('should return a error when update spot fails', async () => {
    server.use(
      rest.patch(baseUrl + '/api/spot', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({
            message: 'error'
          })
        )
      })
    )
    const spot = { name: '', machineId: '', sensorId: '', sensorModel: '' }
    const response = await store.dispatch(updateSpot(spot))
    expect(response.type).toBe('spots/updateSpot/rejected')
  })
  test('should delete a spot', async () => {
    const spot = { id: 'id' }
    const response = await store.dispatch(deleteSpot(spot.id))
    expect(response.payload).toEqual({})
  })
  test('should return a error when delete spot fails', async () => {
    server.use(
      rest.delete(baseUrl + '/api/spot', (req, res, ctx) => {
        return res(
          ctx.status(500),
          ctx.json({
            message: 'error'
          })
        )
      })
    )
    const spot = { id: '' }
    const response = await store.dispatch(deleteSpot(spot.id))
    expect(response.type).toBe('spots/deleteSpot/rejected')
  })
})
