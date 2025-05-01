import Paper from '@mui/material/Paper';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';
import { alpha, useTheme } from '@mui/material';

export function CardEventSkeleton() {
  const theme = useTheme();

  return (
    <Paper
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        p: 3,
        position: 'relative',
        overflow: 'hidden',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.05)} 100%)`,
      }}
    >
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Skeleton
          variant="text"
          width="80%"
          height={40}
          sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
        />
        <Skeleton
          variant="circular"
          width={24}
          height={24}
          sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
        />
      </Box>

      <Box sx={{ mb: 'auto' }}>
        <Skeleton
          variant="text"
          width="100%"
          sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
        />
        <Skeleton
          variant="text"
          width="90%"
          sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
        />
        <Skeleton
          variant="text"
          width="95%"
          sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
        />
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 3 }}>
        <Skeleton
          variant="circular"
          width={20}
          height={20}
          sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
        />
        <Skeleton
          variant="text"
          width={120}
          sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}
        />
      </Box>
    </Paper>
  );
}
