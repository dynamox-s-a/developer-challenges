import React, { forwardRef } from "react";

type Option = {
  value: string | number;
  label: string;
};

type SelectFieldProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  options: Option[];
};

const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ options, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 
                   focus:outline-none focus:ring-2 focus:ring-blue-400"
        {...props}
      >
        <option value="">Select...</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    );
  }
);

SelectField.displayName = "SelectField";
export default SelectField;
