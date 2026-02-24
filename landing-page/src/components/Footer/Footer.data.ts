import LinkedinIcon from '@/assets/icons/linkedin-icon.svg?react';
import InstagramIcon from '@/assets/icons/instagram-icon.svg?react';
import FacebookIcon from '@/assets/icons/facebook-icon.svg?react';
import YoutubeIcon from '@/assets/icons/youtube-icon.svg?react';

export const footerData = {
  year: 2024,
  brand: {
    logoSrc: '../../assets/images/logo-dynamox.webp',
    logoAlt: 'Dynamox logo',
  },
  socialLinks: [
    { href: 'https://www.linkedin.com/company/dynamox/', icon: LinkedinIcon, label: 'LinkedIn' },
    { href: 'https://www.instagram.com/dynamox_s.a/', icon: InstagramIcon, label: 'Instagram' },
    { href: 'https://www.facebook.com/dynamoxtech/', icon: FacebookIcon, label: 'Facebook' },
    { href: 'https://www.youtube.com/@DynamoxTech', icon: YoutubeIcon, label: 'YouTube' },
  ],
  legalLinks: [
    { href: 'https://dynamox.net/', label: 'Consentimento de Cookies' },
    { href: 'https://storage.googleapis.com/dyx-communications-mkt-public-assets/Pol%C3%ADticas/PT/Aviso%20de%20privacidade%20Site%20-%20unificado%2007.10.pdf', label: 'Aviso de privacidade' },
  ],
};