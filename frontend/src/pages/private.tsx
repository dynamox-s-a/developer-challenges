import Layout from "@/components/Layout";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";

const PrivatePage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  if (status === "loading") return <p>Loading...</p>;

  if (!session) {
    router.push("/login");
    return null;
  }

  return (
    <Layout>
      <h1>Welcome to the private page, {session.user?.name}</h1>
    </Layout>
  );
};

export default PrivatePage;
