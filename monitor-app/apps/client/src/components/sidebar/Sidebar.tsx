import {
  Box,
  BoxProps,
  Divider,
  Drawer,
  Stack,
  StackProps,
  Typography,
  TypographyProps
} from '@mui/material'
import { styled } from '@mui/material/styles'
import SideNav from './SideNav'
import { Logo } from '../logo'

const StyledBox = styled(Stack)<BoxProps>(({ theme }) => ({
  padding: theme.spacing(3),
  marginTop: theme.spacing(8)
}))

const StyledStack = styled(Stack)<StackProps>(({ theme }) => ({
  display: 'flex',
  flexDirection: 'row',
  marginTop: theme.spacing(1),
  justifyContent: 'space-evenly'
}))

const LogoWrapperBox = styled(Box)<BoxProps>(({ theme }) => ({
  display: 'flex',
  height: 32,
  width: 32
}))

const StyledTypography = styled(Typography)<TypographyProps>(({ theme }) => ({
  fontSize: 20,
  color: theme.palette.primary.main
}))

type SideBarProps = {
  drawerWidth: number
  isLgUp: boolean
  isOpen: boolean
  handleDrawerToggle: () => void
}

export default function Sidebar(props: SideBarProps) {
  const { drawerWidth, isLgUp, isOpen, handleDrawerToggle } = props
  return (
    <Box component="nav" aria-label="navigation items" width={isLgUp ? drawerWidth : ''}>
      <Drawer
        variant={isLgUp ? 'permanent' : 'temporary'}
        open={isOpen}
        onClose={handleDrawerToggle}
        sx={{
          '& .MuiDrawer-paper': {
            borderLeft: '1px solid rgba(0, 0, 0, 0.12)',
            boxSizing: 'border-box',
            width: drawerWidth
          }
        }}
      >
        <StyledBox>
          <StyledStack>
            <LogoWrapperBox>
              <Logo />
            </LogoWrapperBox>
            <StyledTypography>
              <strong>monitor-app</strong>
            </StyledTypography>
          </StyledStack>
        </StyledBox>
        <Divider />
        <SideNav handleDrawerToggle={handleDrawerToggle} />
      </Drawer>
    </Box>
  )
}
