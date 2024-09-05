import React from 'react';
import { Breadcrumbs, Link, Typography } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface CustomBreadcrumbsProps {
  breadcrumbs?: BreadcrumbItem[];
}

const CustomBreadcrumbs: React.FC<CustomBreadcrumbsProps> = ({ breadcrumbs }) => {
  return (
    <Breadcrumbs
      separator={<NavigateNextIcon fontSize="small" />}
      aria-label="breadcrumb"
      sx={{ mb: 2 }}
    >
      <Link
        underline="hover"
        color="inherit"
        href="/"
        sx={{
          display: 'flex',
          alignItems: 'center',
          color: '#757575', // Cor de cinza claro para o ícone e texto inicial
          textDecoration: 'none',
          '&:hover': {
            textDecoration: 'underline',
          },
        }}
      >
        <HomeIcon sx={{ mr: 0.5 }} fontSize="inherit" />
        Início
      </Link>

      {breadcrumbs?.map((breadcrumb, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return isLast ? (
          <Typography
            color="text.primary"
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              fontWeight: 'bold',
              color: '#424242', // Cor de cinza mais escuro para a página atual
            }}
          >
            {breadcrumb.label}
          </Typography>
        ) : (
          <Link
            underline="hover"
            color="inherit"
            href={breadcrumb.href}
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              color: '#9e9e9e', // Cor de cinza claro para os outros links
              textDecoration: 'none',
              '&:hover': {
                textDecoration: 'underline',
              },
            }}
          >
            {breadcrumb.label}
          </Link>
        );
      })}
    </Breadcrumbs>
  );
};

export default CustomBreadcrumbs;
