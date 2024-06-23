import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Typography,
} from '@mui/material';
import useAuth from '../useAuth';

export default function UserCard() {
  const auth = useAuth();
  const { logout, user } = auth!;
  const { name, email, id } = user;
  return (
    <Container
      maxWidth="xs"
      sx={{
        position: 'fixed',
        right: '1rem',
        bottom: '2rem',
      }}
    >
      <Card sx={{ minWidth: 275 }}>
        <CardContent sx={{ mb: 0, pb: 0 }}>
          <Typography sx={{ fontSize: 9 }} color="text.secondary" gutterBottom>
            User id: {id}
          </Typography>
          <Typography variant="h5" component="div">
            {name}
          </Typography>
          <Typography sx={{ mb: '1.5rem' }} color="text.secondary">
            {email}
          </Typography>
        </CardContent>
        <CardActions>
          <Button size="small" variant="outlined" onClick={logout}>
            Logout
          </Button>
        </CardActions>
      </Card>
    </Container>
  );
}
