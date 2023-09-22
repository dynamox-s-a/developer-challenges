import {
  Avatar,
  Box,
  BoxProps,
  Divider,
  MenuItem,
  MenuList,
  MenuListProps,
  Popover,
  Tooltip,
  Typography
} from '@mui/material'
import IconButton, { IconButtonProps } from '@mui/material/IconButton'
import { styled } from '@mui/material/styles'
import { useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { useAppSelector } from 'redux/hooks'

const StyledIconButton = styled(IconButton)<IconButtonProps>({
  padding: 0
})

const StyledBox = styled(Box)<BoxProps>({
  padding: 8,
  width: 200
})

const StyledMenuList = styled(MenuList)<MenuListProps>({
  padding: 8
})

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
          <Typography>{user.name}</Typography>
        </StyledBox>
        <Divider />
        <StyledMenuList disablePadding dense>
          <MenuItem onClick={handleSignOut}>Sign out</MenuItem>
        </StyledMenuList>
      </Popover>
    </>
  )
}
