import React from "react";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "icon" | "destructive";
  size?: "sm" | "md" | "lg";
}

const variantStyles = {
  primary: "bg-neutral-100 not-disabled:hover:bg-neutral-200 text-black",
  destructive:
    "not-disabled:hover:bg-neutral-100 border border-neutral-100 not-disabled:hover:text-black",
  icon: "text-neutral-200 not-disabled:hover:bg-neutral-600 rounded-full",
};

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        className={`cursor-pointer disabled:opacity-80 disabled:cursor-default ${variantStyles[variant]} ${className}`}
        ref={ref}
        {...props}
      />
    );
  }
);
