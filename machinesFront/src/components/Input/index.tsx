import { Container, Input, Label } from "./styles.ts";
import { InputHTMLAttributes } from "react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  invalid?: boolean;
}

export function CustomInput({
  label,
  invalid,
  handleInputChange,
  ...props
}: InputProps) {
  return (
    <Container>
      <Label $invalid={invalid}>{label}</Label>
      <Input $invalid={invalid} {...props} />
    </Container>
  );
}
