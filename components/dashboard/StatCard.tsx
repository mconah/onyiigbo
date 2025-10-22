import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  description?: string;
  variant?: 'default' | 'success' | 'warning';
}

const StatCard: React.FC<StatCardProps> = ({ title, value, description, variant = 'default' }) => {
  const variantClasses = {
    default: 'border-soft-gray',
    success: 'border-success text-success',
    warning: 'border-yellow-500 text-yellow-600',
  };

  return (
    <div className={`bg-white p-6 rounded-lg shadow-sm border-l-4 ${variantClasses[variant]}`}>
      <p className="text-sm font-bold text-secondary-text uppercase">{title}</p>
      <p className="text-3xl font-bold text-primary-text mt-1">{value}</p>
      {description && <p className="text-xs text-secondary-text mt-2">{description}</p>}
    </div>
  );
};

export default StatCard;