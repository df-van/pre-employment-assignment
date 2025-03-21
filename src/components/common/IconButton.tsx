import { ReactNode } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  onClick?: () => void;
  className?: string;
}

export default function IconButton({
  children,
  onClick,
  className,
  ...props
}: ButtonProps) {
  const handleClick = () => {
    if (onClick) onClick();
  };
  return (
    <button
      className={`rounded hover:bg-hover hover:duration-150 duration-300 transition-all ${className}`}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  );
}
