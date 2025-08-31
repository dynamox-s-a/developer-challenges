import React, { forwardRef } from "react";

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement>;

const InputField = forwardRef<HTMLInputElement, InputFieldProps>((props, ref) => {
  return (
    <input
      ref={ref}
      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 
                 focus:outline-none focus:ring-2 focus:ring-blue-400"
      {...props}
    />
  );
});

InputField.displayName = "InputField";
export default InputField;

