import { Button } from "./styles.ts";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

interface PropsButton
  extends DetailedHTMLProps<
    ButtonHTMLAttributes<HTMLButtonElement>,
    HTMLButtonElement
  > {
  title: string;
  onLoading?: boolean;
  $delete?: boolean;
}

export function CustomButton({
  title,
  onLoading,
  onClick,
  $delete,
  ...props
}: PropsButton) {
  return (
    <Button $delete={$delete} onClick={onClick}>
      {title}
    </Button>
  );
}
