import React from "react";
import { FormRowPerishable, Label, Input } from "./styles";

export const FormRowSelect = ({
  labelText,
  name,
  value,
  handleChange,
  list,
}) => {
  return (
    <FormRowPerishable>
      <Label htmlFor={name}>{labelText || name}</Label>
      <Input name={name} id={name} value={value} onChange={handleChange}>
        {list.map((optionValue, index) => {
          return (
            <option key={index} value={optionValue}>
              {optionValue}
            </option>
          );
        })}
      </Input>
    </FormRowPerishable>
  );
};
