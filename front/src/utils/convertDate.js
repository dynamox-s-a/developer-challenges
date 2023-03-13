export default function convertDate(date) {
  const newDate = new Date(date).toLocaleDateString("pt-BR", {
    timeZone: "UTC",
  });
  return newDate;
}
