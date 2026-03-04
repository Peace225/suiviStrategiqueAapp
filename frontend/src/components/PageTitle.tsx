import React from 'react';

interface PageTitleProps {
  title: string;
  subtitle?: string;
  icon?: string;
}

export default function PageTitle({ title, subtitle, icon }: PageTitleProps) {
  return (
    <header className="mb-10 flex items-center gap-3">
      {/* Affichage de l'icône uniquement si elle est fournie */}
      {icon && (
        <span className="bg-red-100 text-red-600 p-2 rounded-lg text-xl flex-shrink-0">
          {icon}
        </span>
      )}
      
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {title}
        </h1>
        {/* Affichage du sous-titre uniquement s'il est fourni */}
        {subtitle && (
          <p className="text-gray-500 text-sm mt-1">
            {subtitle}
          </p>
        )}
      </div>
    </header>
  );
}