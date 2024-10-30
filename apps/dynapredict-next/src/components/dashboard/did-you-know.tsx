import { Avatar, Box, Card, CardContent, Stack, Typography } from '@mui/material';
import { Lightbulb } from '@phosphor-icons/react/dist/ssr/Lightbulb';

type DidYouKnowProps = {
  message: string;
  children?: React.ReactNode;
};

export default function DidYouKnow({ message, children }: DidYouKnowProps) {
  return (
    <Card>
      <Box
        sx={{
          position: 'relative',
        }}
      >
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            right: 0,
            backgroundColor: 'var(--mui-palette-warning-main)',
            height: '56px',
            width: '56px',
            borderBottomLeftRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Lightbulb fontSize="var(--icon-fontSize-lg)" />
        </Box>
        <CardContent>
          <Stack spacing={1}>
            <Typography color="text.secondary" variant="overline">
              Did you know?
            </Typography>
            <Typography variant="subtitle1">{message}</Typography>
            {children}
          </Stack>
        </CardContent>
      </Box>
    </Card>
  );
}
