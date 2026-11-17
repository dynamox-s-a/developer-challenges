import { useEffect, useState } from 'react';

type HealthStatus = {
  api: string;
  database: string;
};

export function App() {
  const [health, setHealth] = useState<HealthStatus | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Roda uma vez quando a tela abre: busca o status na API
  useEffect(() => {
    fetch('/api/health')
      .then((response) => response.json())
      .then((data: HealthStatus) => setHealth(data))
      .catch(() => setError('Não foi possível falar com a API'));
  }, []);

  if (error) return <p>{error}</p>;
  if (!health) return <p>Carregando...</p>;

  return (
    <div>
      <h1>DynaPredict</h1>
      <p>API: {health.api}</p>
      <p>Banco: {health.database}</p>
    </div>
  );
}

export default App;