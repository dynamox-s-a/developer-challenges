import { getServerSession } from "next-auth";

export default async function Home() {
  const session = await getServerSession();

  if (!session) {
    return <h1>No session!</h1>;
  }

  return (
    <>
      <h1>{session.user?.email}</h1>
    </>
  );
}
