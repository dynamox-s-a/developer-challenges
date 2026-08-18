import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material';

type HeaderProps = {
  title?: string;
};

export default function Header({ title = 'Análise de Dados' }: HeaderProps) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        backgroundColor: '#ffffff',
        px: 2,
      }}
    >
      <Typography
        variant="h6"
        sx={{ my: 2, fontWeight: 500, fontSize: 20, color: theme.palette.primary.main }}
      >
        {title}
      </Typography>
    </Box>
  );
}
