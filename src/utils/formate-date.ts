/**
 * Responsaveis por formatar datas
 */
export function formatDate(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };
  return new Intl.DateTimeFormat('pt-BR', options).format(date);
}

export function formatDateShort(date: Date): string {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: '2-digit',
  };
  return new Intl.DateTimeFormat('pt-BR', options).format(date);
}