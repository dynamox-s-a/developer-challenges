import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

const NavBar = () => {
  const { data: session } = useSession();

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          MyApp
        </Typography>
        <Box>
          {session ? (
            <>
              <Link href="/private" passHref>
                <Button color="inherit">Private</Button>
              </Link>
              <Button color="inherit" onClick={() => signOut()}>
                Sign Out
              </Button>
            </>
          ) : (
            <Link href="/login" passHref>
              <Button color="inherit">Login</Button>
            </Link>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
