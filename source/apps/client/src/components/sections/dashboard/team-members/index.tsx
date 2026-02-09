import { teamMembersData } from 'data/teamMembersData';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import IconifyIcon from 'components/base/IconifyIcon';
import MemberCard from './MemberCard';

const TeamMembers = () => {
  return (
    <Box component={Paper} p={3} height={390}>
      <Stack alignItems="center" justifyContent="space-between">
        <Typography variant="h5">Team members</Typography>
        <Stack
          component={ButtonBase}
          alignItems="center"
          justifyContent="center"
          height={36}
          width={36}
          bgcolor="neutral.main"
          borderRadius={2.5}
        >
          <IconifyIcon icon="ic:round-add-circle" color="primary.main" fontSize="h4.fontSize" />
        </Stack>
      </Stack>

      <Box mt={3}>
        {teamMembersData.slice(0, 3).map((item) => (
          <MemberCard key={item.id} data={item} />
        ))}
      </Box>
    </Box>
  );
};

export default TeamMembers;
