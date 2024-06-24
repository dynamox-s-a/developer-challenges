import React from "react";

import Image from "next/image"

import icon from "/public/logo-dynamox.png"

const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="h-screen flex-col  bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] 
        from-blue-400 
        to-slate-950">
            <div className="p-2">

                <Image src={icon} alt="Dynamox" width={100} height={100} />
            </div>
            <div className="flex justify-center items-center h-[90vh]">
                <div>

                    {children}
                </div>

            </div>
        </div>
    );
}

export default AuthLayout;
