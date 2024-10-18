"use client";

import * as Clerk from "@clerk/elements/common";
import * as SignIn from "@clerk/elements/sign-in";
import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LoginPage = () => {
  const { isLoaded, isSignedIn } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      router.push("/list/machines");
    }
  }, [isLoaded, isSignedIn, router]);

  return (
    <div
      className="h-screen flex items-center justify-center bg-cover bg-center"
      style={{ backgroundImage: "url(/grafismo.png)" }}
    >
      <SignIn.Root>
        <SignIn.Step
          name="start"
          className="bg-white p-12 rounded-md shadow-2xl flex flex-col gap-2"
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <h1 className=" flex  gap-2 justify-center">
              <Image
                src="/logo-dynamox.png"
                alt="logo"
                width={150}
                height={150}
              />
            </h1>
            <h2 className="text-gray-400 mt-5">Sign in to your account</h2>
          </div>
          <Clerk.GlobalError className="text-sm text-red-400" />
          <Clerk.Field name="identifier" className="flex flex-col gap-2">
            <Clerk.Label className=" text-black">Email</Clerk.Label>
            <Clerk.Input
              className="p-2 rounded-md ring-1 ring-gray-300"
              type="email"
              placeholder="Email"
            />
            <Clerk.FieldError className="text-sm text-red-500" />
          </Clerk.Field>
          <Clerk.Field name="password" className="flex flex-col gap-2">
            <Clerk.Label className=" text-black">Password</Clerk.Label>
            <Clerk.Input
              className="p-2 rounded-md ring-1 ring-gray-300"
              type="password"
              placeholder="Password"
            />
            <Clerk.FieldError className="text-sm text-red-500" />
          </Clerk.Field>
          <SignIn.Action
            submit
            className="bg-blue-500 text-white rounded-md text-sm p-[10px] hover:bg-blue-600 transition"
          >
            Sign In
          </SignIn.Action>
        </SignIn.Step>
      </SignIn.Root>
    </div>
  );
};

export default LoginPage;
