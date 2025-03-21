import React from "react";

type ButtonVariant = "primary" | "danger";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  onClick?: () => void;
  className?: string;
  disabled?: boolean;
}
const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-[#FFEB00] hover:bg-yellow-400 text-[#060B11]",
  danger: "bg-[#FFD8D8] hover:bg-red-400 text-[#FF3C3C]",
};
const disabledClasses = "opacity-50 cursor-not-allowed";

export default function ConfirmButton({
  variant = "primary",
  children,
  onClick,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const classes = disabled
    ? `${disabledClasses} ${variantClasses[variant]}`
    : variantClasses[variant];

  const handleClick = () => {
    if (onClick) onClick();
  };
  return (
    <button
      className={`w-full p-4 text-xl rounded-full hover:duration-150 duration-500 transition-all ${classes} ${className || ""}`}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}
