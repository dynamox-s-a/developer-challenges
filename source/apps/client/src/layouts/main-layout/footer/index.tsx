import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

const Footer = () => {
  return (
    <Typography
      mt={0.5}
      px={1}
      py={3}
      color="text.secondary"
      variant="body2"
      sx={{ textAlign: { xs: 'center', md: 'right' } }}
      letterSpacing={0.5}
      fontWeight={500}
    >
      Made with ❤️ by{' '}
      <Link href="https://themewagon.com/" target="_blank" rel="noreferrer" fontWeight={600}>
        {'ThemeWagon'}
      </Link>
    </Typography>
  );
};

export default Footer;
