import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import ChartContainer from '../ChartContainer';
import { describe, it, expect } from 'vitest';

describe('<ChartContainer />', () => {
  it('should renders the title and children correctly', () => {
    const title = 'Title';
    const childrenText = 'Children';

    render(
      <ChartContainer title={title}>
        <div>{childrenText}</div>
      </ChartContainer>,
    );

    expect(screen.getByText(title)).toBeInTheDocument();
    expect(screen.getByText(childrenText)).toBeInTheDocument();
  });
});
