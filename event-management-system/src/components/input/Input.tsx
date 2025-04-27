"use client";

import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";

interface InputProps {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  error?: string;
}

const Input: React.FC<InputProps> = ({
  id,
  label,
  type,
  placeholder,
  value,
  onChange,
  error,
}) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null;
  }

  return (
    <TextField
      id={id}
      label={label}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      error={!!error}
      helperText={error}
      required
      autoComplete="off"
      sx={{
        width: "300px",
        backgroundColor: "transparent",
        input: { color: "white" },
        label: { color: "white" },
        "& .MuiOutlinedInput-root": {
          "& fieldset": { borderColor: "white" },
          "&:hover fieldset": { borderColor: "#692746" },
          "&.Mui-focused fieldset": { borderColor: "#692746" },
        },
        mt: "16px",
      }}
    />
  );
};

export default Input;
