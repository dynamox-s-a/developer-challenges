"use client";

import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { logout } from "@/store/slices/authSlice";
import { AppBar, Toolbar, Typography, Button } from "@mui/material";
import { Logout } from "@mui/icons-material";

export default function EventsHeader() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    router.push("/login");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Eventos
        </Typography>
        <Typography variant="body1" sx={{ mr: 2 }}>
          {user?.name}
        </Typography>
        <Button color="inherit" startIcon={<Logout />} onClick={handleLogout}>
          Sair
        </Button>
      </Toolbar>
    </AppBar>
  );
}
