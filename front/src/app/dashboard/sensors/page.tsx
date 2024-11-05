'use client'

import React, { useEffect, useState } from 'react';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { Plus as PlusIcon } from '@phosphor-icons/react/dist/ssr/Plus';
import { useAppDispatch, useAppSelector } from '@/hooks/hooks';
import { RootState } from '@/store/store';
import { SensorTable } from '@/components/dashboard/sensors/sensor-table';
import { deleteSensor, fetchSensors, registerSensor } from '@/store/sensorSlice';
import { AddSensorModal } from '@/components/dashboard/sensors/add-sensor-modal';
import { fetchAssets } from '@/store/assetsSlice';

const SensorPage = () => {
  const dispatch = useAppDispatch();
  const sensors = useAppSelector((state: RootState) => state.sensors.sensors);
  const assets = useAppSelector((state: RootState) => state.assets.assets);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  React.useEffect(() => {
    dispatch(fetchSensors());
    dispatch(fetchAssets());
  }, [dispatch]);

  const handleDelete = (id: number) => {
    dispatch(deleteSensor(id));
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleSave = (name: string, type: string, assetId: number) => {
    dispatch(registerSensor({ name, type, assetId }));
    handleCloseModal();
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
      <AddSensorModal open={isModalOpen} onClose={handleCloseModal} onSave={handleSave} assets={assets}/>
    </Stack>
  );
};

export default SensorPage;
