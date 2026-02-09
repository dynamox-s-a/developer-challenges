import { TeamMemberProps } from 'data/teamMembersData';
import customShadows from 'theme/shadows';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import CardMenu from './CardMenu';

interface MemberCardProps {
  data: TeamMemberProps;
}

const MemberCard = ({ data }: MemberCardProps) => {
  return (
    <Card sx={{ mb: 2.5, py: 1.75, borderRadius: 3.5, boxShadow: customShadows[1] }}>
      <Stack alignItems="center" justifyContent="space-between">
        <Stack spacing={1.5} alignItems="center">
          <Avatar
            src={data.avatar}
            component={Link}
            href={data.link}
            sx={{
              height: 52,
              width: 52,
              bgcolor: 'primary.main',
            }}
          />
          <CardContent>
            <Typography
              component={Link}
              href={data.link}
              mb={-0.25}
              variant="body1"
              fontWeight={700}
              display="block"
              noWrap
            >
              {data.name}
            </Typography>
            <Typography mt={-0.25} variant="caption" color="text.disabled" fontWeight={400} noWrap>
              {data.role}
            </Typography>
          </CardContent>
        </Stack>

        <CardActions sx={{ mr: -1.5 }}>
          <CardMenu />
        </CardActions>
      </Stack>
    </Card>
  );
};

export default MemberCard;
