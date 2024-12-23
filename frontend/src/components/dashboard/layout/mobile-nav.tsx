"use client";

import * as React from "react";
import RouterLink from "next/link";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { paths } from "@/paths";
import { isNavItemActive } from "@/lib/is-nav-item-active";
import { Logo } from "@/components/core/logo";
import { navItems } from "./config";
import { navIcons } from "./nav-icons";
import type { NavItemConfig } from "@/types/nav";
import { usePopover } from "@/hooks/use-popover";
import { UserPopover } from "./user-popover";
import { Avatar } from "@mui/material";

/**
 * Props for the MobileNav component.
 */
export interface MobileNavProps {
  onClose?: () => void;
  open?: boolean;
  items?: NavItemConfig[];
}

/**
 * Mobile navigation drawer component.
 * @param {MobileNavProps} props - The props for the MobileNav component.
 * @returns {React.JSX.Element} The rendered MobileNav component.
 */
export function MobileNav({
  open,
  onClose,
}: MobileNavProps): React.JSX.Element {
  const pathname = usePathname();
  const userPopover = usePopover<HTMLDivElement>();

  return (
    <Drawer
      PaperProps={{
        sx: {
          "--MobileNav-background": "var(--mui-palette-neutral-950)",
          "--MobileNav-color": "var(--mui-palette-common-white)",
          "--NavItem-color": "var(--mui-palette-neutral-300)",
          "--NavItem-hover-background": "rgba(255, 255, 255, 0.04)",
          "--NavItem-active-background": "var(--mui-palette-primary-main)",
          "--NavItem-active-color": "var(--mui-palette-primary-contrastText)",
          "--NavItem-disabled-color": "var(--mui-palette-neutral-500)",
          "--NavItem-icon-color": "var(--mui-palette-neutral-400)",
          "--NavItem-icon-active-color":
            "var(--mui-palette-primary-contrastText)",
          "--NavItem-icon-disabled-color": "var(--mui-palette-neutral-600)",
          bgcolor: "var(--MobileNav-background)",
          color: "var(--MobileNav-color)",
          display: "flex",
          flexDirection: "column",
          maxWidth: "100%",
          scrollbarWidth: "none",
          width: "var(--MobileNav-width)",
          zIndex: "var(--MobileNav-zIndex)",
          "&::-webkit-scrollbar": { display: "none" },
        },
      }}
      onClose={onClose}
      open={open}
    >
      <Stack spacing={2} sx={{ p: 3 }}>
        <Box
          component={RouterLink}
          href={paths.home}
          sx={{ display: "inline-flex" }}
        >
          <Logo height={32} width={122} />
        </Box>
      </Stack>
      <Divider sx={{ borderColor: "var(--mui-palette-neutral-700)" }} />
      <Box component="nav" sx={{ flex: "1 1 auto", p: "12px" }}>
        {renderNavItems({ pathname, items: navItems })}
      </Box>
      <Avatar
        onClick={userPopover.handleOpen}
        ref={userPopover.anchorRef}
        src="/broken-image.jpg"
        sx={{ cursor: "pointer", m: 2 }}
      />

      <UserPopover
        anchorEl={userPopover.anchorRef.current}
        onClose={userPopover.handleClose}
        open={userPopover.open}
      />
    </Drawer>
  );
}

/**
 * Renders a list of navigation items inside the mobile nav.
 * @param {Object} params - The params for rendering nav items.
 * @param {NavItemConfig[]} [params.items=[]] - List of navigation items.
 * @param {string} params.pathname - The current path for determining active state.
 * @returns {React.JSX.Element} The list of rendered navigation items.
 */
function renderNavItems({
  items = [],
  pathname,
}: {
  items?: NavItemConfig[];
  pathname: string;
}): React.JSX.Element {
  const children = items.reduce(
    (acc: React.ReactNode[], curr: NavItemConfig): React.ReactNode[] => {
      const { key, ...item } = curr;
      acc.push(<NavItem key={key} pathname={pathname} {...item} />);
      return acc;
    },
    [],
  );

  return (
    <Stack component="ul" spacing={1} sx={{ listStyle: "none", m: 0, p: 0 }}>
      {children}
    </Stack>
  );
}

/**
 * Props for the NavItem component.
 */
interface NavItemProps extends Omit<NavItemConfig, "items"> {
  pathname: string;
}

/**
 * Individual navigation item displayed in the mobile nav.
 * @param {NavItemProps} props - The props for the NavItem component.
 * @returns {React.JSX.Element} The rendered NavItem component.
 */
function NavItem({
  disabled,
  external,
  href,
  icon,
  matcher,
  pathname,
  title,
}: NavItemProps): React.JSX.Element {
  const active = isNavItemActive({
    disabled,
    external,
    href,
    matcher,
    pathname,
  });
  const Icon = icon ? navIcons[icon] : null;

  return (
    <li>
      <Box
        {...(href
          ? {
              component: external ? "a" : RouterLink,
              href,
              target: external ? "_blank" : undefined,
              rel: external ? "noreferrer" : undefined,
            }
          : { role: "button" })}
        sx={{
          alignItems: "center",
          borderRadius: 1,
          color: "var(--NavItem-color)",
          cursor: "pointer",
          display: "flex",
          flex: "0 0 auto",
          gap: 1,
          p: "6px 16px",
          position: "relative",
          textDecoration: "none",
          whiteSpace: "nowrap",
          ...(disabled && {
            bgcolor: "var(--NavItem-disabled-background)",
            color: "var(--NavItem-disabled-color)",
            cursor: "not-allowed",
          }),
          ...(active && {
            bgcolor: "var(--NavItem-active-background)",
            color: "var(--NavItem-active-color)",
          }),
        }}
      >
        <Box
          sx={{
            alignItems: "center",
            display: "flex",
            justifyContent: "center",
            flex: "0 0 auto",
          }}
        >
          {Icon ? (
            <Icon
              fill={
                active
                  ? "var(--NavItem-icon-active-color)"
                  : "var(--NavItem-icon-color)"
              }
              fontSize="var(--icon-fontSize-md)"
              weight={active ? "fill" : undefined}
            />
          ) : null}
        </Box>
        <Box sx={{ flex: "1 1 auto" }}>
          <Typography
            component="span"
            sx={{
              color: "inherit",
              fontSize: "0.875rem",
              fontWeight: 500,
              lineHeight: "28px",
            }}
          >
            {title}
          </Typography>
        </Box>
      </Box>
    </li>
  );
}
