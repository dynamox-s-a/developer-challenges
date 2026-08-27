import { Box, Stack, Typography } from '@mui/material';
import type { ReactNode } from 'react';

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export function PageHeader({ title, subtitle, actions }: PageHeaderProps) {
  return (
    <Box
      display="flex"
      justifyContent="space-between"
      alignItems="center"
      gap={2}
      flexWrap="wrap"
    >
      <Stack spacing={0.5}>
        <Typography variant="h4">{title}</Typography>
        {subtitle ? (
          <Typography variant="body2" color="text.secondary">
            {subtitle}
          </Typography>
        ) : null}
      </Stack>
      {actions}
    </Box>
  );
}
