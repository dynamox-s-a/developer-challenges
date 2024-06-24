import { Poppins } from "next/font/google";



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
              
                <h1 className={cn("text-3xl font-semibold text-black drop-shadow-md", font.className)}>
                    DYNAMOX
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

