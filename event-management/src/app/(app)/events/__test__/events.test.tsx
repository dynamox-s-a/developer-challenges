import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Provider } from 'react-redux';
import { makeStore } from '@/store';
import EventsPage from '../page';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

global.fetch = jest.fn();

const mockEvents = [
  {
    id: '1',
    name: 'Upcoming Event 1',
    dateTime: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    location: 'Location 1',
    description: 'Description 1',
    createdBy: 'admin@example.com',
  },
  {
    id: '2',
    name: 'Past Event 1',
    dateTime: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    location: 'Location 2',
    description: 'Description 2',
    createdBy: 'admin@example.com',
  },
];

describe('EventsPage Integration', () => {
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

  it('fetches and displays events on mount', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockEvents,
    });

    renderWithProviders(<EventsPage />);

    expect(global.fetch).toHaveBeenCalledWith('http://localhost:3001/events', expect.any(Object));

    await waitFor(() => {
      expect(screen.getByText('Upcoming Event 1')).toBeInTheDocument();
    });

    expect(screen.queryByText('Past Event 1')).not.toBeInTheDocument();
  });

  it('switches between upcoming and past events tabs', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockEvents,
    });

    renderWithProviders(<EventsPage />);

    await waitFor(() => {
      expect(screen.getByText('Upcoming Event 1')).toBeInTheDocument();
    });

    const pastEventsTab = screen.getByRole('tab', { name: /past events/i });
    fireEvent.click(pastEventsTab);

    await waitFor(() => {
      expect(screen.getByText('Past Event 1')).toBeInTheDocument();
    });

    expect(screen.queryByText('Upcoming Event 1')).not.toBeInTheDocument();
  });

  it('filters events by search query', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => [
        ...mockEvents,
        {
          id: '3',
          name: 'Another Upcoming',
          dateTime: new Date(Date.now() + 100000000).toISOString(),
          location: 'Location 3',
          description: 'Description 3',
          createdBy: 'admin@example.com',
        },
      ],
    });

    const user = userEvent.setup();
    renderWithProviders(<EventsPage />);

    await waitFor(() => {
      expect(screen.getByText('Upcoming Event 1')).toBeInTheDocument();
    });
    expect(screen.getByText('Another Upcoming')).toBeInTheDocument();

    const searchInput = screen.getByLabelText(/search events/i);
    await user.type(searchInput, 'Another');

    await waitFor(() => {
      expect(screen.getByText('Another Upcoming')).toBeInTheDocument();
    });
    expect(screen.queryByText('Upcoming Event 1')).not.toBeInTheDocument();
  });

  it('navigates to create event page when Create Event is clicked', async () => {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockEvents,
    });

    store.dispatch({
      type: 'auth/login/fulfilled',
      payload: { user: { email: 'admin@example.com', role: 'admin' }, token: 'fake' },
    });

    const user = userEvent.setup();
    renderWithProviders(<EventsPage />);

    await waitFor(() => {
      expect(screen.getByText('Upcoming Event 1')).toBeInTheDocument();
    });

    const createBtn = screen.getByRole('button', { name: /create event/i });
    await user.click(createBtn);

    expect(mockPush).toHaveBeenCalledWith('/admin/create');
  });
});
