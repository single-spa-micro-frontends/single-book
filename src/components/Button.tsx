import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: "primary" | "secondary";
  children: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  children,
  ...props
}) => {
  const baseStyles = "px-4 py-2 focus:outline-none";
  const variantStyles =
    variant === "primary"
      ? "bg-purple-500 text-white border-white border"
      : "bg-white border border-purple-500 text-purple-500";

  return (
    <button className={`${baseStyles} ${variantStyles}`} {...props}>
      {children}
    </button>
  );
};

export default Button;
