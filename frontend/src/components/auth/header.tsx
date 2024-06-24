import Image from "next/image";

import { Poppins } from "next/font/google";

const font = Poppins({
    subsets: ["latin"],
    weight: ["600"]
});

interface HeaderProps {
    label: string;
}

export const Header = ({ label }: HeaderProps) => {
    return (
        <div className="w-full flex flex-col gap-y-4 items-center justify-center">
            <div className="flex items-center gap-2">
              
                <Image src="/dynamox_horizontal_logo.webp" alt="Logo" width={200} height={200} />
            </div>
            <div>
                <p className="text-normal text-gray-400">
                    {label}
                </p>
            </div>
        </div>
    )
};

