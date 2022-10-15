import React from "react";
import { Formrow, FormLabel, FormInput } from "./styles";

export const FormRow = ({ type, name, value, handleChange, placeholder }) => {
  return (
    <Formrow>
      <FormLabel htmlFor={name}>{name}:</FormLabel>
      <FormInput
        type={type}
        name={name}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
      />
    </Formrow>
  );
};
