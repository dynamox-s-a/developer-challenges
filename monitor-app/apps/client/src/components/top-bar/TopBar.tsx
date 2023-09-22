import { AppBar, Box, BoxProps, Toolbar, Typography } from '@mui/material'
import IconButton from '@mui/material/IconButton'
import MenuIcon from '@mui/icons-material/Menu'
import AccountPopover from './AccountPopover'
import { styled } from '@mui/material/styles'

const StyledBox = styled(Box)<BoxProps>({
  display: 'flex',
  flex: 1,
  alignItems: 'center'
})

type TopBarProps = {
  isLgUp: boolean
  handleDrawerToggle: () => void
}

export default function TopBar({ isLgUp, handleDrawerToggle }: TopBarProps) {
  return (
    <AppBar position="sticky" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
      <Toolbar>
        <StyledBox>
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
        </StyledBox>
        <AccountPopover />
      </Toolbar>
    </AppBar>
  )
}
