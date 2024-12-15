import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const HomePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <p>Loading...</p>;

  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <div>
      <h1>Welcome to the home page, {session.user?.name}</h1>
    </div>
  );
};

export default HomePage;
