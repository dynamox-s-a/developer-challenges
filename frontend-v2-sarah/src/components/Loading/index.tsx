import { CircularProgress, Box } from '@mui/material';

export const Loading = () => {
  return (
    <Box
      display="flex"
      flexGrow={1}
      justifyContent="center"
      alignItems="center"
      data-testid="loading-container"
    >
      <CircularProgress data-testid="loading-circular-progress" />
    </Box>
  );
};
