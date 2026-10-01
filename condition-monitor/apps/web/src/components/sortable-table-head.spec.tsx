import type { SortOrder } from '@condition-monitor/shared';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import { fireEvent, render, screen } from '@testing-library/react';
import { nextOrder, SortableTableHead } from './sortable-table-head';

type Key = 'name' | 'type';

const COLUMNS = [
  { key: 'name', label: 'Name' },
  { key: 'type', label: 'Type' },
] as const;

function renderHead(sort: Key, order: SortOrder) {
  const onSort = vi.fn();
  render(
    <Table>
      <SortableTableHead columns={COLUMNS} sort={sort} order={order} onSort={onSort}>
        <TableCell>Actions</TableCell>
      </SortableTableHead>
    </Table>,
  );
  return onSort;
}

describe('sortable table head', () => {
  it('says the direction of the sorted column only', () => {
    renderHead('name', 'desc');

    expect(screen.getByRole('columnheader', { name: 'Name' })).toHaveAttribute(
      'aria-sort',
      'descending',
    );
    expect(screen.getByRole('columnheader', { name: 'Type' })).not.toHaveAttribute('aria-sort');
  });

  it('keeps the extra cells after the sortable ones, without a sort button', () => {
    renderHead('name', 'asc');

    const headers = screen.getAllByRole('columnheader').map((header) => header.textContent);
    expect(headers).toEqual(['Name', 'Type', 'Actions']);
    expect(screen.queryByRole('button', { name: 'Actions' })).not.toBeInTheDocument();
  });

  it('asks for the opposite direction on the column sorted ascending', () => {
    const onSort = renderHead('name', 'asc');

    fireEvent.click(screen.getByRole('button', { name: 'Name' }));

    expect(onSort).toHaveBeenCalledWith('name', 'desc');
  });

  it('asks for ascending on the column sorted descending', () => {
    const onSort = renderHead('name', 'desc');

    fireEvent.click(screen.getByRole('button', { name: 'Name' }));

    expect(onSort).toHaveBeenCalledWith('name', 'asc');
  });

  it('asks for ascending on another column, whatever the current direction', () => {
    const onSort = renderHead('name', 'desc');

    fireEvent.click(screen.getByRole('button', { name: 'Type' }));

    expect(onSort).toHaveBeenCalledWith('type', 'asc');
  });

  it('computes the next direction without a component', () => {
    expect(nextOrder<Key>({ sort: 'name', order: 'asc' }, 'name')).toBe('desc');
    expect(nextOrder<Key>({ sort: 'name', order: 'desc' }, 'name')).toBe('asc');
    expect(nextOrder<Key>({ sort: 'name', order: 'asc' }, 'type')).toBe('asc');
  });
});
