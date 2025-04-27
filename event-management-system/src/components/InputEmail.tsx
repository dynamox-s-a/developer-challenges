import React from "react";

interface InputEmailProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error: string | undefined;
}

const InputEmail: React.FC<InputEmailProps> = ({ value, onChange, error }) => {
  return (
    <div className="form-group">
      <label htmlFor="email">Email</label>
      <input
        id="email"
        type="email"
        placeholder="Digite seu email"
        value={value}
        onChange={onChange}
        required
      />
      {error && <p className="error">{error}</p>}
    </div>
  );
};

export default InputEmail;
