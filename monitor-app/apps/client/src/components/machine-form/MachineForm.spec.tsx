import { render, screen, within } from 'test-utils/test-utils'
import userEvent from '@testing-library/user-event'

import MachineForm from './MachineForm'

describe('MachineForm', () => {
  it('should render successfully', () => {
    const onSubmit = jest.fn()
    const { baseElement } = render(<MachineForm onSubmit={onSubmit} />)
    expect(baseElement).toBeTruthy()
  })
  it('should submit successfully', async () => {
    const onSubmit = jest.fn()
    render(<MachineForm onSubmit={onSubmit} />)
    const nameInput = screen.getByRole('textbox', { name: 'Machine Name' })
    const typeSelect = within(screen.getByTestId('type-select')).getByRole('button')
    const saveButton = screen.getByText('Save')
    const user = userEvent.setup()
    await user.type(nameInput, 'test machine')
    await user.click(typeSelect)
    const typeOption = screen.getByRole('option', { name: 'Pump' })
    await user.click(typeOption)
    await user.click(saveButton)
    expect(onSubmit).toHaveBeenLastCalledWith({ name: 'test machine', type: 'Pump' })
  })
})
