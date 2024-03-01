import {
  Box,
  Card,
  Button,
  Avatar,
  Divider,
  Typography,
  CardActions,
  CardContent,
} from '@mui/material';
import { useSession } from 'next-auth/react';

export const AccountProfile = () => {
  const { data: session } = useSession();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }}
    >
      <CardContent>
        <Box
          sx={{
            alignItems: 'center',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Avatar
            src="/assets/avatars/avatar-anika-visser.png"
            sx={{
              height: 80,
              mb: 2,
              width: 80
            }}
          />
          <Typography
            gutterBottom
            variant="h5"
          >
            {session?.user?.name}
          </Typography>
        </Box>
      </CardContent>
      <Divider />
      <CardActions>
        <Button
          fullWidth
          variant="text"
        >
          Upload picture
        </Button>
      </CardActions>
    </Card>
  );
};
