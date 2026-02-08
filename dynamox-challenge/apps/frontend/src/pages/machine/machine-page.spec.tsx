import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MachinePage from './machine';
import { vi } from 'vitest';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';

// Mocks
const mockGetMachines = vi.fn();
const mockCreateMachine = vi.fn();
const mockUpdateMachine = vi.fn();

vi.mock('@/store/machines/machines.api', () => ({
  useGetMachinesQuery: () => mockGetMachines(),
  useCreateMachineMutation: () => [mockCreateMachine],
  useUpdateMachineMutation: () => [mockUpdateMachine],
}));

describe('MachinePage', () => {
  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <ThemeProvider>
          <BrowserRouter>
            <MachinePage />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetMachines.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
    });
  });

  it('renders machine list correctly (empty)', () => {
    renderComponent();
    expect(screen.getByRole('button', { name: /new machine/i })).toBeInTheDocument();
  });

  it('renders machine list with data', () => {
    mockGetMachines.mockReturnValue({
      data: [{ id: 1, name: 'Machine A', type: 'Bomba', monitoringPoints: [] }],
      isLoading: false,
      error: null,
    });
    renderComponent();
    expect(screen.getByText('Machine A')).toBeInTheDocument();
    expect(screen.getByText('Bomba')).toBeInTheDocument();
  });

  it('opens add machine modal', () => {
    renderComponent();
    const addButton = screen.getByRole('button', { name: /new machine/i });
    fireEvent.click(addButton);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /New Machine/i })).toBeInTheDocument();
  });

  it('filters machines by name', () => {
    mockGetMachines.mockReturnValue({
      data: [
        { id: 1, name: 'Machine Alpha', type: 'Bomba', monitoringPoints: [] },
        { id: 2, name: 'Machine Beta', type: 'Fã', monitoringPoints: [] }
      ],
      isLoading: false,
      error: null,
    });
    renderComponent();

    const searchInput = screen.getByPlaceholderText(/search/i);
    fireEvent.change(searchInput, { target: { value: 'Alpha' } });

    expect(screen.getByText('Machine Alpha')).toBeInTheDocument();
    expect(screen.queryByText('Machine Beta')).not.toBeInTheDocument();
  });
});
