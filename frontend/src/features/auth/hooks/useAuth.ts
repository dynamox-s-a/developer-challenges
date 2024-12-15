import { signIn } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";

export const useAuth = () => {
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (email: string, password: string) => {
    setError(null);
    const res = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (res?.error) {
      setError("Invalid email or password");
    } else {
      router.push("/home");
    }
  };

  return { handleLogin, error };
};
