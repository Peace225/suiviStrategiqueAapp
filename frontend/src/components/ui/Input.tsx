import React, { InputHTMLAttributes } from 'react';

// Hérite de toutes les propriétés natives d'un <input> HTML
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {}

export default function Input({ className = '', ...props }: InputProps) {
  return (
    <input
      {...props}
      className={`border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-red-500 shadow-sm transition-colors placeholder-gray-400 ${className}`}
    />
  );
}