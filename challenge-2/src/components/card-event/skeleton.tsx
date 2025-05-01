import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Skeleton from '@mui/material/Skeleton';
import Box from '@mui/material/Box';

export function CardEventSkeleton() {
  return (
    <Card sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      bgcolor: 'background.paper'
    }}>
      <Skeleton 
        variant="rectangular" 
        height={200}
        animation="wave"
      />
      <CardContent sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        gap: 1
      }}>
        <Skeleton 
          variant="text" 
          width="80%" 
          height={32}
          animation="wave"
        />
        <Box sx={{ flexGrow: 1 }}>
          <Skeleton 
            variant="text" 
            width="100%" 
            animation="wave"
          />
          <Skeleton 
            variant="text" 
            width="90%" 
            animation="wave"
          />
          <Skeleton 
            variant="text" 
            width="95%" 
            animation="wave"
          />
        </Box>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 1,
          mt: 'auto'
        }}>
          <Skeleton 
            variant="circular" 
            width={20} 
            height={20}
            animation="wave"
          />
          <Skeleton 
            variant="text" 
            width={120}
            animation="wave"
          />
        </Box>
      </CardContent>
    </Card>
  );
}
