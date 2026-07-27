import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CardWrapper } from './index';

const theme = createTheme();
const title = 'Title';
const children = <span data-testid="children-content">Conteúdo do card</span>;

const renderCardWrapper = () => {
  return render(
    <ThemeProvider theme={theme}>
      <CardWrapper {...{ title }}>{children}</CardWrapper>
    </ThemeProvider>,
  );
};

describe('CardWrapper Component', () => {
  it('should render component correctly', () => {
    renderCardWrapper();

    expect(
      screen.getByTestId('card-wrapper-main-container'),
    ).toBeInTheDocument();
    expect(screen.getByTestId('card-wrapper-header')).toBeInTheDocument();

    const titleElement = screen.getByTestId('card-wrapper-title');
    expect(titleElement).toBeInTheDocument();
    expect(titleElement).toHaveTextContent(title);
    expect(titleElement.tagName).toBe('H6');

    expect(screen.getByTestId('card-wrapper-content')).toBeInTheDocument();
  });

  it('should render children component correctly', () => {
    renderCardWrapper();

    expect(screen.getByTestId('card-wrapper-content')).toBeInTheDocument();

    const childrenContentElement = screen.getByTestId('children-content');
    expect(childrenContentElement).toBeInTheDocument();
    expect(childrenContentElement).toHaveTextContent('Conteúdo do card');
  });
});
