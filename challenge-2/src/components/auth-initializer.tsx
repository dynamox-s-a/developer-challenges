"use client";
import { useEffect } from "react";
import { tokenStorage } from "@/services/login/token-service";
import { useAppDispatch } from "@/store/hooks";
import { setUser, setInitialized } from "@/store/auth/slice";

export function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const user = tokenStorage.verifyToken();
    if (!user) {
      tokenStorage.remove();
      dispatch(setInitialized());
      return;
    }

    dispatch(setUser(user));
  }, [dispatch]);

  return null;
}
