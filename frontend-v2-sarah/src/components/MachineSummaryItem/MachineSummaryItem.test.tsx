import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { MachineIcon } from '../Icons/MachineIcon';
import { MachineSummaryItem } from './index';
import type { MachineData } from '../MachineSummaryBar/type';

const theme = createTheme();
const mockData: MachineData = {
  id: '1',
  label: 'Temperatura do Motor',
  isLarge: false,
  icon: MachineIcon,
};

const renderMachineSummaryItem = (data: MachineData) => {
  return render(
    <ThemeProvider theme={theme}>
      <MachineSummaryItem data={data} />
    </ThemeProvider>,
  );
};

describe('MachineSummaryItem Component', () => {
  it('should render the label, icon, and container correctly', () => {
    renderMachineSummaryItem(mockData);

    expect(
      screen.getByTestId(`machine-summary-item-${mockData.id}`),
    ).toBeInTheDocument();
    expect(screen.getByTestId('machine-summary-icon')).toBeInTheDocument();
    expect(screen.getByTestId('machine-summary-text')).toHaveTextContent(
      mockData.label,
    );
  });

  it('Should render correctly when isLarge is true', () => {
    const largeData = { ...mockData, isLarge: true };

    renderMachineSummaryItem(largeData);

    expect(screen.getByTestId('machine-summary-text')).toHaveTextContent(
      mockData.label,
    );
  });
});
