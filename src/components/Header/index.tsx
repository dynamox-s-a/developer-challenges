import { AppBar, Typography } from '@mui/material';

interface HeaderProps {
  title: string;
}

function Header({ title }: HeaderProps) {
  return (
    <>
      <AppBar
        position="static"
        sx={{ px: 3, py: 2, mb: 2, boxShadow: 0, border: 1, borderColor: '#DFE3E8', background: '#FFFFFF' }}
      >
        <Typography variant="h1" sx={{ fontSize: 20, fontWeight: 500, color: '#3A3B3F' }}>
          {title}
        </Typography>
      </AppBar>
    </>
  );
}

export default Header;
