import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

describe('Basic Frontend Tests', () => {
  it('should render test component', () => {
    const TestComponent = () => <div data-testid="test-element">Hello World</div>;
    render(<TestComponent />);
    
    const element = screen.getByTestId('test-element');
    expect(element).toBeInTheDocument();
    expect(element).toHaveTextContent('Hello World');
  });

  it('should have vitest working', () => {
    expect(1 + 1).toBe(2);
  });
});
