import { StackOwnProps } from '@mui/material';
import Stack from '@mui/material/Stack';
import CircularProgress from '@mui/material/CircularProgress';

const Progress = (props: StackOwnProps) => {
  return (
    <Stack justifyContent="center" alignItems="center" height="100vh" {...props}>
      <CircularProgress />
    </Stack>
  );
};

export default Progress;
