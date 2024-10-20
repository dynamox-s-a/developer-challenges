import Link from "next/link";
import { Home } from "@mui/icons-material";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import DvrIcon from "@mui/icons-material/Dvr";
import TableChartIcon from "@mui/icons-material/TableChart";
import { SignOutButton } from "@clerk/nextjs";
import { Box, Button } from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: <Home />,
        label: "Home",
        href: "/",
        visible: ["admin"],
      },
      {
        icon: <PrecisionManufacturingIcon />,
        label: "Machines",
        href: "/list/machines",
        visible: ["admin"],
      },
      {
        icon: <DvrIcon />,
        label: "Monitoring Points",
        href: "/list/monitoring-points",
        visible: ["admin"],
      },
      {
        icon: <TableChartIcon />,
        label: "All Monitoring Points",
        href: "/list/all-monitoring-points",
        visible: ["admin"],
      },
    ],
  },
];

const Menu = async () => {
  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
        <>
          <div className="flex flex-col gap-2" key={i.title}>
            <span className="hidden lg:block text-white font-light my-4">
              {i.title}
            </span>
            {i.items.map((item) => (
              <Link
                href={item.href}
                key={item.label}
                className="flex items-center justify-center lg:justify-start gap-2 text-white py-2 md:px-2 rounded-md "
              >
                <div>{item.icon}</div>
                <span className="hidden lg:block">{item.label}</span>
              </Link>
            ))}
            <SignOutButton>
              <Button
                component="label"
                role={undefined}
                variant="text"
                startIcon={<LogoutIcon />}
                sx={{
                  color: "white",
                  fontSize: {
                    xs: "0.75rem",
                    sm: "0.875rem",
                    md: "1rem",
                    lg: "1.125rem",
                  },
                }}
              >
                <Box
                  component="span"
                  sx={{
                    display: { xs: "none", lg: "block" },
                  }}
                >
                  Logout
                </Box>
              </Button>
            </SignOutButton>
          </div>
        </>
      ))}
    </div>
  );
};

export default Menu;
