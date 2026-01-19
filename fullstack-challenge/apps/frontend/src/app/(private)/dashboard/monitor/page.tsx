import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';

export default async function MaquinasPage() {
  const session = await getServerSession();
  if (!session) {
    redirect('/');
  }

  return <h1>Monitoramento</h1>;
}
