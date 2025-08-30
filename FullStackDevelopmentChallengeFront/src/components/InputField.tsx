import React, { forwardRef } from "react";

type InputFieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: string;
};

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  ({ label, ...props }, ref) => {
    return (
      <div>
        <label className="block mb-2 text-gray-700 font-medium">
          {label}
        </label>
        <input
          ref={ref}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 
                     focus:outline-none focus:ring-2 focus:ring-blue-400"
          {...props}
        />
      </div>
    );
  }
);

InputField.displayName = "InputField";
export default InputField;
