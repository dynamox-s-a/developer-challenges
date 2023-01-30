export default function formatDate(date) {
  if (!date) return;

  const formattedDate = date.replace(/(\d\d)\/(\d\d)\/(\d{4})/, "$3-$1-$2");

  return formattedDate;
}
