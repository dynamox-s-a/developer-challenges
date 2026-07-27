import { Box, Paper, styled } from '@mui/material';

export const MachineSummaryBarContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
  },
  backgroundColor: theme.palette.background.paper,
  border: '1px solid',
  borderColor: theme.palette.grey[500],
}));

interface MachineSummaryBarItemProps {
  isPrimary?: boolean;
}

export const MachineSummaryBarDataLabel = styled(Box, {
  shouldForwardProp: (prop) => prop !== 'isPrimary',
})<MachineSummaryBarItemProps>(({ theme, isPrimary }) => ({
  flex: isPrimary ? '2 1 0%' : '1 1 0%',
  minWidth: isPrimary ? '130px' : '85px',
  fontSize: theme.typography.body1.fontSize,
  fontWeight: theme.typography.body1.fontWeight,
  color: theme.typography.body1.color,
  lineHeight: theme.typography.body1.lineHeight,
  textAlign: 'center',
}));
