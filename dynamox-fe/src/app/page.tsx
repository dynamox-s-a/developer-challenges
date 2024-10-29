import { redirect } from 'next/navigation';

export default function Page(): never {
  redirect('/dashboard/list-monitoring-points');
}
