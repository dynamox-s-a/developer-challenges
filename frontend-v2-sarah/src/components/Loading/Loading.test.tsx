import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Loading } from './index';

const theme = createTheme();

describe('Loading Component', () => {
  it('should render the loading container and the progress loop correctly', () => {
    render(
      <ThemeProvider theme={theme}>
        <Loading />
      </ThemeProvider>,
    );

    expect(screen.getByTestId('loading-container')).toBeInTheDocument();
    expect(screen.getByTestId('loading-circular-progress')).toBeInTheDocument();
  });
});
