import { Tune as Filter, Sort } from "@mui/icons-material";
import { Button, Stack } from "@mui/material";
import FormModal from "./FormModal";

const ButtonStack = () => {
  return (
    <Stack direction="row" spacing={2}>
      <Button variant="contained" sx={{ minWidth: 0, padding: 1 }}>
        <Filter />
      </Button>

      <Button variant="contained" sx={{ minWidth: 0, padding: 1 }}>
        <Sort />
      </Button>

      <FormModal table="machine" type="create" />
    </Stack>
  );
};

export default ButtonStack;
