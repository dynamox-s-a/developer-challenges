import { FC } from "react";
import { Box, CircularProgress } from "@mui/material";

const LoadingContent: FC = () => {
  return (
    <Box
      sx={{
        alignItems: "center",
        display: "flex",
        flex: "1 1 auto",
        justifyContent: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default LoadingContent;
