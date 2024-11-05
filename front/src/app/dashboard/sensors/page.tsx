'use client'

import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';

import { CustomersTable } from '@/components/dashboard/assets/customers-table';
import { AddAssetModal } from '@/components/dashboard/assets/add-asset-modal';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { RootState } from '@/store/store';
import { addAsset, deleteAsset, fetchAssets } from '@/store/assetsSlice';
import { SensorTable } from '@/components/dashboard/sensors/sensor-table';
import { fetchSensors } from '@/store/sensorSlice';

const SensorPage = () => {
  const dispatch = useAppDispatch();
  const sensors = useAppSelector((state: RootState) => state.sensors.sensors);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  React.useEffect(() => {
    dispatch(fetchSensors());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
    <Stack spacing={3}>
            <Stack direction="row" spacing={3}>
        <Stack spacing={1} sx={{ flex: '1 1 auto' }}>
        <Typography variant="h4">Sensors</Typography>
        </Stack>
        <Stack>
          <Button startIcon={<PlusIcon fontSize="var(--icon-fontSize-md)" />}
            variant="contained"
            onClick={handleOpenModal}
          >
            Add
          </Button>
        </Stack>
      </Stack>
      <SensorTable sensors={sensors} onDelete={handleDelete} />
    </Stack>
  );
};

export default SensorPage;
