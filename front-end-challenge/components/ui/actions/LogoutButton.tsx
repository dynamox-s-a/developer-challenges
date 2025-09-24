import { Button } from "@mui/material";

export default function LogoutButton({ onClick }: { onClick: () => void }) {
  return (
    <Button variant="outlined" onClick={onClick}>
      Logout
    </Button>
  );
}
