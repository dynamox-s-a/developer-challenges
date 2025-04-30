import logoFooter from '@/assets/footer/logo-footer.png';
import facebook from '@/assets/footer/facebook.png';
import instagram from '@/assets/footer/instagram.png';
import linkedin from '@/assets/footer/linkedin.png';
import youtube from '@/assets/footer/youtube.png';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const socialLinks = [
    {
      icon: linkedin,
      url: 'https://www.linkedin.com/company/dynamox/',
      alt: 'LinkedIn Dynamox',
    },
    {
      icon: instagram,
      url: 'https://www.instagram.com/dynamox_s.a/',
      alt: 'Instagram Dynamox',
    },
    {
      icon: facebook,
      url: 'https://www.facebook.com/dynamoxtech/',
      alt: 'Facebook Dynamox',
    },
    {
      icon: youtube,
      url: 'https://www.youtube.com/@DynamoxTech',
      alt: 'YouTube Dynamox',
    },
  ];

  return (
    <footer className="w-full max-w-[1468px] mx-auto bg-primary text-white py-8 rounded-2xl mb-8">
      <div className="max-w-7xl mx-auto px-4 flex flex-col items-center gap-8">
        <div className="flex gap-6 flex-col md:flex-row items-center md:items-end justify-between w-full">
          <img
            src={logoFooter}
            alt="Dynamox logo"
            width={188}
            height={80}
            className="h-20 w-auto"
            loading="lazy"
          />

          <div className="flex gap-6 items-center">
            {socialLinks.map((social) => (
              <a
                key={social.url}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-opacity hover:opacity-80"
              >
                <img src={social.icon} alt={social.alt} className="w-6 h-6" />
              </a>
            ))}
          </div>
        </div>

        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-4 text-sm border-t border-white pt-4">
          <p>@{currentYear} Dynamox. All Rights Reserved</p>
          <div className="flex items-center gap-2">
            <a href="#" className="hover:opacity-80 transition-opacity">
              Consentimento de Cookies
            </a>
            <span className="text-white/50">•</span>
            <a
              href="https://content.dynamox.net/wp-content/uploads/2024/09/AVISO-DE-PRIVACIDADE-UNIFICADO.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:opacity-80 transition-opacity"
            >
              Aviso de privacidade
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
