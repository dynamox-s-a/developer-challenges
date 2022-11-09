import { useEffect, useMemo } from 'react'
import { usePagination, useSortBy, useTable } from 'react-table'
import {
  FiChevronsRight,
  FiChevronRight,
  FiChevronsLeft,
  FiChevronLeft,
} from 'react-icons/fi'
import { getSort } from './contants'

export const Table = ({
  columns,
  data,
  pageCount: controlledPageCount,
  fetchData,
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    state: { pageIndex },
  } = useTable(
    {
      columns: useMemo(() => columns, [columns]),
      data: useMemo(() => data, [data]),
      manualPagination: true,
      pageCount: controlledPageCount,
      manualSortBy: true,
    },
    useSortBy,
    usePagination,
  )

  useEffect(() => {
    fetchData({ pageIndex: pageIndex + 1 })
  }, [fetchData, pageIndex])
  return (
    <section className=" overflow-auto w-full">
      <table
        {...getTableProps()}
        className="border-separate border-spa w-full h-full w-full"
        style={{
          borderSpacing: '0px 7px',
        }}
      >
        <thead className="bg-[#44142d]">
          {headerGroups.map(headerGroup => (
            <tr {...headerGroup.getHeaderGroupProps()} className="h-2rem">
              {headerGroup.headers.map(column => (
                <th
                  {...column.getHeaderProps(column.getSortByToggleProps())}
                  className="border-dark-900 text-xs p-[5px] py-[15px] text-center whitespace-pre-line break-words text-[#fff] font-bold"
                >
                  {column.render('Header')}
                  <span>
                    {getSort({
                      isSorted: column.isSorted,
                      isSortedDesc: column.isSortedDesc,
                    })}
                  </span>
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map(row => {
            prepareRow(row)
            return (
              <tr
                {...row.getRowProps()}
                className="shadow-md h-1rem bg-[#F7F7F7] text-[#021439] border-bottom-[0.2px] border-bottom-[#ffffff]"
              >
                {row.cells.map(cell => {
                  return (
                    <td
                      className="h-3rem text-xs border-dark-900 text-center p-[5px] py-[15px] font-medium"
                      {...cell.getCellProps()}
                    >
                      <div className="flex items-center justify-center">
                        {cell.render('Cell')}
                      </div>
                    </td>
                  )
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
      <div className="flex items-center">
        <button
          className="flex"
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          <FiChevronsLeft size={20} />
        </button>{' '}
        <button
          className="flex"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          <FiChevronLeft size={20} />
        </button>{' '}
        <button
          className="flex"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          <FiChevronRight size={20} />
        </button>{' '}
        <button
          className="flex"
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          <FiChevronsRight size={20} />
        </button>{' '}
        <span>
          Página{' '}
          <strong>
            {pageIndex + 1} de {pageOptions.length}
          </strong>{' '}
        </span>
      </div>
    </section>
  )
}
