'use client'

import React, { useEffect } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { CustomersFilters } from '@/components/dashboard/customer/customers-filters';
import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import type { Asset } from '@/components/dashboard/customer/customers-table';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { RootState } from '@/store/store';
import { fetchAssets } from '@/store/assetsSlice';

export default function Page(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { assets, status } = useAppSelector((state: RootState) => state.assets);
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAssets());
    }
  }, [dispatch, status]);


  if (status === 'loading') {
    return <Typography variant="h6">Loading assets...</Typography>;
  }
  if (status === 'failed') {
    return <Typography variant="h6">Failed to load assets. Please reload.</Typography>;
  }

  return (
    <Stack spacing={3}>
      <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
          <Typography variant="h4">Assets</Typography>
        </Stack>
        <div>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />} variant="contained">
            Add
          </Button>
        </div>
      </Stack>
      <CustomersFilters />
      <CustomersTable
        rows={assets}
      />
    </Stack>
  );
}
