import Logo from "@assets/logo-dynamox.png";
import MenuIcon from "@mui/icons-material/Menu";
import IconButton from "@mui/material/IconButton";
import { SetStateFunction } from "../../types";
import * as St from "./styles";

interface IHeaderProps {
  openNavbar: SetStateFunction<boolean>;
}

export default function Header({ openNavbar }: IHeaderProps) {
  return (
    <St.Header>
      <IconButton onClick={() => openNavbar(true)} aria-label="menu">
        <MenuIcon
          sx={{
            color: "neutral.50",
          }}
          fontSize="large"
        />
      </IconButton>
      <St.Image src={Logo} alt="Logo" />
    </St.Header>
  );
}
