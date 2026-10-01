import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

/**
 * A centered spinner for a screen, or a part of one, that waits for the API. The label
 * says what is loading to screen readers, which see no spinner.
 */
export function LoadingIndicator({ label }: { label: string }) {
  return (
    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
      <CircularProgress aria-label={label} />
    </Box>
  );
}
