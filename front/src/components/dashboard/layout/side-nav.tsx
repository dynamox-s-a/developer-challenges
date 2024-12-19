'use client';

import * as React from 'react';
import RouterLink from 'next/link';
import { usePathname } from 'next/navigation';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import { ArrowSquareUpRight as ArrowSquareUpRightIcon } from '@phosphor-icons/react/dist/ssr/ArrowSquareUpRight';
import { CaretUpDown as CaretUpDownIcon } from '@phosphor-icons/react/dist/ssr/CaretUpDown';

import type { NavItemConfig } from '@/types/nav';
import { paths } from '@/paths';
import { isNavItemActive } from '@/lib/is-nav-item-active';
import { Logo } from '@/components/core/logo';

import { navItems } from './config';
import { navIcons } from './nav-icons';

/**
 * Renders the side navigation component.
 * @returns {React.JSX.Element} The side navigation element.
 */
export function SideNav(): React.JSX.Element {
  const pathname = usePathname();

  return (
    <Box
      sx={{
        '--SideNav-background': 'var(--mui-palette-neutral-950)',
        '--SideNav-color': 'var(--mui-palette-common-white)',
        '--NavItem-color': 'var(--mui-palette-neutral-300)',
        '--NavItem-hover-background': 'rgba(255, 255, 255, 0.04)',
        '--NavItem-active-background': 'var(--mui-palette-primary-main)',
        '--NavItem-active-color': 'var(--mui-palette-primary-contrastText)',
        '--NavItem-disabled-color': 'var(--mui-palette-neutral-500)',
        '--NavItem-icon-color': 'var(--mui-palette-neutral-400)',
        '--NavItem-icon-active-color': 'var(--mui-palette-primary-contrastText)',
        '--NavItem-icon-disabled-color': 'var(--mui-palette-neutral-600)',
        bgcolor: 'var(--SideNav-background)',
        color: 'var(--SideNav-color)',
        display: { xs: 'none', lg: 'flex' },
        flexDirection: 'column',
        height: '100%',
        position: 'fixed',
        width: 'var(--SideNav-width)',
        zIndex: 'var(--SideNav-zIndex)',
        '&::-webkit-scrollbar': { display: 'none' },
      }}
    >
      <Stack spacing={2} sx={{ p: 3 }}>
        <Box component={RouterLink} href={paths.home} sx={{ display: 'inline-flex' }}>
          <Logo color="light" height={42} width={190} />
        </Box>
      </Stack>
      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />
      <Box component="nav" sx={{ flex: '1 1 auto', p: '12px' }}>
        <NavItemsRenderer pathname={pathname} items={navItems} />
      </Box>
      <Divider sx={{ borderColor: 'var(--mui-palette-neutral-700)' }} />
    </Box>
  );
}

/**
 * Renders a list of navigation items.
 * @param {Object} props - The props object.
 * @param {NavItemConfig[]} props.items - List of navigation items.
 * @param {string} props.pathname - The current pathname.
 * @returns {React.JSX.Element} A list of navigation items.
 */
function NavItemsRenderer({items = [], pathname}: {
  items?: NavItemConfig[];
  pathname: string;
}): React.JSX.Element {
  return (
    <Stack component="ul" spacing={1} sx={{ listStyle: 'none', m: 0, p: 0 }}>
      {items.map((item) => (
        <NavItem key={item.key} pathname={pathname} {...item} />
      ))}
    </Stack>
  );
}

/**
 * Props for the NavItem component.
 */
interface NavItemProps extends Omit<NavItemConfig, 'items'> {
  pathname: string;
}

/**
 * Renders a single navigation item.
 * @param {NavItemProps} props - The props for the NavItem.
 * @returns {React.JSX.Element} A single navigation item element.
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
  const active = isNavItemActive({ disabled, external, href, matcher, pathname });
  const Icon = icon ? navIcons[icon] : null;

  return (
    <li>
      <Box
        component={href ? (external ? 'a' : RouterLink) : 'button'}
        href={href}
        target={external ? '_blank' : undefined}
        rel={external ? 'noreferrer' : undefined}
        role={!href ? 'button' : undefined}
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          color: disabled
            ? 'var(--NavItem-disabled-color)'
            : active
            ? 'var(--NavItem-active-color)'
            : 'var(--NavItem-color)',
          cursor: disabled ? 'not-allowed' : 'pointer',
          display: 'flex',
          gap: 1,
          p: '6px 16px',
          textDecoration: 'none',
          whiteSpace: 'nowrap',
          bgcolor: active
            ? 'var(--NavItem-active-background)'
            : undefined,
        }}
      >
        {Icon && (
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Icon
              fill={active ? 'var(--NavItem-icon-active-color)' : 'var(--NavItem-icon-color)'}
              fontSize="var(--icon-fontSize-md)"
              weight={active ? 'fill' : undefined}
            />
          </Box>
        )}
        <Typography
          component="span"
          sx={{
            fontSize: '0.875rem',
            fontWeight: 500,
            lineHeight: '28px',
            color: 'inherit',
          }}
        >
          {title}
        </Typography>
      </Box>
    </li>
  );
}