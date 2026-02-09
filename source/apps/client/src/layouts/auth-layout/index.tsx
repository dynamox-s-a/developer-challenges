import { Outlet } from 'react-router-dom';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Image from 'components/base/Image';
import { theme } from 'theme/theme';

interface FooterLinksProps {
  id: number | string;
  name: string;
  link: string;
}

const footerLinks: FooterLinksProps[] = [
  {
    id: 1,
    name: 'Marketplace',
    link: '#!',
  },
  {
    id: 2,
    name: 'License',
    link: '#!',
  },
  {
    id: 3,
    name: 'Terms of Use',
    link: '#!',
  },
  {
    id: 4,
    name: 'Blog',
    link: '#!',
  },
];

const AuthLayout = () => {
  return (
    <Stack justifyContent="space-between" height="100vh" bgcolor="neutral.lighter">
      <Stack px={3.5} py={2} flex={1} height={1} overflow="scroll">
        <Outlet />
      </Stack>
      <Stack
        flex={1}
        height={1}
        direction="column"
        alignItems="center"
        justifyContent="center"
        display={{ xs: 'none', md: 'flex' }}
        sx={(theme) => ({
          backgroundImage: `url(/images/auth/dynamox-auth-bg.png)`,
          backgroundRepeat: 'no-repeat',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          borderBottomLeftRadius: theme.shape.borderRadius * 24,
        })}
      >
        <Stack my="auto" direction="column" spacing={3} alignItems="center" justifyContent="center">
          <Image src={'/images/logo-white.png'} height={180} width={180} />
          <Link href="/">
            <Image src={'/images/auth/horizon.png'} height={32} />
          </Link>
        </Stack>

        <Stack mt="auto" height={80} spacing={5} alignItems="center" justifyContent="center">
          {footerLinks.map((item) => (
            <Typography
              key={item.id}
              variant="body2"
              component={Link}
              href={item.link}
              color="neutral.lighter"
            >
              {item.name}
            </Typography>
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
};

export default AuthLayout;
