import React from "react";

interface InputPasswordProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string | undefined;
}

const InputPassword: React.FC<InputPasswordProps> = ({
  value,
  onChange,
  error,
}) => {
  return (
    <div className="form-group">
      <label htmlFor="password">Senha</label>
      <input
        id="password"
        type="password"
        placeholder="Digite sua senha"
        value={value}
        onChange={onChange}
        required
      />
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default InputPassword;
