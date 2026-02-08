import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import MachineDetailPage from './machine-detail-page';
import { vi } from 'vitest';
import { Provider } from 'react-redux';
import { store } from '@/store/store';
import { ThemeProvider } from '@/components/core/theme-provider/theme-provider';

// Mocks
const mockGetMachine = vi.fn();
const mockUpdateMachine = vi.fn();
const mockDeleteMachine = vi.fn();
const mockCreateMP = vi.fn();
const mockUpdateMP = vi.fn();
const mockDeleteMP = vi.fn();

vi.mock('@/store/machines/machines.api', () => ({
  useGetMachineQuery: (id: number) => mockGetMachine(id),
  useUpdateMachineMutation: () => [mockUpdateMachine],
  useDeleteMachineMutation: () => [mockDeleteMachine],
}));

vi.mock('@/store/monitoring-points/monitoring-points.api', () => ({
  useCreateMonitoringPointMutation: () => [mockCreateMP],
  useUpdateMonitoringPointMutation: () => [mockUpdateMP],
  useDeleteMonitoringPointMutation: () => [mockDeleteMP],
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('MachineDetailPage', () => {
  const renderComponent = (machineId = 1) => {
    return render(
      <Provider store={store}>
        <ThemeProvider>
          <MemoryRouter initialEntries={[`/machine/${machineId}`]}>
            <Routes>
              <Route path="/machine/:id" element={<MachineDetailPage />} />
            </Routes>
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
    );
  };

  beforeEach(() => {
    vi.clearAllMocks();
    mockGetMachine.mockReturnValue({
      data: { id: 1, name: 'Test Machine', type: 'Fã', monitoringPoints: [] },
      isLoading: false,
      error: null,
    });
  });

  it('renders loading state', () => {
    mockGetMachine.mockReturnValue({
      data: undefined,
      isLoading: true,
      error: null,
    });
    renderComponent();
    expect(screen.getByText(/Loading.../i)).toBeInTheDocument();
  });

  it('renders error state', () => {
    mockGetMachine.mockReturnValue({
      data: undefined,
      isLoading: false,
      error: { status: 404 },
    });
    renderComponent();
    expect(screen.getByText(/Error loading machine/i)).toBeInTheDocument();
  });

  it('renders machine details', () => {
    renderComponent();
    expect(screen.getByRole('heading', { name: 'Test Machine' })).toBeInTheDocument();
    expect(screen.getByText('Fã')).toBeInTheDocument();
  });

  it('opens edit machine modal', () => {
    renderComponent();
    const editButton = screen.getByRole('button', { name: /Edit Machine/i });
    fireEvent.click(editButton);
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /Edit Machine/i })).toBeInTheDocument();
  });

  it('opens delete machine confirmation', () => {
    renderComponent();
    const deleteButton = screen.getByRole('button', { name: /Delete Machine/i });
    fireEvent.click(deleteButton);
    expect(screen.getByText(/Are you sure you want to delete machine/i)).toBeInTheDocument();
  });

  it('renders monitoring points section', () => {
    renderComponent();
    expect(screen.getByRole('heading', { name: /Monitoring Points/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Add Monitoring Point/i })).toBeInTheDocument();
  });
});
