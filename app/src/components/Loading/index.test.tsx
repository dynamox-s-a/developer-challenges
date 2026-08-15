import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import Loading from './index';

describe('Loading', () => {
  it('renders correctly', () => {
    const { container } = render(<Loading />);
    expect(container.firstChild).toBeTruthy();
  });
});
