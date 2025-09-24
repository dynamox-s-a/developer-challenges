import { Box } from "@mui/material";
import { PropsWithChildren } from "react";
import ContentWrapper from "./ContentWrapper";

interface AppContainerProps extends PropsWithChildren {
  /**
   * Cor de fundo do container
   * @default "grey.50"
   */
  backgroundColor?: string;
  /**
   * Padding vertical
   * @default 4
   */
  py?: number;
  /**
   * Altura mínima do container
   * @default "100vh"
   */
  minHeight?: string;
  /**
   * Largura máxima do conteúdo interno
   * @default 1200
   */
  maxWidth?: number;
  /**
   * Padding horizontal do conteúdo interno
   * @default 2
   */
  px?: number;
}

export default function AppContainer({
  children,
  backgroundColor = "grey.50",
  py = 4,
  minHeight = "100vh",
  maxWidth = 1200,
  px = 2,
}: AppContainerProps) {
  return (
    <Box
      sx={{
        minHeight,
        backgroundColor,
        py,
      }}
    >
      <ContentWrapper maxWidth={maxWidth} px={px}>
        {children}
      </ContentWrapper>
    </Box>
  );
}
