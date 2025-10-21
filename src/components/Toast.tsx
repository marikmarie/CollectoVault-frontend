import React, { useEffect, useState } from 'react'

export const useToast = () => {
  const [message, setMessage] = useState<string | null>(null)
  useEffect(() => {
    if (!message) return
    const t = setTimeout(() => setMessage(null), 3000)
    return () => clearTimeout(t)
  }, [message])
  return { message, show: (m: string) => setMessage(m) }
}

export const Toast: React.FC<{message?: string | null}> = ({ message }) => {
  if (!message) return null
  return (
    <div className="fixed right-4 bottom-4 z-50">
      <div className="bg-accent text-black px-4 py-2 rounded shadow">{message}</div>
    </div>
  )
}
