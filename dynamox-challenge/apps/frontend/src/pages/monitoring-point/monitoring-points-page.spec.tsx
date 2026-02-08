import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import MonitoringPointsPage from './monitoring-points-page';
import { vi } from 'vitest';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';

// Mocks
const mockGetMPs = vi.fn();
const mockGetMachines = vi.fn();
const mockCreateMP = vi.fn();
const mockUpdateMP = vi.fn();
const mockDeleteMP = vi.fn();

vi.mock('@/store/monitoring-points/monitoring-points.api', () => ({
  useGetMonitoringPointsQuery: () => mockGetMPs(),
  useCreateMonitoringPointMutation: () => [mockCreateMP],
  useUpdateMonitoringPointMutation: () => [mockUpdateMP],
  useDeleteMonitoringPointMutation: () => [mockDeleteMP],
}));

vi.mock('@/store/machines/machines.api', () => ({
  useGetMachinesQuery: () => mockGetMachines(),
}));

describe('MonitoringPointsPage', () => {
  const renderComponent = () => {
    return render(
      <Provider store={store}>
        <ThemeProvider>
          <BrowserRouter>
            <MonitoringPointsPage />
          </BrowserRouter>
        </ThemeProvider>
      </Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetMPs.mockReturnValue({
      data: { data: [], total: 0 },
      isLoading: false,
      error: null,
    });
    mockGetMachines.mockReturnValue({
      data: [{ id: 1, name: 'Machine 1', type: 'Fã' }],
      isLoading: false,
    });
  });

  it('renders loading state', () => {
    mockGetMPs.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });
    renderComponent();
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('renders error state', () => {
    mockGetMPs.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { status: 500 },
    });
    renderComponent();
    expect(screen.getByText(/Error loading monitoring points/i)).toBeInTheDocument();
  });

  it('renders monitoring points list', () => {
    mockGetMPs.mockReturnValue({
      data: {
        data: [{ id: 1, name: 'MP 1', machineId: 1, machineName: 'Machine 1', sensors: [] }],
        total: 1
      },
      isLoading: false,
      error: null,
    });
    renderComponent();
    expect(screen.getByText('MP 1')).toBeInTheDocument();
  });


  it('opens add monitoring point modal', () => {
    renderComponent();
    const addButton = screen.getByRole('button', { name: /Add/i });
    fireEvent.click(addButton);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Add Monitoring Point/i })).toBeInTheDocument();
  });
});
