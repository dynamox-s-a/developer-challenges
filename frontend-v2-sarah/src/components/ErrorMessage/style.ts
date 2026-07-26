import { Box, styled } from '@mui/material';
import { alpha } from '@mui/material/styles';
import { ErrorOutline as ErrorOutlineIcon } from '@mui/icons-material';

export const ErrorWrapper = styled(Box)(() => ({
  display: 'flex',
  justifyContent: 'center',
  width: '100%',
}));

export const ErrorContentBox = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  alignSelf: 'flex-start',
  backgroundColor: alpha(theme.palette.error.main, 0.12),
  color: theme.palette.error.dark,
  paddingLeft: theme.spacing(3),
  paddingRight: theme.spacing(3),
  paddingTop: theme.spacing(1.5),
  paddingBottom: theme.spacing(1.5),
  borderRadius: theme.shape.borderRadius,
  width: '100%',
  lineHeight: 1.2,
}));

export const StyledErrorIcon = styled(ErrorOutlineIcon)(({ theme }) => ({
  fontSize: '1rem',
  marginRight: theme.spacing(1.5),
  color: theme.palette.error.dark,
}));

export const ErrorText = styled(Box)(({ theme }) => ({
  fontSize: theme.typography.body2.fontSize,
  fontWeight: theme.typography.fontWeightMedium,
  lineHeight: 1.2,
}));
