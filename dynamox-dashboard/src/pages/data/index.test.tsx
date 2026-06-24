import { ThemeProvider } from '@mui/material'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { machineMock } from '../../modules/machine/machineMock'
import { measurementsMock } from '../../modules/measurements/measurementsMock'
import type { RootState } from '../../store/store'
import { theme } from '../../theme'
import { DataPage } from '.'

const dispatchMock = vi.fn()

let stateMock: RootState

vi.mock('../../store/hooks', () => ({
  useAppDispatch: () => dispatchMock,
  useAppSelector: (selector: (state: RootState) => unknown) =>
    selector(stateMock),
}))

vi.mock('./components/MetricChartPanel', () => ({
  MetricChartPanel: ({ metric }: { metric: { title: string } }) => (
    <div>{metric.title}</div>
  ),
}))

function renderDataPage() {
  return render(
    <ThemeProvider theme={theme}>
      <DataPage />
    </ThemeProvider>,
  )
}

describe('DataPage', () => {
  afterEach(() => {
    cleanup()
  })

  beforeEach(() => {
    dispatchMock.mockClear()
    stateMock = {
      machine: {
        data: null,
        error: null,
        isLoading: false,
      },
      measurements: {
        data: [],
        error: null,
        isLoading: false,
      },
    }
  })

  it('requests machine and measurement data on mount', () => {
    renderDataPage()

    expect(dispatchMock).toHaveBeenCalledTimes(2)
  })

  it('shows a loading state while data is loading', () => {
    stateMock.machine.isLoading = true

    renderDataPage()

    expect(screen.getByRole('progressbar')).toBeTruthy()
  })

  it('shows an error message when a request fails', () => {
    stateMock.machine.error = 'Request failed'

    renderDataPage()

    expect(screen.getByText(/Request failed/)).toBeTruthy()
  })

  it('shows an empty state when there are no measurements', () => {
    stateMock.machine.data = machineMock

    renderDataPage()

    expect(screen.getByText('Nenhum dado de medição encontrado.')).toBeTruthy()
  })

  it('renders machine metadata and chart cards when data is available', () => {
    stateMock.machine.data = machineMock
    stateMock.measurements.data = measurementsMock

    renderDataPage()

    expect(screen.getByText('Máquina 1023')).toBeTruthy()
    expect(screen.getByText('Ponto 20192')).toBeTruthy()
    expect(screen.getByText('Aceleração RMS')).toBeTruthy()
    expect(screen.getByText('Temperatura')).toBeTruthy()
    expect(screen.getByText('Velocidade RMS')).toBeTruthy()
  })
})
