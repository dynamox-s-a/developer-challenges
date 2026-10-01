import LogoutIcon from '@mui/icons-material/Logout';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useNavigate } from 'react-router';
import { logout } from '../features/session/session-slice';
import { useAppDispatch, useAppSelector } from '../store/hooks';

/**
 * Who is logged in, and the way out. On narrow screens the email is hidden and the button
 * shrinks to its icon, keeping the same accessible name, so the bar stays on one line.
 */
export function UserMenu() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const email = useAppSelector((state) => state.session.user?.email);
  const isWide = useMediaQuery(useTheme().breakpoints.up('sm'));

  const onLogout = async () => {
    await dispatch(logout());
    navigate('/login', { replace: true });
  };

  if (!isWide) {
    return (
      <IconButton color="inherit" aria-label="Log out" onClick={() => void onLogout()}>
        <LogoutIcon />
      </IconButton>
    );
  }
  return (
    <>
      <Typography variant="body2" component="span" sx={{ mx: 2 }}>
        {email}
      </Typography>
      <Button color="inherit" startIcon={<LogoutIcon />} onClick={() => void onLogout()}>
        Log out
      </Button>
    </>
  );
}
