import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/data')({
  component: Data,
});

function Data() {
  return <h1>Data page</h1>;
}
