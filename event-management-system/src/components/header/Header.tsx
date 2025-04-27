import React from "react";
import { Box, TextField, InputAdornment, IconButton } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import Image from "next/image";
import styles from "../../app/login/login.module.css";
import EventGrid from "../sortBar/SortBar";

interface HeaderProps {
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  onLogout: () => void;
}

const Header: React.FC<HeaderProps> = ({
  searchTerm,
  setSearchTerm,
  onLogout,
}) => {
  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  return (
    <Box
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 4,
        color: "white",
        backgroundColor: "#350E20",
        borderRadius: 1,
        zIndex: 2,
        marginBottom: 2,
        marginTop: 0,
        maxWidth: "1080px",
        margin: "0 auto",
        height: "80px",
      }}
    >
      <Image
        src="/logo_Dynamox 2.png"
        alt="Dynamox Logo"
        width={140}
        height={60}
        className={styles.logo}
        priority
      />

      <TextField
        placeholder="Pesquisar eventos"
        value={searchTerm}
        onChange={handleSearchChange}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon sx={{ color: "gray" }} />
            </InputAdornment>
          ),
        }}
        sx={{
          backgroundColor: "white",
          borderRadius: 1,
          width: "80%",
          margin: "0 16px",
        }}
      />

      <div>
        <IconButton
          onClick={onLogout}
          color="inherit"
          sx={{ margin: 0, padding: 0 }}
        >
          <ExitToAppIcon />
        </IconButton>
      </div>
      <EventGrid />
    </Box>
  );
};

export default Header;
