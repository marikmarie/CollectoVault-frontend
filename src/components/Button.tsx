import React from 'react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  variant?: 'primary' | 'secondary'
}

const Button: React.FC<ButtonProps> = ({ label, variant = 'primary', className = '', ...props }) => {
  const base = 'px-4 py-2 rounded-lg font-semibold transition-all'
  const styles = variant === 'primary'
    ? 'bg-accent text-black hover:brightness-95'
    : 'bg-primary text-white hover:opacity-90'
  return (
    <button className={`${base} ${styles} ${className}`} {...props}>
      {label}
    </button>
  )
}

export default Button
