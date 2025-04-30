import logo from '@/assets/header/logo-dynamox.png';

export function Header() {
  return (
    <header className="w-full h-20 flex items-center justify-center">
      <picture>
        <source media="(max-width: 768px)" srcSet={logo} width="120" height="50" />
        <source media="(min-width: 769px)" srcSet={logo} width="152" height="64" />
        <img
          src={logo}
          alt="Logo Dynamox"
          width="152"
          height="64"
          className="w-auto h-[50px] md:h-16"
          fetchPriority="high"
          loading="eager"
        />
      </picture>
    </header>
  );
}
