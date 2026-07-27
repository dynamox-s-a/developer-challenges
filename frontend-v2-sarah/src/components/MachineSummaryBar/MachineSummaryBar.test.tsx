import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import {
  MachineIcon,
  IntervalIcon,
  GpsIcon,
  RpmIcon,
  DynamicRangeIcon,
} from '../Icons';
import { MachineSummaryBar } from './index';
import type { MachineData } from './type';

const theme = createTheme();

describe('MachineSummaryBar Component', () => {
  const machineDataMock: MachineData[] = [
    { id: '1', label: 'Teste 1', isLarge: true, icon: MachineIcon },
    { id: '2', label: 'Teste 2', isLarge: true, icon: IntervalIcon },
    { id: '3', label: 'Teste 3', isLarge: false, icon: GpsIcon },
    { id: '4', label: 'Teste 4', isLarge: false, icon: RpmIcon },
    { id: '5', label: 'Teste 5', isLarge: false, icon: DynamicRangeIcon },
  ];

  it('Should render the component correctly', () => {
    render(
      <ThemeProvider theme={theme}>
        <MachineSummaryBar machineData={machineDataMock} />
      </ThemeProvider>,
    );

    expect(
      screen.getByTestId('machine-summary-bar-container'),
    ).toBeInTheDocument();

    machineDataMock.forEach((item) => {
      expect(
        screen.getByTestId(`machine-summary-item-${item.id}`),
      ).toBeInTheDocument();
      expect(screen.getByText(item.label)).toBeInTheDocument();
    });
  });

  it('should render without breaking if the machineData list is empty', () => {
    render(
      <ThemeProvider theme={theme}>
        <MachineSummaryBar machineData={[]} />
      </ThemeProvider>,
    );

    expect(
      screen.queryByTestId(/machine-summary-bar-item-/),
    ).not.toBeInTheDocument();
  });
});
