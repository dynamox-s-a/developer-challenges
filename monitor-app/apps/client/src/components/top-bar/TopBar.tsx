import { AppBar, Box, Toolbar, Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import AccountPopover from './AccountPopover'

type TopBarProps = {
  isLgUp: boolean
  handleDrawerToggle: () => void
}

export default function TopBar(props: TopBarProps) {
  const { isLgUp, handleDrawerToggle } = props

  return (
    <AppBar position="sticky" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <Box sx={{ display: 'flex', flexGrow: 1, alignItems: 'center' }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: isLgUp ? 'none' : '' }}
          >
            <MenuIcon />
          </IconButton>
          {!isLgUp && (
            <Typography variant="h6" noWrap component="div">
              monitor-app
            </Typography>
          )}
        </Box>
        <Box sx={{ flexGrow: 0 }}>
          <AccountPopover />
        </Box>
      </Toolbar>
    </AppBar>
  )
}
