import { render, screen, within } from 'test-utils/test-utils'
import userEvent from '@testing-library/user-event'

import MachineForm from './MachineForm'

jest.mock('next/navigation', () => ({
  useParams: jest.fn().mockReturnValue({
    id: 'cllo1jq950000vev2qykl9o6j'
  })
}))

const mockMachine = {
  id: 'cllo1jq950000vev2qykl9o6j',
  name: 'test machine',
  type: 'Pump'
}

describe('MachineForm', () => {
  it('should render successfully', () => {
    const handleSubmit = jest.fn()
    const { baseElement } = render(<MachineForm onSubmit={handleSubmit} updateData={mockMachine} />)
    expect(baseElement).toBeTruthy()
  })
  it('should submit new machine successfully', async () => {
    const handleSubmit = jest.fn()
    render(<MachineForm onSubmit={handleSubmit} />)
    const nameInput = screen.getByRole('textbox', { name: 'Machine Name' })
    const typeSelect = within(screen.getByTestId('type-select')).getByRole('button')
    const saveButton = screen.getByText('Save')
    const user = userEvent.setup()
    await user.type(nameInput, 'test machine')
    await user.click(typeSelect)
    const typeOption = screen.getByRole('option', { name: 'Pump' })
    await user.click(typeOption)
    await user.click(saveButton)
    expect(handleSubmit).toHaveBeenLastCalledWith({
      name: 'test machine',
      type: 'Pump',
      id: 'cllo1jq950000vev2qykl9o6j'
    })
  })
  it('should submit successfully', async () => {
    const handleSubmit = jest.fn()
    render(<MachineForm onSubmit={handleSubmit} updateData={mockMachine} />)
    const saveButton = screen.getByText('Save')
    const user = userEvent.setup()
    await user.click(saveButton)
    expect(handleSubmit).toHaveBeenLastCalledWith({
      name: 'test machine',
      type: 'Pump',
      id: 'cllo1jq950000vev2qykl9o6j'
    })
  })
})
