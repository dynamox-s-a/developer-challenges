import { useSelector } from "react-redux";
import { RootState } from "@/features/store";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const withAuth = (WrappedComponent: React.ComponentType) => {
  const ProtectedComponent = () => {
    const isAuthenticated = useSelector(
      (state: RootState) => state.auth.isAuthenticated
    );
    const router = useRouter();

    useEffect(() => {
      if (!isAuthenticated) {
        router.push("/login");
      }
    }, [isAuthenticated, router]);

    if (!isAuthenticated) {
      return null;
    }

    return <WrappedComponent />;
  };

  return ProtectedComponent;
};

export default withAuth;
