import { Stack } from "@mui/material";
import * as React from "react";
import Pagination from "@mui/material/Pagination";

const PaginationButton = () => {
  return (
    <Stack spacing={2} alignItems="center">
      <Pagination count={10} shape="rounded" color="primary" />
    </Stack>
  );
};

export default PaginationButton;
