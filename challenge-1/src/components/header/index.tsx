import logo from '@/assets/logo-dynamox.png';

export function Header() {
  return (
    <header className="w-full h-20 flex items-center justify-center bg-white shadow-md">
      <img src={logo} alt="Logo Dynamox" width={152} height={64} />
    </header>
  );
}
