import {
  Avatar,
  Box,
  Divider,
  MenuItem,
  MenuList,
  Popover,
  Tooltip,
  Typography
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import { useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from '../../redux/hooks'

export default function AccountPopover() {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)
  // const { data: session } = useSession()
  const router = useRouter()
  const user = useAppSelector((state) => state.login)

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget)
  }

  const handleCloseUserMenu = () => {
    setAnchorElUser(null)
  }

  const handleSignOut = async () => {
    const data = await signOut({ redirect: false, callbackUrl: '/' })
    router.push(data.url)
  }

  return (
    <>
      <Tooltip title="Open Account Menu">
        <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
          <Avatar />
        </IconButton>
      </Tooltip>
      <Popover
        anchorEl={anchorElUser}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right'
        }}
        onClose={handleCloseUserMenu}
        open={Boolean(anchorElUser)}
      >
        <Box
          sx={{
            py: 1.5,
            px: 2,
            width: '200px'
          }}
        >
          <Typography variant="overline">Account</Typography>
          <Typography>{user.name}</Typography>
        </Box>
        <Divider />
        <MenuList
          disablePadding
          dense
          sx={{
            p: '8px',
            '& > *': {
              borderRadius: 1
            }
          }}
        >
          <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
        </MenuList>
      </Popover>
    </>
  )
}
