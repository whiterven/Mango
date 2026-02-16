import React from 'react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  action?: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className, title, action }) => (
  // Increased radius to xl/2xl for "cute" look, reduced padding to p-4 for "tighter" look
  <div className={`bg-slate-800/40 border border-slate-700/50 rounded-2xl p-4 backdrop-blur-sm ${className || ''}`}>
    {(title || action) && (
      <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-700/50">
        {title && <h3 className="text-xs font-bold text-white uppercase tracking-wider">{title}</h3>}
        {action && <div>{action}</div>}
      </div>
    )}
    {children}
  </div>
);