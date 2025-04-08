"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/features/store";
import { useRouter } from "next/navigation";
import { useEffect, ComponentType } from "react";

export const withAuth = <P extends object>(
  WrappedComponent: ComponentType<P>
) => {
  const AuthWrapper = (props: P) => {
    const router = useRouter();
    const isAuthenticated = useSelector(
      (state: RootState) => state.auth.isAuthenticated
    );

    useEffect(() => {
      if (!isAuthenticated) {
        router.push("/login");
      }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent {...props} />;
  };

  return AuthWrapper;
};

export default withAuth;
