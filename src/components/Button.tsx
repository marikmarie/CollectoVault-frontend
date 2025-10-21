import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  variant?: 'primary' | 'secondary';
}

const Button: React.FC<ButtonProps> = ({ label, variant = 'primary', className = '', ...props }) => {
  const baseClasses = 'px-4 py-2 font-semibold rounded shadow transition-colors';
  const variantClasses = variant === 'primary'
    ? 'bg-primary text-white hover:bg-primary/80'
    : 'bg-secondary text-white hover:bg-secondary/80';
  return (
    <button className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
      {label}
    </button>
  );
};

export default Button;
