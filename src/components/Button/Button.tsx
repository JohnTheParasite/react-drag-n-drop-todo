import React from "react";
import classcat from "classcat";
import css from "./Button.module.css";

interface Props {
  onClick: () => void;
  children: React.ReactNode;
  title?: string;
  className?: string;
  disabled?: boolean;
}

export const Button = ({
  onClick,
  children,
  title,
  className,
  disabled = false,
}: Props) => {
  return (
    <button
      onClick={onClick}
      className={classcat([css.button, className])}
      title={title}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
};

export default Button;
