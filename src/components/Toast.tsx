import React, { useEffect, useState, type JSX } from 'react'
import { CheckCircle2,  Info, XCircle } from 'lucide-react'

type ToastType = 'success' | 'error' | 'info'

export const useToast = () => {
  const [toast, setToast] = useState<{ message: string; type: ToastType } | null>(null)

  const show = (message: string, type: ToastType = 'info') => {
    setToast({ message, type })
  }

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setToast(null), 3500)
    return () => clearTimeout(t)
  }, [toast])

  return { toast, show }
}

export const Toast: React.FC<{ toast?: { message: string; type: ToastType } | null }> = ({ toast }) => {
  if (!toast) return null

  const iconMap: Record<ToastType, JSX.Element> = {
    success: <CheckCircle2 className="text-green-400" size={20} />,
    error: <XCircle className="text-red-400" size={20} />,
    info: <Info className="text-blue-400" size={20} />,
  }

  const bgMap: Record<ToastType, string> = {
    success: 'bg-green-900/90 border-green-600/40',
    error: 'bg-red-900/90 border-red-600/40',
    info: 'bg-slate-800/90 border-slate-600/40',
  }

  return (
    <div className="fixed right-5 bottom-5 z-50 animate-slide-up">
      <div
        className={`flex items-center gap-3 text-white px-4 py-3 rounded-lg border shadow-lg backdrop-blur-md ${bgMap[toast.type]} transition-all duration-300`}
      >
        {iconMap[toast.type]}
        <span className="text-sm font-medium">{toast.message}</span>
      </div>

      <style>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
