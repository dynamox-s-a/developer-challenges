import { useState, useMemo } from 'react';

export const useSorting = <T extends Record<string, any>>(data: T[], initialField: keyof T) => {
  const [sortField, setSortField] = useState<keyof T>(initialField);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  const handleSort = (field: keyof T) => {
    const isAsc = sortField === field && sortOrder === 'asc';
    setSortOrder(isAsc ? 'desc' : 'asc');
    setSortField(field);
  };

  const sortedData = useMemo(() => 
    [...data].sort((a, b) => {
      const aValue = a[sortField];
      const bValue = b[sortField];
      
      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    }), [data, sortField, sortOrder]
  );

  return { sortedData, sortField, sortOrder, handleSort };
};