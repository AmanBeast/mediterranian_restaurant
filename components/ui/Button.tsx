import * as React from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "gold";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      className,
      variant = "primary",
      size = "md",
      isLoading = false,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      "inline-flex items-center justify-center font-medium tracking-wide transition-all duration-200 active:scale-95 disabled:pointer-events-none disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FAB44D]";

    const variantStyles = {
      primary:
        "bg-[#D47D57] hover:bg-[#B25337] text-white shadow-md hover:shadow-lg glow-terracotta",
      secondary:
        "bg-[#2D4231] hover:bg-[#405D45] text-[#F3EEE7] border border-white/10 shadow-sm",
      outline:
        "border border-white/20 hover:border-[#FAB44D] text-[#F3EEE7] hover:text-[#FAB44D] bg-transparent",
      ghost:
        "text-[#DED7CB] hover:text-[#F3EEE7] hover:bg-white/5",
      gold:
        "bg-[#FAB44D] hover:bg-[#E5A93C] text-[#0C100D] font-semibold glow-gold shadow-md",
    };

    const sizeStyles = {
      sm: "h-9 px-3.5 text-xs rounded-lg gap-1.5",
      md: "h-11 px-5 text-sm rounded-lg gap-2",
      lg: "h-13 px-7 text-base rounded-xl gap-2.5",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading && (
          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-1.5" />
        )}
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";
