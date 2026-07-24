import { Box, styled } from '@mui/material';

export const ChartContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
  },
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  border: '1px solid',
  borderColor: theme.palette.grey[500],
}));
