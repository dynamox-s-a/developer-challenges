import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { makeStore } from '@/store';
import EditPage from '../[id]/edit/page';
import { useRouter, useParams } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}));

global.fetch = jest.fn();

const mockEvent = {
  id: '123',
  name: 'Existing Event',
  description: 'Existing Description that is large enough to pass the validation of 50 characters.',
  dateTime: '2026-10-10T10:00',
  location: 'Existing Location',
  category: 'Workshop',
  createdBy: 'admin@example.com',
};

describe('EditEventForm Integration', () => {
  let store: ReturnType<typeof makeStore>;
  let mockPush: jest.Mock;

  beforeEach(() => {
    store = makeStore();
    mockPush = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useParams as jest.Mock).mockReturnValue({ id: '123' });
    (global.fetch as jest.Mock).mockClear();
  });

  const renderWithProviders = (component: React.ReactNode, initialState?: any) => {
    if (initialState) {
      store.dispatch({
        type: 'events/fetchEvents/fulfilled',
        payload: initialState.events,
      });
    }
    return render(<Provider store={store}>{component}</Provider>);
  };

  it('renders loading state when event is not found in store', () => {
    renderWithProviders(<EditPage />);
    expect(screen.getByText('Carregando...')).toBeInTheDocument();
  });

  it('loads event data into the form', async () => {
    renderWithProviders(<EditPage />, { events: [mockEvent] });

    expect(screen.getByText('Edit Event')).toBeInTheDocument();

    const nameInput = screen.getByLabelText(/name/i) as HTMLInputElement;
    expect(nameInput.value).toBe('Existing Event');

    const descInput = screen.getByLabelText(/description/i) as HTMLTextAreaElement;
    expect(descInput.value).toBe('Existing Description that is large enough to pass the validation of 50 characters.');

    const locationInput = screen.getByLabelText(/location/i) as HTMLInputElement;
    expect(locationInput.value).toBe('Existing Location');
  });

  it('submits updated data and navigates to events page', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ ...mockEvent, name: 'Updated Event' }),
    });

    const user = userEvent.setup();
    renderWithProviders(<EditPage />, { events: [mockEvent] });

    const nameInput = screen.getByLabelText(/name/i);
    await user.clear(nameInput);
    await user.type(nameInput, 'Updated Event');

    await user.click(screen.getByRole('button', { name: /save/i }));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/events/123',
        expect.objectContaining({
          method: 'PUT',
        }),
      );
      expect(mockPush).toHaveBeenCalledWith('/events');
    });
  });

  it('navigates back to events page when cancel is clicked', async () => {
    const user = userEvent.setup();
    renderWithProviders(<EditPage />, { events: [mockEvent] });

    await user.click(screen.getByRole('button', { name: /cancel/i }));

    expect(mockPush).toHaveBeenCalledWith('/events');
  });
});
