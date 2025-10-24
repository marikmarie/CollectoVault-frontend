import React, { useEffect } from "react";
import Icon from "./Icon";

type ToastType = "info" | "success" | "error" | "warning";

type Props = {
  id?: string | number;
  type?: ToastType;
  title?: string;
  message: string;
  onClose?: () => void;
  duration?: number; // ms
};

const colorFor = (t: ToastType) => {
  switch (t) {
    case "success": return "bg-emerald-600";
    case "error": return "bg-rose-600";
    case "warning": return "bg-amber-500";
    case "info":
    default: return "bg-slate-800";
  }
};

export default function Toast({ id, type = "info", title, message, onClose, duration = 4000 }: Props) {
  useEffect(() => {
    if (!duration || duration <= 0) return;
    const t = setTimeout(() => {
      onClose?.();
    }, duration);
    return () => clearTimeout(t);
  }, [duration, onClose]);

  return (
    <div className={`max-w-md w-full ${colorFor(type)} text-white rounded-md shadow-lg p-3 flex gap-3 items-start`}>
      <div className="mt-1">
        {type === "success" && <Icon name="check" />}
        {type === "error" && <Icon name="x" />}
        {type === "warning" && <Icon name="info" />}
        {type === "info" && <Icon name="info" />}
      </div>
      <div className="flex-1">
        {title && <div className="font-semibold">{title}</div>}
        <div className="text-sm">{message}</div>
      </div>
      <div>
        <button onClick={() => onClose?.()} className="p-1 rounded hover:bg-white/10">
          <Icon name="close" />
        </button>
      </div>
    </div>
  );
}
