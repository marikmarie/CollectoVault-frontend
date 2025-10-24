// import React from "react";

export default function Spinner({ size = 6, label = "Loading..." }: { size?: number; label?: string }) {
  const s = `${size}rem`;
  return (
    <div role="status" className="flex items-center gap-3">
      <svg style={{ width: s, height: s }} viewBox="0 0 50 50" className="animate-spin">
        <circle cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="4" strokeOpacity="0.2" fill="none" />
        <path d="M45 25a20 20 0 00-20-20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" fill="none" />
      </svg>
      <span className="text-sm text-slate-300">{label}</span>
    </div>
  );
}
