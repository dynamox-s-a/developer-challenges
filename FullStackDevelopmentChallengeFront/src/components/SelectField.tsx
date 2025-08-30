import React, { forwardRef } from "react";

type SelectFieldProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  label: string;
  options: string[];
};

const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(
  ({ label, options, ...props }, ref) => {
    return (
      <div>
        <label className="block mb-2 text-gray-700 font-medium">{label}</label>
        <select
          ref={ref}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg text-gray-900 
                     focus:outline-none focus:ring-2 focus:ring-blue-400"
          {...props}
        >
          <option value="">Selecione um tipo</option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    );
  }
);

SelectField.displayName = "SelectField";
export default SelectField;
