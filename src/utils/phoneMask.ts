import { ChangeEvent } from "react";

export const handlePhone = (event: ChangeEvent<HTMLInputElement>) => {
  let input = event.target;
  input.value = phoneMask(input.value);
};

const phoneMask = (value: string) => {
  if (!value) return "";
  value = value.replace(/\D/g, "");
  value = value.replace(/(\d{2})(\d)/, "($1) $2");
  value = value.replace(/(\d)(\d{4})$/, "$1-$2");
  return value;
};
