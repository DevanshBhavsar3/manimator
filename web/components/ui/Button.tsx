import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "icon" | "destructive";
  size?: "sm" | "md" | "lg";
}

const variantStyles = {
  primary: "bg-neutral-100 hover:bg-neutral-200 text-black",
  destructive:
    "hover:bg-neutral-100 border border-neutral-100 hover:text-black",
  icon: "text-neutral-200 hover:bg-neutral-600 rounded-full",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        className={`cursor-pointer ${variantStyles[variant]} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
