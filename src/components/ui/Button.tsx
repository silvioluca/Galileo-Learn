import clsx from "clsx";
import type { ButtonHTMLAttributes } from "react";

type Variant = "primary" | "success" | "outline" | "ghost" | "danger";
type Size = "md" | "lg";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantClasses: Record<Variant, string> = {
  primary:
    "bg-brand-500 text-white shadow-[0_4px_0_0_var(--color-brand-700)] hover:bg-brand-400 disabled:bg-brand-300",
  success:
    "bg-success-500 text-white shadow-[0_4px_0_0_var(--color-success-700)] hover:bg-success-600 disabled:bg-success-300",
  danger:
    "bg-danger-500 text-white shadow-[0_4px_0_0_var(--color-danger-600)] hover:opacity-90 disabled:bg-danger-300",
  outline:
    "bg-white text-ink-900 border-2 border-ink-300 shadow-[0_4px_0_0_var(--color-ink-300)] hover:bg-cream-100",
  ghost: "bg-transparent text-ink-700 hover:bg-brand-50",
};

const sizeClasses: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm",
  lg: "px-7 py-3.5 text-base",
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled}
      className={clsx(
        "pressable font-display inline-flex items-center justify-center gap-2 rounded-2xl font-bold uppercase tracking-wide",
        "disabled:cursor-not-allowed disabled:opacity-60 disabled:shadow-none disabled:translate-y-0",
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    />
  );
}
