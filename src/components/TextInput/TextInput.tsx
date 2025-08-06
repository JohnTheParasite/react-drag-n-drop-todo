import React from "react";
import css from "./TextInput.module.css";

interface Props {
  value: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onBlur?: () => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  placeholder?: string;
}

export const TextInput = ({
  value,
  onChange,
  onBlur,
  onKeyDown,
  placeholder,
}: Props) => {
  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      onBlur={onBlur}
      onKeyDown={onKeyDown}
      className={css.input}
      placeholder={placeholder}
      autoFocus
    />
  );
};

export default TextInput;
