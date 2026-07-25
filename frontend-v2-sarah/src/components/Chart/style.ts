import { Box, styled } from '@mui/material';

export const ChartWrapper = styled(Box)(({ theme }) => ({
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper,
  border: '1px solid',
  borderColor: theme.palette.grey[500],
}));

export const ChartWrapperHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2),
  [theme.breakpoints.up('sm')]: {
    padding: theme.spacing('19px', 3),
  },
  borderBottom: '1px solid',
  borderColor: theme.palette.grey[500],
}));

export const ChartContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3, 1, 1, 1),
  [theme.breakpoints.up('sm')]: {
    paddingBottom: '28px',
    paddingLeft: '21px',
    paddingRight: '31px',
  },
}));

export const ChartContent = styled(Box)(() => ({
  width: '100%',
  height: '430px',
}));
