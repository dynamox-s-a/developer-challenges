import { Add, Tune as Filter, Sort } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";

const ButtonStack = () => {
  return (
    <Stack direction="row" spacing={2}>
      <Button variant="contained">
        <Filter />
      </Button>

      <Button variant="contained">
        <Sort />
      </Button>

      <Button variant="contained">
        <Add />
      </Button>
    </Stack>
  );
};

export default ButtonStack;
