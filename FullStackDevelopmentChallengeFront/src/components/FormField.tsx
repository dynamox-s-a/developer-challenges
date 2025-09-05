// FormField.tsx
import React from "react";

type FormFieldProps = {
  label: string;
  error?: string;
  children: React.ReactNode;
};

const FormField: React.FC<FormFieldProps> = ({ label, error, children }) => {
  return (
    <div className="flex flex-col">
      <label className="font-medium mb-1">{label}</label>
      {children}
      {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
    </div>
  );
};

export default FormField;
