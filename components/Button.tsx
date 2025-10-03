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
    | "btn-orange"
    | "btn-orange-outline"
    | "btn-dark-sm"
    | "btn-dark-base"
    | "btn-dark-glass"
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
      className={`inline-flex items-center justify-center gap-3 hover:gap-4 transition-transform duration-300 rounded-full cursor-pointer ${variant} ${className}`}
    >
      <span className="font-bold whitespace-nowrap">{title}</span>
      {icon && icon}
    </button>
  );
};

export default Button;
