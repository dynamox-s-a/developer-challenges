import { useRouter } from "next/router";
import { signOut } from "next-auth/react";
import { useSession } from "next-auth/react";
import LoadingContent from "../components/LoadingContent";

export function Index() {
  const router = useRouter();
  const { status } = useSession();

  if (status === "loading") {
    return <LoadingContent />;
  }

  if (status !== "authenticated") {
    router.push("/auth/login");
  }

  return (
    <>
      {status === "authenticated" && (
        <div>
          <h1>Private Route</h1>
          <button
            onClick={() => signOut()}
          >
            Logout
          </button>
        </div>
      )}
    </>
  );
}

export default Index;
