import React, { useState, useEffect } from "react";

const PasswordValidation = ({
  value,
  onValidationChange,
  onPasswordErrorChange,
  passwordInputRef,
}: {
  value: string;
  onValidationChange: (isValid: boolean) => void;
  onPasswordErrorChange: (error: string) => void;
  passwordInputRef: React.RefObject<HTMLInputElement>;
}) => {

  const isLengthValid = value.length >= 8;
  const hasSpecialChar = /[!@#$%]/.test(value);
  const hasTwoLetters = /[a-zA-Z].*[a-zA-Z]/.test(value);
  const isValidPassword =
    isLengthValid && hasTwoLetters && hasSpecialChar;

  useEffect(() => {
    onValidationChange(isValidPassword);

    if (!isValidPassword) {
      onPasswordErrorChange("A senha não atende aos critérios mínimos.");
    } else {
      onPasswordErrorChange("");
    }
  }, [isValidPassword, onValidationChange, onPasswordErrorChange]);

  return (
    <div className="self-center justify-center" >
      {!hasSpecialChar && (
        <div className="text-sm text-red-600 text-center">
          Mínimo 1 caractere @#$%
        </div>
      )}
      {!hasTwoLetters && (
        <div className="text-sm text-red-600 text-center">Mínimo 2 letras</div>
      )}
      {!isLengthValid && (
        <div className="text-sm text-red-600 text-center">
          Mínimo 8 caracteres
        </div>
      )}
      {isLengthValid && hasTwoLetters && hasSpecialChar && (
        <div className="text-sm text-green-600">Senha válida!</div>
      )}
    </div>
  );
};

export default PasswordValidation;
