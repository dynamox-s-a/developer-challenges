import React from "react";

import Image from "next/image"



const AuthLayout = ({ children }: { children: React.ReactNode }) => {
    return (
        <div className="h-screen flex-col  bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] 
        from-blue-400 
        to-slate-950">
           
            <div className="flex justify-center items-center h-[90vh]">
                <div>

                    {children}
                </div>

            </div>
        </div>
    );
}

export default AuthLayout;
