import React from "react";

interface ButtonProps {
  isSubmitting: boolean;
}

const Button: React.FC<ButtonProps> = ({ isSubmitting }) => {
  return (
    <button type="submit" disabled={isSubmitting}>
      {isSubmitting ? "Enviando..." : "Login"}
    </button>
  );
};

export default Button;
