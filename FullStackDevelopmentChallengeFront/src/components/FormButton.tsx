import React from "react";

type FormButtonProps = {
  children: React.ReactNode;
  loading?: boolean;
};

const FormButton: React.FC<FormButtonProps> = ({ children, loading }) => {
  return (
    <button
      type="submit"
      disabled={loading}
      className="w-full py-3 bg-blue-500 text-white font-semibold rounded-lg 
                 hover:bg-blue-600 transition-colors disabled:opacity-50"
    >
      {loading ? "Carregando..." : children}
    </button>
  );
};

export default FormButton;
