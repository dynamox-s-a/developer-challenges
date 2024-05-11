import { ErrorMessage } from "@hookform/error-message";

interface ErrorTextProps {
  errors: any;
  name: string;
  errorStyle: React.CSSProperties;
}

export function ErrorText({ errors, name, errorStyle }: ErrorTextProps) {
  return (
    <ErrorMessage
      errors={errors}
      name={name}
      render={({ message }) => <span style={errorStyle}>{message}</span>}
    />
  );
}
