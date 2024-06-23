import { Poppins } from "next/font/google";

import Image from "next/image"

import icon from "/public/icon.png"

import { cn } from '@/lib/utils'

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
                <Image
                    alt="Playbonds Logo"
                    src={icon}
                    width={50}
                    height={50}
                />
                <h1 className={cn("text-3xl font-semibold text-black drop-shadow-md", font.className)}>
                    BRAVA FIDC  
                    </h1>
            </div>
            <div>
                <p className="text-normal text-gray-400">
                    {label}
                </p>
            </div>
        </div>
    )
};

