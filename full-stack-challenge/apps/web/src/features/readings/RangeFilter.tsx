import { Button, Stack, TextField } from '@mui/material';
import { type FormEvent, useEffect, useState } from 'react';
import type { TimeRange } from '../../services/readingsApi';
import { fromLocalInputValue, toLocalInputValue } from '../../utils/format';

interface RangeFilterProps {
  range: TimeRange;
  onApply: (range: TimeRange) => void;
  disabled?: boolean;
}

/**
 * The one filter row above the chart and the metrics: both follow the same
 * inclusive range. Inputs are in local time; the API gets ISO instants.
 */
export function RangeFilter({ range, onApply, disabled }: RangeFilterProps) {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [error, setError] = useState<string | null>(null);

  // Show the applied range (e.g. after Clear, or coming back to the page).
  useEffect(() => {
    setFrom(range.from ? toLocalInputValue(range.from) : '');
    setTo(range.to ? toLocalInputValue(range.to) : '');
  }, [range.from, range.to]);

  const apply = (event: FormEvent) => {
    event.preventDefault();
    if (from && to && from > to) {
      setError('"From" must not be after "To"');
      return;
    }
    setError(null);
    onApply({
      from: from ? fromLocalInputValue(from) : undefined,
      to: to ? fromLocalInputValue(to, true) : undefined,
    });
  };

  const clear = () => {
    setError(null);
    onApply({});
  };

  return (
    <Stack
      component="form"
      aria-label="Time range"
      noValidate
      onSubmit={apply}
      direction={{ xs: 'column', sm: 'row' }}
      spacing={1.5}
      sx={{ alignItems: { sm: 'flex-start' } }}
    >
      <TextField
        id="range-from"
        label="From"
        type="datetime-local"
        size="small"
        value={from}
        onChange={(event) => setFrom(event.target.value)}
        InputLabelProps={{ shrink: true }}
        error={Boolean(error)}
        helperText={error ?? ' '}
      />
      <TextField
        id="range-to"
        label="To"
        type="datetime-local"
        size="small"
        value={to}
        onChange={(event) => setTo(event.target.value)}
        InputLabelProps={{ shrink: true }}
        helperText=" "
      />
      <Stack direction="row" spacing={1}>
        <Button
          type="submit"
          variant="outlined"
          disabled={disabled}
          sx={{ minHeight: 44 }}
        >
          Apply
        </Button>
        <Button
          onClick={clear}
          disabled={disabled || (!range.from && !range.to)}
          sx={{ minHeight: 44 }}
        >
          Show all
        </Button>
      </Stack>
    </Stack>
  );
}
