import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import EventFormDialog from '@/components/EventFormDialog';

const mockOnClose = jest.fn();
const mockOnSubmit = jest.fn();

describe('EventFormDialog', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders create dialog correctly', () => {
    render(
      <EventFormDialog
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        mode="create"
      />
    );

    expect(screen.getByText('Create New Event')).toBeInTheDocument();
    expect(screen.getByLabelText(/Event Name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Location/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Description/i)).toBeInTheDocument();
  });

  it('shows validation error for empty name', async () => {
    render(
      <EventFormDialog
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        mode="create"
      />
    );

    const submitButton = screen.getByRole('button', { name: /create/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Event name is required')).toBeInTheDocument();
    });
  });

  it('shows validation error for short description', async () => {
    render(
      <EventFormDialog
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        mode="create"
      />
    );

    const descriptionInput = screen.getByLabelText(/Description/i);
    fireEvent.change(descriptionInput, { target: { value: 'Short' } });

    const submitButton = screen.getByRole('button', { name: /create/i });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Description must be at least 50 characters')).toBeInTheDocument();
    });
  });

  it('calls onClose when cancel is clicked', () => {
    render(
      <EventFormDialog
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        mode="create"
      />
    );

    const cancelButton = screen.getByRole('button', { name: /cancel/i });
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('renders edit dialog with event data', () => {
    const mockEvent = {
      id: 1,
      name: 'Test Event',
      dateTime: '2026-03-15T09:00:00',
      location: 'Test Location',
      description: 'Test description with more than fifty characters to meet the minimum requirement',
      category: 'Conference' as const,
      createdAt: '2026-02-01T10:00:00',
      updatedAt: '2026-02-01T10:00:00',
    };

    render(
      <EventFormDialog
        open={true}
        onClose={mockOnClose}
        onSubmit={mockOnSubmit}
        mode="edit"
        event={mockEvent}
      />
    );

    expect(screen.getByText('Edit Event')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Event')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Test Location')).toBeInTheDocument();
  });
});
