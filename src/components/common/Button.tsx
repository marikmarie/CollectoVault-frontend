import React from "react";

type Variant = "primary" | "secondary" | "ghost" | "danger";

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  loading?: boolean;
};

const variantClasses: Record<Variant, string> = {
  primary: "bg-emerald-500 hover:bg-emerald-600 text-white",
  secondary: "bg-white text-slate-900 hover:bg-slate-100",
  ghost: "bg-transparent text-slate-200 hover:bg-slate-800",
  danger: "bg-rose-500 hover:bg-rose-600 text-white",
};

export default function Button({ variant = "primary", className = "", loading = false, disabled, children, ...rest }: Props) {
  const base = "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-md font-semibold shadow-sm transition";
  const cls = `${base} ${variantClasses[variant]} ${disabled || loading ? "opacity-60 cursor-not-allowed" : ""} ${className}`;
  return (
    <button className={cls} disabled={disabled || loading} {...rest}>
      {loading && (
        <svg className="w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" strokeOpacity="0.2" />
          <path d="M22 12a10 10 0 00-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        </svg>
      )}
      <span>{children}</span>
    </button>
  );
}
