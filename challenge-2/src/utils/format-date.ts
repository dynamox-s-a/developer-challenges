export function formatDate(date: string) {
  const parsedDate = new Date(date)

  const formattedDate = new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(parsedDate)

  return formattedDate.replace(', ', ' - ')
}
