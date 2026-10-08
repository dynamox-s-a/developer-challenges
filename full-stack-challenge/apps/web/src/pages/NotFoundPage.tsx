import { Button, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

export function NotFoundPage() {
  return (
    <Stack spacing={2} sx={{ alignItems: 'flex-start' }}>
      <Typography component="h1" variant="h4">
        Page not found
      </Typography>
      <Typography color="text.secondary">
        The address you opened doesn&apos;t match any page.
      </Typography>
      <Button component={RouterLink} to="/machines" variant="contained">
        Go to machines
      </Button>
    </Stack>
  );
}

export default NotFoundPage;
