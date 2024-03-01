// import RefreshIcon from '@mui/icons-material/Refresh';
// import SearchIcon from '@mui/icons-material/Search';
import CheckIcon from '@mui/icons-material/Check';
// import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
// import IconButton from '@mui/material/IconButton';
import Paper from '@mui/material/Paper';
// import TextField from '@mui/material/TextField';
// import Toolbar from '@mui/material/Toolbar';
// import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import React from 'react';
import BasicModal from './basic-modal';

export default function Content() {
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <Paper
      sx={{
        maxWidth: 936,
        margin: 'auto',
        overflow: 'hidden',
        width: 240,
        alignItems: 'center',
      }}
    >
      {/* <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: '1px solid rgba(0, 0, 0, 0.12)' }}
      >
        <Toolbar>
          <Grid container spacing={2} alignItems="center">
            <Grid item>
              <SearchIcon color="inherit" sx={{ display: 'block' }} />
            </Grid>
            <Grid item xs>
              <TextField
                fullWidth
                placeholder="Search by email address, phone number, or user UID"
                InputProps={{
                  disableUnderline: true,
                  sx: { fontSize: 'default' },
                }}
                variant="standard"
              />
            </Grid>
            <Grid item>
              <Button variant="contained" sx={{ mr: 1 }}>
                Add user
              </Button>
              <Tooltip title="Reload">
                <IconButton>
                  <RefreshIcon color="inherit" sx={{ display: 'block' }} />
                </IconButton>
              </Tooltip>
            </Grid>
          </Grid>
        </Toolbar>
      </AppBar> */}
      <Grid container spacing={2} gap={1} alignItems="center">
        <Typography
          sx={{ my: 4, mt: 5, ml: 5 }}
          color="text.secondary"
          align="center"
        >
          Succesfully logged in!
        </Typography>

        <CheckIcon color="inherit" sx={{ display: 'block' }} />
      </Grid>
      <Button onClick={handleOpen} variant="contained" sx={{ mx: 10, my: 2 }}>
        Logout
      </Button>
      <BasicModal open={open} handleClose={handleClose} />
    </Paper>
  );
}
