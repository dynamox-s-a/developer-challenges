import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import MachineInfo from './index';

describe('MachineInfo', () => {
  it('renders icons and texts correctly', () => {
    const { container } = render(<MachineInfo />);

    expect(container.querySelectorAll('svg').length).toBeGreaterThan(0);
    expect(container.textContent?.trim().length).toBeGreaterThan(0);
  });
});
