import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "terracotta" | "olive" | "gold" | "subtle" | "outline";
}

export function Badge({
  className,
  variant = "subtle",
  children,
  ...props
}: BadgeProps) {
  const variantStyles = {
    terracotta:
      "bg-[#D47D57]/20 text-[#FFB597] border border-[#D47D57]/40",
    olive:
      "bg-[#2D4231]/40 text-[#B4CEA5] border border-[#405D45]/50",
    gold:
      "bg-[#FAB44D]/15 text-[#FAB44D] border border-[#FAB44D]/30",
    subtle:
      "bg-white/5 text-[#DED7CB] border border-white/10",
    outline:
      "bg-transparent text-[#DED7CB] border border-white/20",
  };

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium tracking-wide",
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  );
}
