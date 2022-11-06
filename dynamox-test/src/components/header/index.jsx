import Image from "next/image";
import Logo from "src/assets/logo-dynamox.png";
import { NAV_LINKS } from "./constants";
export const Header = () => {
  return (
    <header className="py-[30px] bg-dark-blue  flex justify-between flex-col sm:flex-row sm:pl-[77px] sm:pr-[43px] items-center gap-4">
      <a href="https://dynamox.net/">
        <Image src={Logo} alt="Logo Dynamox" className="max-w-[172px] w-full" />
      </a>
      <nav className="flex items-end gap-[37px]">
        {NAV_LINKS.map(({ href, label }) => (
          <a key={href} href={href} className="text-[#ffffff] font-medium">
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
};
