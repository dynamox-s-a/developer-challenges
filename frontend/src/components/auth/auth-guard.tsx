"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import Alert from "@mui/material/Alert";
import { paths } from "@/paths";
import { logger } from "@/lib/default-logger";
import { useAppDispatch, useAppSelector } from "@/types/hooks";
import { checkAuth } from "@/redux/auth/thunks";

export interface AuthGuardProps {
  /**
   * The children elements that will be rendered if the user is authenticated.
   */
  children: React.ReactNode;
}

/**
 * A component that ensures the user is authenticated before rendering the children.
 * If the user is not authenticated, it redirects them to the sign-in page.
 * If an error occurs during authentication, it displays an alert with the error message.
 *
 * @component
 * @example
 * return (
 *   <AuthGuard>
 *     <ProtectedContent />
 *   </AuthGuard>
 * );
 */
export function AuthGuard({
  children,
}: AuthGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, error, isLoading } = useAppSelector((state) => state.auth);
  const [isChecking, setIsChecking] = React.useState<boolean>(true);

  /**
   * Checks the user's authentication status and permissions.
   */
  React.useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  /**
   * Performs permission checks and handles the redirection based on the user's authentication status.
   * @returns {Promise<void>} A promise that resolves when permission checks are complete.
   */
  const checkPermissions = async (): Promise<void> => {
    if (isLoading) {
      return;
    }

    if (error) {
      setIsChecking(false);
      return;
    }

    if (!user) {
      logger.debug(
        "[AuthGuard]: User is not logged in, redirecting to sign in",
      );
      router.replace(paths.auth.signIn);
      return;
    }

    setIsChecking(false);
  };

  React.useEffect(() => {
    checkPermissions();
  }, [user, error, isLoading]);

  // Show nothing while the authentication status is being checked
  if (isChecking) {
    return null;
  }

  // Show an error message if there was an issue with authentication
  if (error) {
    return <Alert color="error">{error}</Alert>;
  }

  // Render the children if the user is authenticated
  return <>{children}</>;
}