import { Typography, Link } from '@mui/material';

export default function MyCopyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {'Copyright © '}
      <Link color="inherit" href="https://gabrielrodriguesleite.github.io/">
        gabrielrodriguesleite.com
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}
