"use client";

import LoginForm from "@/components/LoginForm";
import Image from "next/image";

const LoginPage = () => {
  return (
    <div className="login-container">
      <Image
        src="/logo_Dynamox 2.png"
        alt="Dynamox Logo"
        width={180}
        height={80}
        className="logo"
      />
      <LoginForm />
    </div>
  );
};

export default LoginPage;
