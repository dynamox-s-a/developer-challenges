import { Select, StyledOption } from "./styles.ts";
import { ChangeEvent } from "react";
import { ISensor } from "../../pages/Machine/MachineForm";

interface SelectProps {
  options: ISensor[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  value: string;
}

export function CustomSelect({ options, onChange, value }: SelectProps) {
  return (
    <Select value={value} onChange={(event) => onChange(event)}>
      <StyledOption key="0" value=""></StyledOption>
      {options.map((option: ISensor) => (
        <StyledOption key={option._id} value={option._id}>
          {option.name}
        </StyledOption>
      ))}
    </Select>
  );
}
