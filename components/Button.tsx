
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
  const baseClasses = 'px-6 py-3 rounded-lg font-bold text-base transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-primary';

  const variantClasses = {
    primary: 'bg-accent-primary text-white hover:bg-accent-hover shadow-lg',
    secondary: 'bg-transparent border-2 border-accent-primary text-accent-primary hover:bg-accent-primary hover:text-white',
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
