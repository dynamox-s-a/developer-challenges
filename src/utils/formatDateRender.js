export default function formatDateRender(date) {
  if (!date) return;

  const dateArray = date.split("-");
  console.log(dateArray)
  const formattedDate =
   ( dateArray[2] + "/" + dateArray[1] + "/" + dateArray[0]).substring(); 
  return formattedDate;
}
