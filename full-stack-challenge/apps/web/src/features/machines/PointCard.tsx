import type { MonitoringPointSummaryDto } from '@dynapredict/shared-types';
import SensorsOff from '@mui/icons-material/SensorsOff';
import ShowChart from '@mui/icons-material/ShowChart';
import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

interface PointCardProps {
  point: MonitoringPointSummaryDto;
  onRename: () => void;
  onDelete: () => void;
  onAddSensor: () => void;
  onRemoveSensor: () => void;
}

/**
 * One monitoring point and its sensor. Buttons keep their visible text and
 * add the point name to their accessible name, so "Delete" is unambiguous
 * among several cards.
 */
export function PointCard({
  point,
  onRename,
  onDelete,
  onAddSensor,
  onRemoveSensor,
}: PointCardProps) {
  const { sensor } = point;
  const button = { size: 'small', sx: { minHeight: 44 } } as const;

  return (
    <Card variant="outlined" component="article" sx={{ height: '100%' }}>
      <CardContent sx={{ pb: 1 }}>
        <Typography
          component="h3"
          variant="h6"
          sx={{ wordBreak: 'break-word' }}
        >
          {point.name}
        </Typography>
        {sensor ? (
          <Box
            component="dl"
            sx={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              columnGap: 2,
              rowGap: 0.5,
              m: 0,
              mt: 1,
              '& dt': { color: 'text.secondary' },
              '& dd': { m: 0, wordBreak: 'break-all' },
            }}
          >
            <dt>Sensor</dt>
            <dd>{sensor.model}</dd>
            <dt>Serial</dt>
            <dd>{sensor.serialNumber}</dd>
          </Box>
        ) : (
          <Stack
            direction="row"
            spacing={1}
            sx={{ mt: 1, alignItems: 'center', color: 'text.secondary' }}
          >
            <SensorsOff fontSize="small" aria-hidden />
            <Typography variant="body2">No sensor attached</Typography>
          </Stack>
        )}
      </CardContent>
      <CardActions sx={{ flexWrap: 'wrap', gap: 0.5, px: 1.5, pb: 1.5 }}>
        {sensor ? (
          <>
            <Button
              {...button}
              component={RouterLink}
              to={`/monitoring-points/${point.id}/series`}
              startIcon={<ShowChart />}
              aria-label={`Series of ${point.name}`}
            >
              Series
            </Button>
            <Button
              {...button}
              color="error"
              onClick={onRemoveSensor}
              aria-label={`Remove sensor from ${point.name}`}
            >
              Remove sensor
            </Button>
          </>
        ) : (
          <Button
            {...button}
            variant="outlined"
            onClick={onAddSensor}
            aria-label={`Add sensor to ${point.name}`}
          >
            Add sensor
          </Button>
        )}
        <Button
          {...button}
          onClick={onRename}
          aria-label={`Rename ${point.name}`}
        >
          Rename
        </Button>
        <Button
          {...button}
          color="error"
          onClick={onDelete}
          aria-label={`Delete ${point.name}`}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
}
