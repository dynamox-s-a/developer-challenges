import { Box, Typography } from "@mui/material";
import { ReactNode } from "react";

interface PageHeaderProps {
  /**
   * Título da página
   */
  title: string;
  /**
   * Variant do Typography para o título
   * @default "h4"
   */
  titleVariant?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  /**
   * Cor do título
   * @default "primary"
   */
  titleColor?: string;
  /**
   * Ação do lado direito (ex: botão, menu)
   */
  action?: ReactNode;
  /**
   * Margin bottom
   * @default 3
   */
  mb?: number;
  /**
   * Se deve exibir em linha (flex row) ou coluna
   * @default true
   */
  inline?: boolean;
  /**
   * Gap entre título e ação quando inline
   * @default 2
   */
  gap?: number;
}

export default function PageHeader({
  title,
  titleVariant = "h4",
  titleColor = "primary",
  action,
  mb = 3,
  inline = true,
  gap = 2,
}: PageHeaderProps) {
  if (!inline) {
    return (
      <Box sx={{ mb }}>
        <Typography
          variant={titleVariant}
          color={titleColor}
          sx={{ mb: action ? 2 : 0 }}
        >
          {title}
        </Typography>
        {action && <Box>{action}</Box>}
      </Box>
    );
  }

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        mb,
        gap,
        flexWrap: "wrap",
      }}
    >
      <Typography variant={titleVariant} color={titleColor}>
        {title}
      </Typography>
      {action && <Box>{action}</Box>}
    </Box>
  );
}
