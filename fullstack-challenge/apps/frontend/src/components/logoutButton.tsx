"use client"

import { Button } from "@mui/material";
import { signOut } from "next-auth/react";

export default function LogoutButton() {
  return (
    <Button type="submit" variant="contained" color="primary" size="large" onClick={() => signOut()}>
      Logout
    </Button>
  )
}