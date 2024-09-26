import { Select, StyledOption } from "./styles.ts";
import { ChangeEvent } from "react";
import {ISensor} from "../../pages/Sensor/ISensor.ts";


interface SelectProps {
  options: ISensor[];
  onChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  value: string;
}

export function CustomSelect({ options, onChange, value }: SelectProps) {
  return (
    <Select value={value} onChange={(event) => onChange(event)}>
      <StyledOption key={Math.random()} value=""></StyledOption>
      {options.map((option: ISensor) => (
        <StyledOption key={Math.random()} value={option._id}>
          {option.name}
        </StyledOption>
      ))}
    </Select>
  );
}
