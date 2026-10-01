import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router';

export function NotFoundPage() {
  return (
    <>
      <Typography variant="h5" component="h1" gutterBottom>
        Page not found
      </Typography>
      <Link component={RouterLink} to="/">
        Back to the overview
      </Link>
    </>
  );
}
