import { Alert, Box, CircularProgress } from '@mui/material';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';

interface ListAwaitingLayoutProps {
  isLoading: boolean;
  error: SerializedError | FetchBaseQueryError | null;
}

export default function ListAwaitingLayout({ isLoading, error }: ListAwaitingLayoutProps) {
  if (!isLoading && !error) return null;

  if (isLoading) {
    return (
      <Box
        sx={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2 }}>
        <Alert severity="error">Failed to fetch monitoring points. Please try again later.</Alert>
      </Box>
    );
  }
}
