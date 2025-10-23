
import React from 'react';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary';
  type?: 'button' | 'submit' | 'reset';
  // Fix: Added disabled prop
  disabled?: boolean; 
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  type = 'button',
  // Fix: Destructure disabled prop
  disabled,
}) => {
  const baseClasses = 'relative inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-base transition-all duration-500 focus:outline-none focus:ring-2 focus:ring-offset-0 focus:ring-accent-primary/60 disabled:opacity-60 disabled:cursor-not-allowed overflow-hidden';

  const variantClasses = {
    primary: 'bg-accent-primary/90 text-white shadow-[0_20px_40px_-12px_rgba(155,93,229,0.55)] hover:bg-accent-primary hover:shadow-[0_28px_55px_-18px_rgba(155,93,229,0.75)]',
    secondary: 'bg-white/15 border border-white/40 text-accent-primary hover:bg-white/25 hover:text-accent-hover backdrop-blur-sm shadow-[0_18px_38px_-20px_rgba(15,23,42,0.35)]',
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      // Fix: Apply disabled prop to the native button
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
