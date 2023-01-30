export default function formatPrice(price) {
  const formattedPrice = price.toFixed(2).replace(".", ",");
  
  return formattedPrice;
}
