import Image from "next/image"

import { SignIn } from "@/components/sign-in";
import img from "../../../../../archive/assets-desafio-01/grafismo.png"
import icon from "/public/logo-dynamox.png"

export default function LoginPage() {
  return (
    <div className="flex w-full lg:h-screen ">

      <div className="absolute top-4 left-4 z-20">
        <Image src={icon} alt="Logo" width={100} height={100} />
      </div>

      <div className="flex  items-center justify-center  z-20">
      

        <SignIn />
      </div>

      <div className=" bg-muted lg:h-screen lg:flex lg:w-full z-0">
        <Image
          src={img}
          alt="Image"
          layout="fill"
          
          className="h-screen w-full object-cover dark:brightness-[0.2] dark:grayscale"
        />
      </div>
    </div>
  )
}

