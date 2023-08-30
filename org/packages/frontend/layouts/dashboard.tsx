import { useCallback, useEffect, useState, ReactElement } from 'react';
import { usePathname } from 'next/navigation';
import { styled } from '@mui/material/styles';
import { useMediaQuery, Theme } from '@mui/material';

import { SideNav } from 'components/navbar';
import { Header } from 'components/header';

const SIDE_NAV_WIDTH = 280;

const LayoutRoot = styled('div')(({ theme }) => ({
  display: 'flex',
  flex: '1 1 auto',
  maxWidth: '100%',
  [theme.breakpoints.up('lg')]: {
    paddingLeft: SIDE_NAV_WIDTH,
  },
}));

const LayoutContainer = styled('div')({
  display: 'flex',
  flex: '1 1 auto',
  flexDirection: 'column',
  width: '100%',
});

export const Layout = ({ children }: { children: ReactElement }) => {
  const pathname = usePathname();
  const [openNav, setOpenNav] = useState(false);

  const lgUp = useMediaQuery((theme: Theme) => theme.breakpoints.up('lg'));

  const handlePathnameChange = useCallback(() => {
    if (openNav) {
      setOpenNav(false);
    }
  }, [openNav]);

  useEffect(
    () => {
      handlePathnameChange();
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pathname]
  );

  return (
    <>
      {!lgUp && <Header onNavOpen={() => setOpenNav(true)} />}
      <SideNav onClose={() => setOpenNav(false)} open={openNav} />
      <LayoutRoot>
        <LayoutContainer>{children}</LayoutContainer>
      </LayoutRoot>
    </>
  );
};

export default Layout;
