import {
  Box,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from '@mui/material'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { sideNavItems } from './side-nav-items'

export default function SideNav() {
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
              >
                <ListItemIcon sx={{ minWidth: '36px' }}>{item.icon}</ListItemIcon>
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
