import {
  Avatar,
  Box,
  BoxProps,
  Divider,
  MenuItem,
  MenuList,
  Popover,
  Tooltip,
  Typography
} from '@mui/material'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import { useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

const StyledIconButton = styled(IconButton)<IconButtonProps>({
  padding: 0
})

const StyledBox = styled(Box)<BoxProps>(({ theme }) => ({
  padding: theme.spacing(2),
  width: 200
}))

export default function AccountPopover() {
  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null)
  const { data: session } = useSession()
  const router = useRouter()

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
        <StyledIconButton onClick={handleOpenUserMenu}>
          <Avatar />
        </StyledIconButton>
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
        <StyledBox>
          <Typography variant="overline">Account</Typography>
          <Typography>{session?.user?.name}</Typography>
        </StyledBox>
        <Divider />
        <MenuList>
          <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
        </MenuList>
      </Popover>
    </>
  )
}
