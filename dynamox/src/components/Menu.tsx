import Link from "next/link";
import { Home, Logout, AccountCircle } from "@mui/icons-material";
import PrecisionManufacturingIcon from "@mui/icons-material/PrecisionManufacturing";
import DvrIcon from "@mui/icons-material/Dvr";

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
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: <AccountCircle />,
        label: "Profile",
        href: "/profile",
        visible: ["admin"],
      },
      {
        icon: <Logout />,
        label: "Logout",
        href: "/logout",
        visible: ["admin"],
      },
    ],
  },
];

const Menu = async () => {
  return (
    <div className="mt-4 text-sm">
      {menuItems.map((i) => (
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
        </div>
      ))}
    </div>
  );
};

export default Menu;
