import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export default function Card({ children, className = '', ...props }: CardProps) {
  return (
    <div 
      {...props} 
      className={`bg-white p-6 rounded-xl shadow-sm border border-gray-100 ${className}`}
    >
      {children}
    </div>
  );
}