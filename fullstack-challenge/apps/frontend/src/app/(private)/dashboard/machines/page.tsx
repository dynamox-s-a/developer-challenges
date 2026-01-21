import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { MachineView } from '@/components/machine/machineView';

export default async function MachinePage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/');
  }

  return (
    <div>
      <MachineView />
    </div>
  );
}
