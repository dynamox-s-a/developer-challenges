export default function formatPrice(price) {
  const formattedPrice = (price / 100).toFixed(2).replace(".", ",");
  return formattedPrice;
}
