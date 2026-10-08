import {
  MAX_PREDICTION_HORIZON,
  MAX_PREDICTION_WINDOW,
  type PredictionMethod,
} from '@dynapredict/shared-types';
import { Alert, Button, Stack, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '../../app/hooks';
import { FormSelect, FormTextField } from '../../components/FormFields';
import { pluralize } from '../../utils/format';
import {
  loadPrediction,
  predictionQueryChanged,
  selectSensorReadings,
} from './readingsSlice';

export const METHOD_LABELS: Record<PredictionMethod, string> = {
  movingAverage: 'Moving average',
  linearRegression: 'Linear regression',
};

const METHOD_OPTIONS = Object.entries(METHOD_LABELS).map(([value, label]) => ({
  value,
  label,
}));

interface FormValues {
  method: PredictionMethod;
  window: string;
  horizon: string;
}

function integerBetween(min: number, max: number, label: string) {
  return (value: string) => {
    const n = Number(value);
    return (
      (Number.isInteger(n) && n >= min && n <= max) ||
      `${label} must be a whole number from ${min} to ${max}`
    );
  };
}

/** Method, window and horizon of the forecast drawn after the series. */
export function PredictionControls({ sensorId }: { sensorId: string }) {
  const dispatch = useAppDispatch();
  const { predictionQuery, prediction, predictionStatus, predictionError } =
    useAppSelector((state) => selectSensorReadings(state, sensorId));
  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      method: predictionQuery.method,
      window: String(predictionQuery.window),
      horizon: String(predictionQuery.horizon),
    },
  });

  useEffect(() => {
    reset({
      method: predictionQuery.method,
      window: String(predictionQuery.window),
      horizon: String(predictionQuery.horizon),
    });
  }, [predictionQuery, reset]);

  const apply = handleSubmit(({ method, window, horizon }) => {
    dispatch(
      predictionQueryChanged({
        sensorId,
        query: { method, window: Number(window), horizon: Number(horizon) },
      }),
    );
    void dispatch(loadPrediction(sensorId));
  });

  return (
    <Stack spacing={2}>
      <Stack
        component="form"
        aria-label="Forecast settings"
        noValidate
        onSubmit={apply}
        direction={{ xs: 'column', sm: 'row' }}
        spacing={1.5}
        sx={{ alignItems: { sm: 'flex-start' } }}
      >
        <FormSelect
          control={control}
          name="method"
          label="Method"
          size="small"
          options={METHOD_OPTIONS}
          helperText=" "
        />
        <FormTextField
          control={control}
          name="window"
          label="Window (readings)"
          type="number"
          size="small"
          inputProps={{ min: 2, max: MAX_PREDICTION_WINDOW, step: 1 }}
          helperText="How many recent readings it uses"
          rules={{
            validate: integerBetween(2, MAX_PREDICTION_WINDOW, 'Window'),
          }}
        />
        <FormTextField
          control={control}
          name="horizon"
          label="Horizon (points)"
          type="number"
          size="small"
          inputProps={{ min: 1, max: MAX_PREDICTION_HORIZON, step: 1 }}
          helperText="How many points it forecasts"
          rules={{
            validate: integerBetween(1, MAX_PREDICTION_HORIZON, 'Horizon'),
          }}
        />
        <Button
          type="submit"
          variant="outlined"
          disabled={predictionStatus === 'loading'}
          sx={{ minHeight: 44, flexShrink: 0 }}
        >
          Update forecast
        </Button>
      </Stack>

      {predictionStatus === 'succeeded' && prediction && (
        <Typography variant="body2" color="text.secondary" role="status">
          {METHOD_LABELS[prediction.meta.method]} forecast of{' '}
          {pluralize(prediction.meta.horizon, 'point')} from the last{' '}
          {pluralize(prediction.meta.used, 'reading')}, spaced like them. A
          simple estimate: it doesn&apos;t model seasonality or uncertainty.
        </Typography>
      )}
      {predictionError?.status === 422 && (
        <Alert severity="info">
          A forecast needs at least 2 readings. Upload more data to see one.
        </Alert>
      )}
      {predictionError && predictionError.status !== 422 && (
        <Alert severity="error">
          Could not compute the forecast: {predictionError.message}
        </Alert>
      )}
    </Stack>
  );
}
