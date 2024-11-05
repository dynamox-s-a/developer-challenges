'use client'

import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { CustomersTable } from '@/components/dashboard/customer/customers-table';
import { AddAssetModal } from '@/components/dashboard/customer/add-asset-modal';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { RootState } from '@/store/store';
import { addAsset, deleteAsset, fetchAssets } from '@/store/assetsSlice';

export default function Page(): React.JSX.Element {
  const dispatch = useAppDispatch();
  const { assets, status } = useAppSelector((state: RootState) => state.assets);
  const [isModalOpen, setIsModalOpen] = useState(false);
  useEffect(() => {
    if (status === 'idle') {
      dispatch(fetchAssets());
    }
  }, [dispatch, status]);

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSaveAsset = (name: string, type: string) => {
    dispatch(addAsset({ name, type }));
  };

  const handleDeleteAsset = (id: string) => {
    dispatch(deleteAsset(id));
  };

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
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={handleOpenModal}
          >
            Add
          </Button>
        </div>
      </Stack>
      <CustomersTable
        rows={assets}
        onDelete={handleDeleteAsset}
      />
      <AddAssetModal open={isModalOpen} onClose={handleCloseModal} onSave={handleSaveAsset} />
    </Stack>
  );
}
