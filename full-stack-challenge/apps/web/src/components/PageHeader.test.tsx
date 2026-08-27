import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { PageHeader } from './PageHeader';

describe('PageHeader', () => {
  it('renders title, subtitle and actions', () => {
    render(
      <PageHeader title="Machines" subtitle="Manage assets" actions={<button>New</button>} />
    );

    expect(screen.getByText('Machines')).toBeTruthy();
    expect(screen.getByText('Manage assets')).toBeTruthy();
    expect(screen.getByRole('button', { name: 'New' })).toBeTruthy();
  });
});
