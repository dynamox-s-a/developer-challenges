import { Stack, Button, Typography } from '@mui/material';
import { useState, useCallback } from 'react';

import { Machine as MachineModelType } from 'store/features/machines-slice';
import CreateMonitoringPointDialog from 'components/monitoring-point/create-monitoring-point-dialog';
import { MachineType, SensorModel } from 'utils/constants';

import EditMachineDialog from '../edit-machine-dialog';
import DeleteMachineWarningDialog from '../delete-machine-warning-dialog';
import DeleteMachineDialog from '../delete-machine-dialog';

type MachineProps = {
  machine: MachineModelType;
};

const Machine = ({
  machine: { id, name, type, monitoringPoints },
}: MachineProps) => {
  const [isEditMachineDialogOpen, setEditMachineDialogOpen] = useState(false);
  const [
    isCreateMonitoringPointDialogOpen,
    setCreateMonitoringPointDialogOpen,
  ] = useState(false);
  const [isDeleteMachineWarningDialogOpen, setDeleteMachineWarningDialogOpen] =
    useState(false);
  const [isDeleteMachineDialogOpen, setDeleteMachineDialogOpen] =
    useState(false);

  const onToggleEditMachineDialog = useCallback(() => {
    setEditMachineDialogOpen((prevState) => !prevState);
  }, [setEditMachineDialogOpen]);

  const onToggleCreateMonitoringPointDialog = useCallback(() => {
    setCreateMonitoringPointDialogOpen((prevState) => !prevState);
  }, []);

  const onToggleDeleteWarningDialog = useCallback(() => {
    setDeleteMachineWarningDialogOpen((prevState) => !prevState);
  }, []);

  const onToggleDeleteMachineDialog = useCallback(() => {
    setDeleteMachineDialogOpen((prevState) => !prevState);
  }, []);

  const hasMonitoringPoints = monitoringPoints?.length;

  const shouldEditType = !(
    type === MachineType.Fan &&
    monitoringPoints?.some(({ sensorModel }) => sensorModel !== SensorModel.HFp)
  );

  return (
    <Stack
      direction="row"
      spacing={1}
      alignItems="start"
      sx={{ border: '1px solid black', padding: 1.2, borderRadius: 0.8 }}
    >
      <Stack direction="column" spacing={0.4} sx={{ flex: 1 }}>
        <Typography variant="body1">Machine Name: {name}</Typography>
        <Typography variant="body2">Type: {type}</Typography>
        <Typography variant="body2">
          Monitoring Points: {monitoringPoints?.length || 0}
        </Typography>
        <Button
          color="primary"
          aria-label="Edit machine"
          size="medium"
          onClick={onToggleCreateMonitoringPointDialog}
          variant="outlined"
          sx={{
            marginTop: '16px !important',
            marginRight: 'auto !important',
          }}
        >
          Add monitoring point
        </Button>
      </Stack>
      <Button
        color="primary"
        aria-label="Edit machine"
        size="medium"
        onClick={onToggleEditMachineDialog}
      >
        Edit
      </Button>
      <Button
        color="warning"
        aria-label="Remove machine"
        size="medium"
        onClick={
          hasMonitoringPoints
            ? onToggleDeleteWarningDialog
            : onToggleDeleteMachineDialog
        }
      >
        Delete
      </Button>
      {isEditMachineDialogOpen && (
        <EditMachineDialog
          handleClose={onToggleEditMachineDialog}
          id={id}
          initialState={{ name, type }}
          shouldEditType={shouldEditType}
        />
      )}
      {isCreateMonitoringPointDialogOpen && (
        <CreateMonitoringPointDialog
          handleClose={onToggleCreateMonitoringPointDialog}
          machineId={id}
          machineType={type}
        />
      )}
      {isDeleteMachineWarningDialogOpen && (
        <DeleteMachineWarningDialog handleClose={onToggleDeleteWarningDialog} />
      )}
      {isDeleteMachineDialogOpen && (
        <DeleteMachineDialog
          handleClose={onToggleDeleteMachineDialog}
          machineId={id}
        />
      )}
    </Stack>
  );
};

export default Machine;
