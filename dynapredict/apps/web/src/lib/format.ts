// Data e hora no fuso de quem está usando, ex.: 22/11/2026, 07:00:00
export function formatDateTime(isoDate: string) {
  return new Date(isoDate).toLocaleString('pt-BR');
}

// Número no formato brasileiro, com até 3 casas: 1234.5678 vira 1.234,568
export function formatNumber(value: number) {
  return value.toLocaleString('pt-BR', { maximumFractionDigits: 3 });
}
