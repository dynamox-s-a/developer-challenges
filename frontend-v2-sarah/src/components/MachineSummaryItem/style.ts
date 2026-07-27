import { Box, styled, Typography } from '@mui/material';

interface MachineSummaryBarItemProps {
  isLarge?: boolean;
}

export const MachineSummaryBarDataLabel = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isLarge',
})<MachineSummaryBarItemProps>(({ theme, isLarge }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: theme.spacing(1),
  flex: isLarge ? '2 1 0%' : '1 1 0%',
  minWidth: isLarge ? '130px' : '85px',
  textAlign: 'center',
}));

export const MachineSummaryText = styled(Typography)(({ theme }) => ({
  [theme.breakpoints.down('md')]: {
    fontSize: '0.90rem',
  },
}));
