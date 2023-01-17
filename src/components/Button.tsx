import React, { ButtonHTMLAttributes, FC } from "react";

interface IButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  secondary?: boolean;
}

const Button: FC<IButtonProps> = ({ title, onClick, secondary }) => {
  return (
    <div className="w-full">
      <button
        className={`w-full py-4 text-sm font-bold transition duration-200 ${
          secondary ? "bg-red-600" : "bg-blue-600"
        } rounded ${
          secondary ? "hover:bg-red-700" : "hover:bg-blue-700"
        } text-gray-50 md:mx-auto`}
        type="submit"
        onClick={onClick}
      >
        {title}
      </button>
    </div>
  );
};

export default Button;
