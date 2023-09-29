import 'whatwg-fetch'
import { rest } from 'msw'
import { setupServer } from 'msw/node'
import { render, screen, within } from 'test-utils/test-utils'
import userEvent from '@testing-library/user-event'
import { useRouter } from 'next/navigation'
import SpotForm from './SpotForm'

const baseUrl = process.env.NEXT_PUBLIC_API_URL

jest.mock('next/navigation', () => ({
  useParams: jest.fn().mockReturnValue({
    id: 'cllo1jq950000vev2qykl9o6j'
  }),
  useRouter: jest.fn().mockReturnValue({ push: jest.fn() })
}))

const mockSpot = {
  id: 'cllo1jq950000vev2qykl9o6j',
  name: 'test spot',
  machineId: 'cllpkfnp90000vejobymmn6xh',
  sensorId: 'Dyp.30.014.4622',
  sensorModel: 'HF+'
}

const mockMachines = [
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
    return res(ctx.json(mockMachines))
  })
]

const server = setupServer(...handlers)

// Enable API mocking before tests.
beforeAll(() => server.listen())

// Reset any runtime request handlers we may add during the tests.
afterEach(() => server.resetHandlers())

// Disable API mocking after the tests are done.
afterAll(() => server.close())

describe('SpotForm', () => {
  it('should submit a new spot successfully', async () => {
    const handleSubmit = jest.fn()
    render(<SpotForm onSubmit={handleSubmit} />)
    const nameInput = screen.getByRole('textbox', { name: 'Spot Name' })
    const machineSelect = within(screen.getByTestId('machine-select')).getByRole('button')
    const sensorIdInput = screen.getByRole('textbox', { name: 'Sensor ID' })
    const sensorSelect = within(screen.getByTestId('sensor-select')).getByRole('button')
    const saveButton = screen.getByText('Save')
    const user = userEvent.setup()
    await user.type(nameInput, 'test spot')
    await user.click(machineSelect)
    const machineOption = screen.getByRole('option', { name: 'machine 002 - Pump' })
    await user.click(machineOption)
    await user.type(sensorIdInput, '300144622')
    await user.click(sensorSelect)
    const sensorOption = screen.getByRole('option', { name: 'HF+' })
    await user.click(sensorOption)
    await user.click(saveButton)
    expect(handleSubmit).toHaveBeenCalledWith({
      id: 'cllo1jq950000vev2qykl9o6j',
      name: 'test spot',
      machineId: 'cllpkfnp90000vejobymmn6xh',
      sensorId: 'Dyp.30.014.4622',
      sensorModel: 'HF+'
    })
  }, 10000)
  it('should update a spot successfully', async () => {
    const handleSubmit = jest.fn()
    render(<SpotForm onSubmit={handleSubmit} updateData={mockSpot} />)
    // const nameInput = screen.getByRole('textbox', { name: 'Spot Name' })
    const machineSelect = within(screen.getByTestId('machine-select')).getByRole('button')
    const sensorIdInput = screen.getByRole('textbox', { name: 'Sensor ID' })
    const sensorSelect = within(screen.getByTestId('sensor-select')).getByRole('button')
    const saveButton = screen.getByText('Save')
    const user = userEvent.setup()
    // await user.type(nameInput, 'updtate spot')
    await user.click(machineSelect)
    const machineOption = screen.getByRole('option', { name: 'machine 002 - Pump' })
    await user.click(machineOption)
    await user.type(sensorIdInput, '300144622')
    await user.click(sensorSelect)
    const sensorOption = screen.getByRole('option', { name: 'HF+' })
    await user.click(sensorOption)
    await user.click(saveButton)
    expect(handleSubmit).toHaveBeenCalledWith({
      id: 'cllo1jq950000vev2qykl9o6j',
      name: 'test spot',
      machineId: 'cllpkfnp90000vejobymmn6xh',
      sensorId: 'Dyp.30.014.4622',
      sensorModel: 'HF+'
    })
  }, 10000)
  it('should cancel/back to spots on update when clicks cancel', async () => {
    const handleSubmit = jest.fn()
    const router = useRouter()
    render(<SpotForm onSubmit={handleSubmit} updateData={mockSpot} />)
    const cancelButton = screen.getByText('Cancel')
    const user = userEvent.setup()
    await user.click(cancelButton)
    expect(router.push).toHaveBeenCalledWith('/dashboard/spots')
  })
  it('should cancel/reset form on create when clicks cancel', async () => {
    const handleSubmit = jest.fn()
    render(<SpotForm onSubmit={handleSubmit} />)
    const nameInput = screen.getByRole('textbox', { name: 'Spot Name' })
    const sensorIdInput = screen.getByRole('textbox', { name: 'Sensor ID' })
    const cancelButton = screen.getByText('Cancel')
    const user = userEvent.setup()
    await user.type(nameInput, 'test spot')
    await user.type(sensorIdInput, '300144622')
    await user.click(cancelButton)
    expect(nameInput).toHaveValue('')
    expect(sensorIdInput).toHaveValue('')
  }, 10000)
})
