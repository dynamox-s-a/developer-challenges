import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { makeStore } from '@/store';
import CreateEventForm from '../create/page';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

global.fetch = jest.fn();

describe('CreateEventForm Integration', () => {
  let store: ReturnType<typeof makeStore>;
  let mockPush: jest.Mock;

  beforeEach(() => {
    store = makeStore();
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (global.fetch as jest.Mock).mockClear();
  });

  const renderWithProviders = (component: React.ReactNode) => {
    return render(<Provider store={store}>{component}</Provider>);
  };

  it('submits form successfully and navigates to events page', async () => {
    const mockCreatedEvent = {
      id: '123',
      name: 'New Event',
      description: 'New Description',
      dateTime: '2026-12-31T10:00',
      location: 'New Location',
      category: 'Conference',
    };
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockCreatedEvent,
    });

    const user = userEvent.setup();
    renderWithProviders(<CreateEventForm />);

    expect(screen.getByText('Create Event')).toBeInTheDocument();

    await user.type(screen.getByLabelText(/name/i), 'New Event');
    await user.type(
      screen.getByLabelText(/description/i),
      'New Description that is very long and has more than 50 characters so it passes validation',
    );
    fireEvent.change(screen.getByLabelText(/date/i), { target: { value: '2026-12-31T10:00' } });
    await user.type(screen.getByLabelText(/location/i), 'New Location');

    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/events',
        expect.objectContaining({
          method: 'POST',
        }),
      );
      expect(mockPush).toHaveBeenCalledWith('/events');
    });
  });

  it('navigates back to events page when cancel is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateEventForm />);

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(mockPush).toHaveBeenCalledWith('/events');
  });

  it('shows validation errors when submitting empty form', async () => {
    const user = userEvent.setup();
    renderWithProviders(<CreateEventForm />);

    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(global.fetch).not.toHaveBeenCalled();
    expect(mockPush).not.toHaveBeenCalled();
  });
});
