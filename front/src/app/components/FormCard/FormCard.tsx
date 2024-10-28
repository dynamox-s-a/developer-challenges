import { ReactNode } from "react";
import {
  Box,
  BoxProps,
  Card,
  Grid,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import { usePathname, useRouter } from "next/navigation";
import ConfirmButton from "../ActionButtons/ConfirmButton";
import CancelButton from "../ActionButtons/CancelButton";

export type FormCardProps = {
  children: ReactNode;
  functionCancel?: (...args: any[]) => any;
  functionConfirm?: (...args: any[]) => any;
  topContent?: string;
} & BoxProps;

const FormCard = ({
  children,
  functionConfirm = () => {},
  functionCancel = () => {},
  topContent,
  ...props
}: FormCardProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useTheme();
  const isXs = useMediaQuery(theme.breakpoints.only("xs"));

  return (
    <Box sx={{ padding: 2, mr: { xs: 0, lg: 5 }, mt: { xs: 5, lg: 0 } }}>
      <Card
        sx={{
          position: "relative",
          height: "100%",
          bgcolor: "background.paper",
          borderRadius: "4px",
        }}
      >
        <Grid container height={{ xs: 80, sm: 40 }}>
          <Grid item container height={"100%"} xs={8} sm={9} md={10}>
            <Box sx={{ p: 2, pl: 0, ml: 2 }}>
              <Typography
                sx={{ width: "100%", mb: isXs ? "5px" : "10px" }}
                variant={"h6"}
              >
                {topContent}
              </Typography>
            </Box>
          </Grid>
          <Grid item container height={"100%"} xs={4} sm={3} md={2}>
            <Box sx={{ marginLeft: "auto", p: 1, pl: 0, pb: 6 }}>
              <ConfirmButton onClick={functionConfirm} />
              <CancelButton
                onClick={() => {
                  if (parseFloat(pathname.split("/").pop() || "")) {
                    router.push(
                      pathname
                        .split("/")
                        .slice(0, pathname.split("/").length - 2)
                        .join("/")
                    );
                  } else {
                    router.push(
                      pathname
                        .split("/")
                        .slice(0, pathname.split("/").length - 1)
                        .join("/")
                    );
                  }
                  functionCancel();
                }}
              />
            </Box>
          </Grid>
        </Grid>
        <Box
          width={"100%"}
          padding={0}
          minHeight={{
            xs: "calc(40dvh - 20px)",
            sm: "calc(80dvh - 20px)",
            md: "calc(87dvh - 20px)",
          }}
          height={"auto"}
          pb={8}
          {...props}
        >
          {children}
        </Box>
      </Card>
    </Box>
  );
};

export default FormCard;
