import { useState, useMemo } from "react";

interface UsePaginationOptions<T> {
  data?: T[];
  itemsPerPage?: number;
  onPageChange?: (page: number) => void;
}

export function usePagination<T>({
  data = [],
  itemsPerPage = 5,
  onPageChange,
}: UsePaginationOptions<T>) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.max(1, Math.ceil(data.length / itemsPerPage));

  const safePage = Math.min(currentPage, totalPages);

  const paginatedData = useMemo(() => {
    const start = (safePage - 1) * itemsPerPage;
    return data.slice(start, start + itemsPerPage);
  }, [data, safePage, itemsPerPage]);

  const handlePageChange = (page: number) => {
    const nextPage = Math.min(Math.max(page, 1), totalPages);
    setCurrentPage(nextPage);
    onPageChange?.(nextPage);
  };

  const nextPage = () => handlePageChange(currentPage + 1);
  const prevPage = () => handlePageChange(currentPage - 1);
  const resetPage = () => setCurrentPage(1);

  return {
    currentPage: safePage,
    totalPages,
    paginatedData,
    nextPage,
    prevPage,
    handlePageChange,
    resetPage,
    isFirstPage: safePage === 1,
    isLastPage: safePage === totalPages,
  };
}
