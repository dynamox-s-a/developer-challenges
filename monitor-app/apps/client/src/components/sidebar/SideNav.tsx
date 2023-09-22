import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemIconProps,
  ListItemText
} from '@mui/material'
import { styled } from '@mui/material/styles'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { sideNavItems } from './side-nav-items'

const StyledListItemIcon = styled(ListItemIcon)<ListItemIconProps>({
  minWidth: 36
})

type SideNavProps = {
  handleDrawerToggle: () => void
}

export default function SideNav(props: SideNavProps) {
  const { handleDrawerToggle } = props

  const pathname = usePathname()
  return (
    <Box>
      <List>
        {sideNavItems.map((item) => {
          return (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                LinkComponent={Link}
                href={item.link}
                selected={item.link === pathname ? true : false}
                onClick={handleDrawerToggle}
              >
                <StyledListItemIcon>{item.icon}</StyledListItemIcon>
                <ListItemText primary={item.text} primaryTypographyProps={{ fontWeight: 600 }} />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
      <Divider />
    </Box>
  )
}
