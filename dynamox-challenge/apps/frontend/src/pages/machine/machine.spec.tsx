import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import MachinePage from './machine';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as machineApi from '@/store/machines/machines.api';

// Mocks
const mockMachines = [
  { id: '1', name: 'Machine 1', type: 'Pump', status: 'Operating' },
  { id: '2', name: 'Machine 2', type: 'Fan', status: 'Stopped' }
];

const mockCreateMachine = vi.fn();
const mockUpdateMachine = vi.fn();
const mockDeleteMachine = vi.fn();

// Mock the API hooks
vi.mock('@/store/machines/machines.api', () => ({
  useGetMachinesQuery: vi.fn(),
  useCreateMachineMutation: vi.fn(),
  useUpdateMachineMutation: vi.fn(),
  useDeleteMachineMutation: vi.fn(),
}));

describe('MachinePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // Default mock implementations
    (machineApi.useGetMachinesQuery as any).mockReturnValue({
      data: mockMachines,
      isLoading: false,
    });

    (machineApi.useCreateMachineMutation as any).mockReturnValue([
      mockCreateMachine.mockReturnValue({ unwrap: () => Promise.resolve() }),
      {}
    ]);

    (machineApi.useUpdateMachineMutation as any).mockReturnValue([
      mockUpdateMachine.mockReturnValue({ unwrap: () => Promise.resolve() }),
      {}
    ]);

    (machineApi.useDeleteMachineMutation as any).mockReturnValue([
      mockDeleteMachine.mockReturnValue({ unwrap: () => Promise.resolve() }),
      {}
    ]);
  });

  it('renders the list of machines', () => {
    render(<MachinePage />);
    expect(screen.getByText('Machine 1')).toBeTruthy();
    expect(screen.getByText('Machine 2')).toBeTruthy();
  });

  it('shows error alert when creation fails', async () => {
    // Setup failure
    mockCreateMachine.mockReturnValue({
      unwrap: () => Promise.reject(new Error('API Error'))
    });

    render(<MachinePage />);

    // Open add modal
    fireEvent.click(screen.getByText('New Machine'));

    // Fill form
    fireEvent.change(screen.getByLabelText(/Name/i), { target: { value: 'New Fail' } });
    fireEvent.mouseDown(screen.getByLabelText(/Type/i));
    fireEvent.click(screen.getByText('Pump')); // Assuming 'Pump' is in the menu

    // Submit
    fireEvent.click(screen.getByText('Create Machine'));

    // Verify Alert appearance
    await waitFor(() => {
      expect(screen.getByText('Failed to save machine. Please try again.')).toBeTruthy();
    });
  });

  it('shows error alert when deletion fails', async () => {
    // Setup failure
    mockDeleteMachine.mockReturnValue({
      unwrap: () => Promise.reject(new Error('API Error'))
    });

    render(<MachinePage />);

    // Find delete button for first machine (Machine 1)
    // Note: There are multiple 'Delete' texts (buttons). 
    // MachineCard has a Delete button. We need to target one.
    const deleteButtons = screen.getAllByText('Delete');
    fireEvent.click(deleteButtons[0]);

    // Confirm delete in modal
    // The modal also has a 'Delete' button (action confirmation)
    // We need to wait for modal to appear
    const confirmDeleteBtn = await screen.findByRole('button', { name: 'Delete' }); // This finds the modal button usually, or rely on text inside modal
    fireEvent.click(confirmDeleteBtn);

    // Verify Alert appearance
    await waitFor(() => {
      expect(screen.getByText('Failed to delete machine. Please try again.')).toBeTruthy();
    });
  });
});
