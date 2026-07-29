import { Paper, styled } from '@mui/material';

export const PageTitleHeader = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing(3),
  },
  borderRadius: 0,
  borderBottom: '1px solid',
  borderColor: theme.palette.grey[500],
}));
