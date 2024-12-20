"use client";

import * as React from "react";
import RouterLink from "next/link";
import { usePathname } from "next/navigation";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { Logo } from "@/components/core/logo";
import { navItems } from "./config";
import { navIcons } from "./nav-icons";
import { paths } from "@/paths";
import { isNavItemActive } from "@/lib/is-nav-item-active";
import type { NavItemConfig } from "@/types/nav";
import { UserPopover } from "./user-popover";
import { usePopover } from "@/hooks/use-popover";
import { Avatar } from "@mui/material";

/**
 * SideNav component.
 * @returns {React.JSX.Element} - The rendered sidebar component.
 */
export function SideNav(): React.JSX.Element {
  const pathname = usePathname();
  const userPopover = usePopover<HTMLDivElement>();

  return (
    <Box
      sx={{
        "--SideNav-background": "var(--mui-palette-neutral-950)",
        "--SideNav-color": "var(--mui-palette-common-white)",
        "--NavItem-color": "var(--mui-palette-neutral-300)",
        "--NavItem-hover-background": "rgba(255, 255, 255, 0.04)",
        "--NavItem-active-background": "var(--mui-palette-primary-main)",
        "--NavItem-active-color": "var(--mui-palette-primary-contrastText)",
        "--NavItem-disabled-color": "var(--mui-palette-neutral-500)",
        "--NavItem-icon-color": "var(--mui-palette-neutral-400)",
        "--NavItem-icon-active-color":
          "var(--mui-palette-primary-contrastText)",
        "--NavItem-icon-disabled-color": "var(--mui-palette-neutral-600)",
        bgcolor: "var(--SideNav-background)",
        color: "var(--SideNav-color)",
        display: { xs: "none", lg: "flex" },
        flexDirection: "column",
        height: "100%",
        left: 0,
        maxWidth: "100%",
        position: "fixed",
        top: 0,
        width: "var(--SideNav-width)",
        zIndex: "var(--SideNav-zIndex)",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
    >
      <Stack spacing={2} sx={{ p: 3 }}>
        <Box
          component={RouterLink}
          href={paths.home}
          sx={{ display: "inline-flex" }}
        >
          <Logo height={40} width={194} />
        </Box>
      </Stack>

      <Divider sx={{ borderColor: "var(--mui-palette-neutral-700)" }} />

      <Box component="nav" sx={{ flex: "1 1 auto", p: "12px" }}>
        {renderNavItems({ pathname, items: navItems })}
      </Box>
      <Avatar
        onClick={userPopover.handleOpen}
        ref={userPopover.anchorRef}
        src="/assets/avatar.png"
        sx={{ cursor: "pointer", m: 2 }}
      />

      <UserPopover
        anchorEl={userPopover.anchorRef.current}
        onClose={userPopover.handleClose}
        open={userPopover.open}
      />
      {/* <Divider sx={{ borderColor: "var(--mui-palette-neutral-700)" }} /> */}
    </Box>
  );
}

/**
 * Renders a list of navigation items.
 * @param {Object} params - The parameters object.
 * @param {NavItemConfig[]} [params.items=[]] - An optional array of `NavItemConfig` objects that define the navigation items.
 * @param {string} params.pathname - The current pathname used to determine if a `NavItem` is active.
 * @returns {React.JSX.Element} The JSX element representing the navigation items as a list.
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
 * NavItem component representing an individual navigation item with icon and title.
 * @param {NavItemProps} props - The properties for the NavItem component.
 * @param {boolean} props.disabled - If the navigation item is disabled.
 * @param {boolean} props.external - If the navigation item is an external link.
 * @param {string} props.href - The link for the navigation item.
 * @param {React.ElementType} [props.icon] - The icon for the navigation item.
 * @param {string} [props.matcher] - The matcher to determine if the navigation item is active.
 * @param {string} props.pathname - The current pathname used to determine if the item is active.
 * @param {string} props.title - The title text for the navigation item.
 * @returns {React.JSX.Element} - The rendered navigation item.
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
          {Icon && (
            <Icon
              fill={
                active
                  ? "var(--NavItem-icon-active-color)"
                  : "var(--NavItem-icon-color)"
              }
              fontSize="var(--icon-fontSize-md)"
              weight={active ? "fill" : undefined}
            />
          )}
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

/**
 * Props for the NavItem component.
 */
interface NavItemProps extends Omit<NavItemConfig, "items"> {
  pathname: string;
}
