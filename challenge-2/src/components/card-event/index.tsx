import { format } from 'date-fns';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import Box from '@mui/material/Box';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { checkImageUrl } from '@/utils/image';

interface CardEventProps {
  id: number;
  title: string;
  description: string;
  date: string;
  imageUrl?: string;
}

export function CardEvent({ id, title, description, date, imageUrl }: CardEventProps) {
  const router = useRouter();
  const [validImageUrl, setValidImageUrl] = useState<string>('/fallback.jpg');
  const formattedDate = format(new Date(date), "dd/MM/yyyy 'às' HH:mm'h'");

  useEffect(() => {
    async function validateImage() {
      if (imageUrl && await checkImageUrl(imageUrl)) {
        setValidImageUrl(imageUrl);
      }
    }

    validateImage();
  }, [imageUrl]);
  
  const isPastEvent = new Date(date) < new Date();

  return (
    <Card 
      onClick={() => router.push(`/events/${id}`)}
      sx={{ 
        height: '100%', 
        display: 'flex', 
        flexDirection: 'column',
        bgcolor: 'background.paper',
        opacity: isPastEvent ? 0.7 : 1,
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'scale(1.02)',
          boxShadow: (theme) => theme.shadows[4],
          cursor: 'pointer'
        }
      }}>
      <CardMedia
        component="img"
        height="200"
        image={validImageUrl}
        alt={title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ 
        flexGrow: 1, 
        display: 'flex', 
        flexDirection: 'column',
        gap: 1
      }}>
        <Typography 
          variant="h6" 
          component="h3"
          sx={{ 
            fontWeight: 600,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {title}
        </Typography>
        <Typography 
          variant="body2" 
          color="text.secondary"
          sx={{ 
            flexGrow: 1,
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}
        >
          {description}
        </Typography>
        <Box sx={{ 
          display: 'flex', 
          alignItems: 'center',
          gap: 1,
          color: 'text.secondary',
          mt: 'auto'
        }}>
          <CalendarTodayIcon fontSize="small" />
          <Typography variant="body2">{formattedDate}</Typography>
        </Box>
      </CardContent>
    </Card>
  );
}
