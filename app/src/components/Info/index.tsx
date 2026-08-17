import type { ReactNode } from 'react';
import { Stack, Typography } from '@mui/material';

type InfoProps = {
  icon: ReactNode;
  text: string;
};

export default function Info({ icon, text }: InfoProps) {
  return (
    <Stack direction="row" spacing={1} justifyContent="center" sx={{ width: '100%' }}>
      {icon}
      <Typography variant="body2" color="text.secondary" sx={{ pt: 0.25 }}>
        {text}
      </Typography>
    </Stack>
  );
}
