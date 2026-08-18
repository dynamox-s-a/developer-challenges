import { describe, expect, it } from 'vitest';
import { render, screen } from '@testing-library/react';
import Info from './index';

describe('Info', () => {
  it('renders correctly', () => {
    const mockedText = 'Texto mockado';
    const MockedIcon = () => <span data-testid="mocked-icon" />;

    render(<Info icon={<MockedIcon />} text={mockedText} />);

    expect(screen.getByText(mockedText)).toBeTruthy();
    expect(screen.getByTestId('mocked-icon')).toBeTruthy();
  });
});
