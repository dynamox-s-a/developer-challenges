import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MachineFormModal } from './machine-form-modal';
import { describe, it, expect, vi } from 'vitest';

describe('MachineFormModal', () => {
  const mockOnClose = vi.fn();
  const mockOnSubmit = vi.fn();

  const mockMachine = {
    id: '1',
    name: 'Existing Machine',
    type: 'Pump',
    status: 'Operating'
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders correctly when closed', () => {
    render(
      <MachineFormModal
        open={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );
    expect(screen.queryByText('New Machine')).toBeNull();
  });

  it('renders correctly in creation mode', () => {
    render(
      <MachineFormModal
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );
    expect(screen.getByText('New Machine')).toBeTruthy();
    expect(screen.getByLabelText(/Name/i)).toHaveValue('');
  });

  it('renders correctly in edit mode', () => {
    render(
      <MachineFormModal
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        machine={mockMachine}
      />
    );
    expect(screen.getByText('Edit Machine')).toBeTruthy();
    expect(screen.getByLabelText(/Name/i)).toHaveValue('Existing Machine');
  });

  it('validates required fields', async () => {
    render(
      <MachineFormModal
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const submitButton = screen.getByText('Create Machine');
    fireEvent.click(submitButton);

    expect(await screen.findByText('Name is required')).toBeTruthy();
    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('calls onSubmit with correct data when valid', async () => {
    render(
      <MachineFormModal
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // We intentionally ignore userEvent here to simplify the example as requested "simples"
    // but using fireEvent for typing is also possible.
    // For Material UI Select, it's a bit tricky with testing-library, 
    // usually requires clicking the select trigger then the option.

    // Fill Name
    const nameInput = screen.getByLabelText(/Name/i);
    fireEvent.change(nameInput, { target: { value: 'New Test Machine' } });

    // Fill Type (Select) - Material UI pattern
    // 1. Locate the input inside the select component or use the haspopup trigger
    // A simpler way for this environment might be to just assume standard HTML behavior if strict mode isn't on,
    // but MUI Select uses a hidden input.
    // Let's try finding the select button (combobox)
    const typeSelect = screen.getByLabelText(/Type/i);
    fireEvent.mouseDown(typeSelect); // Open dropdown
    const option = await screen.findByText('Fã'); // Value from constants
    fireEvent.click(option);

    const submitButton = screen.getByText('Create Machine');
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        name: 'New Test Machine',
        type: 'Fã'
      }, expect.anything()); // expect.anything() for event object if passed
    });
  });

  it('shows error when machine name already exists', async () => {
    const existingMachines = [{ id: '2', name: 'Duplicate Name', type: 'pump', status: 'operating' }];
    render(
      <MachineFormModal
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        machines={existingMachines}
      />
    );

    const nameInput = screen.getByLabelText(/Name/i);
    fireEvent.change(nameInput, { target: { value: 'Duplicate Name' } });
    fireEvent.blur(nameInput); // Trigger validation

    expect(await screen.findByText('Machine with this name already exists')).toBeTruthy();

    const submitButton = screen.getByText('Create Machine');
    fireEvent.click(submitButton);

    expect(mockOnSubmit).not.toHaveBeenCalled();
  });

  it('resets form when reopening', async () => {
    const { rerender } = render(
      <MachineFormModal
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    const nameInput = screen.getByLabelText(/Name/i);
    fireEvent.change(nameInput, { target: { value: 'Dirty Value' } });

    // Close
    rerender(
      <MachineFormModal
        open={false}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    // Reopen
    rerender(
      <MachineFormModal
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
      />
    );

    await waitFor(() => {
      expect(screen.getByLabelText(/Name/i)).toHaveValue('');
    });
  });
});
