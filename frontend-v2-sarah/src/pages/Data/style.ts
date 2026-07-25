import { Box, Paper, styled } from '@mui/material';

export const DataPageMainContainer = styled(Box)(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  minHeight: '100vh',
  padding: 0,
  boxSizing: 'border-box',
}));

export const DataPageContent = styled(Box)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2, 2, '55px', 2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3, 3, '55px', 3),
  },
}));

export const DataPageChartsContainer = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
  },
  backgroundColor: theme.palette.background.paper,
  borderRadius: 0,
  border: '1px solid',
  borderColor: theme.palette.grey[500],
}));
