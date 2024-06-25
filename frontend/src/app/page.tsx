import { Button } from "@/components/ui/button";
import Image from "next/image";
import icon from "../../public/logo-dynamox.png";
import img from "../../public/grafismo.png";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex w-full h-screen">
      <div className="absolute top-4 left-4 z-20">
        <Image src={icon} alt="Logo" width={100} height={100} />
      </div>
     
      <div className="flex flex-col gap-4 justify-center items-center w-full h-screen z-20">
        <h1 className="lg:text-5xl text-3xl font-bold text-[#6A2747]">BEM VINDO A DYNAMOX!</h1>
        <Link href="/auth/login">
          <Button variant="secondary" className="bg-[#6A2747] text-white hover:bg-rose-800" size="lg">
            Acesse sua conta
          </Button>
        </Link>
      </div>
      <div >
        <Image
          src={img}
          alt="Image"
          layout="fill"
          className="opacity-30 dark:brightness-[0.0] dark:grayscale z-0"
        />
      </div>
    </div>
  );
}