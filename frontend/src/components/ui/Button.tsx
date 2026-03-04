import React, { ButtonHTMLAttributes } from 'react';

// Hérite de toutes les propriétés natives d'un <button> HTML
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      {...props}
      className={`bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition shadow-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
    >
      {children}
    </button>
  );
}