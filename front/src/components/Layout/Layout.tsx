import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Menu
} from "@mui/material"
import HomeIcon from "@mui/icons-material/Home"
import AccountCircleIcon from "@mui/icons-material/AccountCircle"
import { StyledMenuItem } from "./styles"
import { Outlet, useNavigate } from 'react-router-dom'
import { useCallback, useState } from "react"
import { useDispatch } from "react-redux"
import { clearUser } from '../../redux/userSlice'

import { useSelector } from 'react-redux'
import { UserReduxState } from "../../redux/types"

export const Layout = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const user = useSelector((state: { user: UserReduxState }) => state.user)

  const [menuAnchor, setMenuAnchor] = useState<null | HTMLElement>(null)

  const handleMenuToggle = useCallback((event: React.MouseEvent<HTMLElement>) => {
    setMenuAnchor(menuAnchor ? null : event.currentTarget)
  }, [menuAnchor])

  const onClickHome = useCallback(() => {
    navigate("/home")
  }, [navigate])

  const onClickLogout = useCallback(() => {
    dispatch(clearUser())
    navigate("/login")
  }, [dispatch, navigate])

  const onClickEditUser = useCallback(() => {
    navigate(`/users/edit/${user?.id}`)
  }, [navigate, user?.id])

  return (
    <Box sx={{ display: "flex", height: "100vh" }}>
      <AppBar position="fixed">
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton
            color="inherit"
            onClick={onClickHome}
          >
            <HomeIcon />
          </IconButton>
          <IconButton
            color="inherit"
            onClick={handleMenuToggle}
          >
            <AccountCircleIcon />
            <Menu
              anchorEl={menuAnchor}
              open={Boolean(menuAnchor)}
              onClose={handleMenuToggle}
            >
              <StyledMenuItem onClick={onClickEditUser}>
                Editar Usuário
              </StyledMenuItem>
              <StyledMenuItem onClick={onClickLogout}>
                Deslogar
              </StyledMenuItem>
            </Menu>
          </IconButton>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, marginTop: "64px", overflow: "auto" }}
      >
        <Outlet />
      </Box>
    </Box>
  )
}
