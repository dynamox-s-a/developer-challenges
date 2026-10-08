import { fireEvent, render, screen, within } from '@testing-library/react';
import {
  DataTable,
  type DataTableColumn,
  type DataTableProps,
  nextSort,
} from './DataTable';

interface Machine {
  id: string;
  name: string;
  type: string;
}

type SortKey = 'name' | 'type';

const columns: DataTableColumn<Machine, SortKey>[] = [
  { id: 'name', header: 'Name', render: (m) => m.name, sortField: 'name' },
  { id: 'type', header: 'Type', render: (m) => m.type, sortField: 'type' },
  {
    id: 'actions',
    header: 'Actions',
    render: (m) => <button type="button">Edit {m.name}</button>,
  },
];

const rows: Machine[] = [
  { id: '1', name: 'Fan A', type: 'Fan' },
  { id: '2', name: 'Pump B', type: 'Pump' },
];

function renderTable(props: Partial<DataTableProps<Machine, SortKey>> = {}) {
  const handlers = {
    onPageChange: vi.fn(),
    onPageSizeChange: vi.fn(),
    onSortChange: vi.fn(),
  };
  render(
    <DataTable<Machine, SortKey>
      label="Machines"
      columns={columns}
      rows={rows}
      getRowId={(m) => m.id}
      page={1}
      pageSize={5}
      total={12}
      sort={{ by: 'name', dir: 'asc' }}
      {...handlers}
      {...props}
    />,
  );
  return handlers;
}

function columnHeader(name: string) {
  return screen.getByRole('columnheader', { name });
}

describe('DataTable', () => {
  it('renders the headers and one row per record', () => {
    renderTable();
    const table = screen.getByRole('table', { name: 'Machines' });
    expect(
      within(table)
        .getAllByRole('columnheader')
        .map((th) => th.textContent),
    ).toEqual(['Name', 'Type', 'Actions']);
    // Header row + data rows.
    expect(within(table).getAllByRole('row')).toHaveLength(3);
    expect(screen.getByRole('button', { name: 'Edit Pump B' })).toBeTruthy();
  });

  it('shows a message when there are no records', () => {
    renderTable({ rows: [], total: 0, emptyMessage: 'No machines yet.' });
    expect(screen.getByText('No machines yet.')).toBeTruthy();
  });

  describe('sorting', () => {
    it('exposes the active sort to assistive technology', () => {
      renderTable({ sort: { by: 'type', dir: 'desc' } });
      expect(columnHeader('Type').getAttribute('aria-sort')).toBe('descending');
      expect(columnHeader('Name').getAttribute('aria-sort')).toBeNull();
    });

    it('flips the direction of the active column', () => {
      const { onSortChange } = renderTable({
        sort: { by: 'name', dir: 'asc' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Name' }));
      expect(onSortChange).toHaveBeenCalledWith({ by: 'name', dir: 'desc' });
    });

    it('starts another column ascending', () => {
      const { onSortChange } = renderTable({
        sort: { by: 'name', dir: 'desc' },
      });
      fireEvent.click(screen.getByRole('button', { name: 'Type' }));
      expect(onSortChange).toHaveBeenCalledWith({ by: 'type', dir: 'asc' });
    });

    it('leaves columns without a sort field as plain headers', () => {
      renderTable();
      expect(within(columnHeader('Actions')).queryByRole('button')).toBeNull();
    });

    it('renders no sort controls without a handler', () => {
      renderTable({ onSortChange: undefined });
      expect(within(columnHeader('Name')).queryByRole('button')).toBeNull();
    });

    it.each([
      [undefined, 'name', { by: 'name', dir: 'asc' }],
      [{ by: 'name', dir: 'asc' }, 'name', { by: 'name', dir: 'desc' }],
      [{ by: 'name', dir: 'desc' }, 'name', { by: 'name', dir: 'asc' }],
      [{ by: 'type', dir: 'desc' }, 'name', { by: 'name', dir: 'asc' }],
    ] as const)('nextSort(%o, %s) is %o', (current, by, expected) => {
      expect(nextSort<SortKey>(current, by)).toEqual(expected);
    });
  });

  describe('pagination', () => {
    it('shows the range on a 1-based page', () => {
      renderTable({ page: 2 });
      expect(screen.getByText('6–10 of 12')).toBeTruthy();
    });

    it('reports page changes 1-based', () => {
      const { onPageChange } = renderTable({ page: 2 });
      fireEvent.click(screen.getByRole('button', { name: /next page/i }));
      expect(onPageChange).toHaveBeenCalledWith(3);
      fireEvent.click(screen.getByRole('button', { name: /previous page/i }));
      expect(onPageChange).toHaveBeenCalledWith(1);
    });

    it('reports a new page size', () => {
      const { onPageSizeChange } = renderTable();
      fireEvent.change(
        screen.getByRole('combobox', { name: 'Rows per page' }),
        {
          target: { value: '10' },
        },
      );
      expect(onPageSizeChange).toHaveBeenCalledWith(10);
    });

    it('stays on the last page when the total shrinks under it', () => {
      // Page 3 of 12 rows, after deletes left only 6: show page 2.
      renderTable({ page: 3, total: 6 });
      expect(screen.getByText('6–6 of 6')).toBeTruthy();
    });
  });

  describe('loading and errors', () => {
    it('marks the table busy while loading', () => {
      renderTable({ loading: true });
      expect(
        screen
          .getByRole('table', { name: 'Machines' })
          .getAttribute('aria-busy'),
      ).toBe('true');
      expect(
        screen.getByRole('progressbar', { name: 'Loading Machines' }),
      ).toBeTruthy();
    });

    it('does not claim "no records" while the first page loads', () => {
      renderTable({ rows: [], total: 0, loading: true });
      expect(screen.queryByText('No records found.')).toBeNull();
    });

    it('announces an error and offers a retry', () => {
      const onRetry = vi.fn();
      renderTable({ error: 'Could not load machines', onRetry });
      expect(screen.getByRole('alert').textContent).toContain(
        'Could not load machines',
      );
      fireEvent.click(screen.getByRole('button', { name: 'Retry' }));
      expect(onRetry).toHaveBeenCalled();
    });
  });
});
