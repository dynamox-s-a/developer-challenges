import { Box } from "@mui/material";
import { PropsWithChildren } from "react";

interface ContentWrapperProps extends PropsWithChildren {
  /**
   * Largura máxima do conteúdo
   * @default 1200
   */
  maxWidth?: number;
  /**
   * Padding horizontal
   * @default 2
   */
  px?: number;
  /**
   * Se deve centralizar o conteúdo horizontalmente
   * @default true
   */
  centered?: boolean;
}

export default function ContentWrapper({
  children,
  maxWidth = 1200,
  px = 2,
  centered = true,
}: ContentWrapperProps) {
  return (
    <Box
      sx={{
        maxWidth,
        mx: centered ? "auto" : 0,
        px,
      }}
    >
      {children}
    </Box>
  );
}
