import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import Header from './index';

describe('Header', () => {
  it('renders correctly', () => {
    const { container } = render(<Header />);

    expect(container).toHaveTextContent(/Análise de Dados+/);
  });
});
