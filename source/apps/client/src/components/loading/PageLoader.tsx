import { StackOwnProps } from '@mui/material';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';

const PageLoader = (props: StackOwnProps) => {
  return (
    <Stack justifyContent="center" alignItems="center" height="100vh" {...props}>
      <Box width={1 / 2}>
        <LinearProgress />
      </Box>
    </Stack>
  );
};

export default PageLoader;
