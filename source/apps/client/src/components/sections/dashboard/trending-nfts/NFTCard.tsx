import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import CardContent from '@mui/material/CardContent';
import AvatarGroup from '@mui/material/AvatarGroup';
import IconifyIcon from 'components/base/IconifyIcon';
import { NFTProps } from 'data/NFTData';

interface NFTCardProps {
  data: NFTProps;
}

const NFTCard = ({ data }: NFTCardProps) => {
  return (
    <Card sx={{ p: 2, bgcolor: 'neutral.dark', userSelect: 'none' }}>
      <Box position="relative">
        <CardMedia component="img" height="120" image={data.image} alt="nft_image" />
        <IconButton
          size="medium"
          edge="start"
          color="inherit"
          aria-label="menu"
          sx={{
            position: 'absolute',
            top: 10,
            right: 10,
            bgcolor: 'neutral.lighter',
            '&:hover': { bgcolor: 'neutral.lighter' },
          }}
        >
          <IconifyIcon icon="ic:sharp-favorite-border" sx={{ pointerEvents: 'none' }} />
        </IconButton>
      </Box>
      <CardContent sx={{ mt: 1.5 }}>
        <Stack alignItems="center" justifyContent="space-between">
          <div>
            <Typography
              component={Link}
              href={data.link}
              variant="h6"
              color="text.primary"
              display="block"
            >
              {data.title}
            </Typography>
            <Typography variant="subtitle2" color="text.disabled">
              By {data.artist}
            </Typography>
          </div>

          <AvatarGroup
            renderSurplus={(surplus) => (
              <Typography component="span" variant="body2" color="primary.main" fontWeight={700}>
                {surplus.toString()}+
              </Typography>
            )}
            total={data.totalMembers}
            sx={{ '& .MuiAvatarGroup-avatar': { height: 28, width: 28 } }}
          >
            {data.avatars.map((avatar: string, index) => (
              <Avatar key={avatar} alt="avatar" src={avatar} sx={{ zIndex: index }} />
            ))}
          </AvatarGroup>
        </Stack>

        <Stack mt={1.5} alignItems="center" justifyContent="space-between">
          <Typography variant="body2" color="primary.main" fontWeight={700}>
            Current Bid: {data.price}
          </Typography>
          <Button variant="contained" size="small" color="primary">
            Place Bid
          </Button>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default NFTCard;
