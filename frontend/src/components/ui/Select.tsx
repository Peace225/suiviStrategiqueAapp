import React from 'react';

// Typage pour accepter les enfants (les <option>) et toutes les propriétés standard d'un select
interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  children: React.ReactNode;
}

export default function Select({ children, className = '', ...props }: SelectProps) {
  return (
    <select
      {...props}
      className={`border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-red-500 bg-white shadow-sm text-gray-700 ${className}`}
    >
      {children}
    </select>
  );
}