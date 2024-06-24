import { useState } from 'react';
import { PersonOutlined } from '@mui/icons-material';
import {
  Avatar,
  Box,
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
  const [showCard, setShow] = useState(true);
  return (
    <Container
      maxWidth="xs"
      sx={{
        position: 'fixed',
        bottom: '0.5rem',
        left: '2rem',
      }}
    >
      {!showCard && (
        <Button onClick={() => setShow(true)} sx={{ m: 0 }}>
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <PersonOutlined />
          </Avatar>
        </Button>
      )}
      {showCard && (
        <Card sx={{ minWidth: 275 }}>
          <CardContent sx={{ mb: 0, pb: 0 }}>
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <Typography
                sx={{ fontSize: 9 }}
                color="text.secondary"
                gutterBottom
              >
                User id: {id}
              </Typography>
              <Button
                type="button"
                sx={{ m: 0, p: 0 }}
                onClick={() => setShow(false)}
              >
                X
              </Button>
            </Box>
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
      )}
    </Container>
  );
}
