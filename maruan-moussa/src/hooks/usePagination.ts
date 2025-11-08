import { useMemo, useState } from "react";

type PaginationParams<T> =
  | T[] 
  | { data: T[]; itemsPerPage?: number };

export function usePagination<T>(
  input: PaginationParams<T>,
  itemsPerPageParam?: number
) {
  const data = Array.isArray(input) ? input : input.data;
  const itemsPerPage = Array.isArray(input)
    ? itemsPerPageParam ?? 10
    : input.itemsPerPage ?? 10;

  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return data.slice(startIndex, startIndex + itemsPerPage);
  }, [data, currentPage, itemsPerPage]);

  const nextPage = () => setCurrentPage((p) => Math.min(p + 1, totalPages));
  const prevPage = () => setCurrentPage((p) => Math.max(p - 1, 1));
  const handlePageChange = (page: number) =>
    setCurrentPage(Math.min(Math.max(page, 1), totalPages));
  const resetPage = () => setCurrentPage(1);

  return {
    paginatedData,
    currentPage,
    totalPages,
    nextPage,
    prevPage,
    handlePageChange,
    resetPage,
    isFirstPage: currentPage === 1,
    isLastPage: currentPage === totalPages,
  };
}
