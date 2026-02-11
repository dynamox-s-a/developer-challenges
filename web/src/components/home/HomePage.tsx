'use client'

import { Button } from "@mui/material";
import { BlurFade } from "../ui/blur-fade";
import { AuroraText } from "../ui/aurora-text";
import { redirect } from "next/navigation";

export function HomePage() {
  const redirectRegister = () => {
    redirect('/auth/register')
  }

  const redirectLogin = () => {
    redirect('auth/login')
  }

  return (
    <div className="flex flex-col items-center justify-center gap-6 p-10">
      <div className="text-center">
        <BlurFade delay={0.25} inView>
        <h2 className="text-4xl font-bold tracking-tighter md:text-5xl lg:text-7xl">
          Sensory <AuroraText>Application</AuroraText>
        </h2>
        </BlurFade>
        <div className="w-24 h-1.5 mx-auto mt-2 from-blue-500 to-indigo-500 rounded-full" />
      </div>

      <BlurFade delay={0.25 *2} inView>
      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <Button
          size="large"
          variant="contained"
          color="secondary"
          onClick={redirectRegister}
          sx={{ px: 5, py: 1.8, fontSize: "1.1rem", boxShadow: 3 }}
        >
          Sign-Up
        </Button>
        <Button
          size="large"
          variant="contained"
          color="secondary"
          onClick={redirectLogin}
          sx={{ px: 5, py: 1.8, fontSize: "1.1rem", boxShadow: 3 }}
        >
          Sign-In
        </Button>
      </div>
      </BlurFade>
    </div>
  );
}