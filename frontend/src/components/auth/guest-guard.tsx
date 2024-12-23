"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";

import { paths } from "@/paths";
import { logger } from "@/lib/default-logger";
import { useAppSelector } from "@/types/hooks";

export interface GuestGuardProps {
  children: React.ReactNode;
}

/**
 * GuestGuard component is responsible for protecting routes that should only be
 * accessible to guests.
 * @param children - The content to render if the user is not logged in.
 */
export function GuestGuard({
  children,
}: GuestGuardProps): React.JSX.Element | null {
  const router = useRouter();
  
  // Access the auth state from Redux store
  const { user, error, isLoading } = useAppSelector((state) => state.auth);
  
  const [isChecking, setIsChecking] = React.useState<boolean>(true);

  /**
   * Checks if the user is logged in and handles redirection if necessary.
   */
  const checkPermissions = async (): Promise<void> => {
    if (isLoading) {
      return;
    }

    if (error) {
      setIsChecking(false);
      logger.error("[GuestGuard]: Error checking user session", error);
      return;
    }

    if (user) {
      logger.debug("[GuestGuard]: User is logged in, redirecting to dashboard");
      router.replace(paths.dashboard.overview);
      return;
    }

    setIsChecking(false);
  };

  React.useEffect(() => {
    checkPermissions();
  }, [user, error, isLoading]);

  if (isLoading || isChecking) {
    return null; 
  }

  if (error) {
    return <Alert color="error">{error}</Alert>; 
  }

  return <>{children}</>;
}