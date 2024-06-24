import { Avatar, Container, Typography } from '@mui/material';
import { GppMaybeOutlined } from '@mui/icons-material';
import { Link } from 'react-router-dom';

export default function ErrorPage() {
  return (
    <Container
      component="main"
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '1rem',
      }}
    >
      <Typography component="h1" variant="h5">
        Oops!
      </Typography>

      <Avatar sx={{ m: 1, bgcolor: 'secondary.dark' }}>
        <GppMaybeOutlined />
      </Avatar>

      <p>Sorry, an unexpected error has occurred.</p>
      <Link to={'/'}>return to app</Link>
    </Container>
  );
}
