import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { MachinesPageClient } from '@/components/machine/machineViewCards';

export default async function MachinePage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/');
  }

  return (
    <div>
      <MachinesPageClient />
    </div>
  );
}
