import React from 'react';

export const Badge: React.FC<{ children: React.ReactNode; color?: 'green' | 'blue' | 'yellow' | 'red' | 'brand' }> = ({ children, color = 'brand' }) => {
  const colors = {
    green: "bg-green-900/30 text-green-400 border-green-800",
    blue: "bg-blue-900/30 text-blue-400 border-blue-800",
    yellow: "bg-yellow-900/30 text-yellow-400 border-yellow-800",
    red: "bg-red-900/30 text-red-400 border-red-800",
    brand: "bg-brand-900/30 text-brand-400 border-brand-800"
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${colors[color]}`}>
      {children}
    </span>
  );
};
