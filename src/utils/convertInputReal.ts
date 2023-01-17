export function mascaraMoeda(event: React.FormEvent<HTMLInputElement>) {
  const target = event.target as HTMLInputElement;
  const onlyDigits = target.value
    .split("")
    .filter((s) => /\d/.test(s))
    .join("")
    .padStart(3, "0");
  const digitsFloat = onlyDigits.slice(0, -2) + "." + onlyDigits.slice(-2);
  target.value = maskAtual(digitsFloat);
}

function maskAtual(valor: any, locale = "pt-BR", currency = "BRL") {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(valor);
}
