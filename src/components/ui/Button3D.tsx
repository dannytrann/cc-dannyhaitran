"use client";

import { type ButtonHTMLAttributes, forwardRef } from "react";

interface Button3DProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
  size?: "sm" | "md" | "lg";
  as?: "button" | "a";
  href?: string;
}

export const Button3D = forwardRef<HTMLButtonElement, Button3DProps>(
  function Button3D(
    { variant = "primary", size = "md", className = "", children, ...props },
    ref
  ) {
    const base =
      "relative inline-flex items-center justify-center font-medium border-2 border-shadow transition-all duration-150 cursor-pointer select-none";

    const variants = {
      primary: "bg-accent text-surface hover:bg-accent/90",
      secondary: "bg-rose text-text hover:bg-rose/90",
      outline: "bg-surface text-text hover:bg-lavender/20",
    };

    const sizes = {
      sm: "px-4 py-1.5 text-sm",
      md: "px-6 py-2.5 text-base",
      lg: "px-8 py-3.5 text-lg",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} shadow-brutal active:translate-x-[4px] active:translate-y-[4px] active:shadow-none ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);
