import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { useSelector } from 'react-redux';
import { selectUser } from '@/store/auth/auth.slice';

export function AccountInfo(): React.JSX.Element {
  const user = useSelector(selectUser);

  return (
    <Card>
      <CardContent>
        <Stack spacing={2} sx={{ alignItems: 'center' }}>
          <div>
            <Avatar sx={{ height: '80px', width: '80px' }}>
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>
          </div>
          <Stack spacing={1} sx={{ textAlign: 'center' }}>
            <Typography variant="h5">{user?.name}</Typography>
            <Typography color="text.secondary" variant="body2">
              {user?.email}
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}

