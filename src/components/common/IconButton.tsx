import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
  className?: string;
}

export default function IconButton({
  children,
  disabled,
  onClick,
  className,
  ...props
}: ButtonProps) {
  const handleClick = () => {
    if (onClick) onClick();
  };
  return (
    <button
      className={`flex justify-center items-center rounded ${disabled ? "opacity-50 cursor-not-allowed" : "hover:bg-hover hover:duration-200 duration-[400ms] transition-all"} ${className}`}
      disabled={disabled}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}
