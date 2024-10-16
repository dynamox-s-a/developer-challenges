import { Search } from "@mui/icons-material";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import InputBase from "@mui/material/InputBase";

const TableSearch = () => {
  return (
    <Paper
      component="form"
      sx={{ p: "2px 4px", display: "flex", alignItems: "center", width: 300 }}
    >
      <IconButton sx={{ p: "10px" }} aria-label="menu">
        <Search />
      </IconButton>
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search Machines"
        inputProps={{ "aria-label": "search google maps" }}
      />
    </Paper>
  );
};

export default TableSearch;
