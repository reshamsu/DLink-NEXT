import React from "react";

type ButtonProps = {
  type?: "button" | "submit";
  title: string;
  icon?: React.ReactNode;
  variant:
    | "btn-light-sm"
    | "btn-light-base"
    | "btn-light-outline"
    | "btn-light-glass"
    | "btn-orange-sm"
    | "btn-orange-base"
    | "btn-orange-outline"
    | "btn-orange-glass"
    | "btn-dark-sm"
    | "btn-dark-base"
    | "btn-dark-underline"
    | "btn-dark-outline";
  onClick?: () => void;
  className?: string;
};

const Button = ({
  type = "button",
  title,
  icon,
  variant,
  onClick,
  className = "",
}: ButtonProps) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`${variant} ${className}`}
    >
      <span className="whitespace-nowrap">{title}</span>
      {icon && icon}
    </button>
  );
};

export default Button;
