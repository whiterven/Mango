import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  children, variant = 'primary', size = 'md', isLoading, className, ...props 
}) => {
  // Changed to rounded-full for "cute" look, added active:scale-95 for tactile feel
  const baseStyle = "font-bold tracking-wide rounded-full transition-all duration-200 flex items-center justify-center gap-1.5 focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-900 active:scale-95";
  
  const variants = {
    primary: "bg-gradient-to-r from-brand-500 to-brand-400 hover:from-brand-400 hover:to-brand-300 text-white shadow-lg shadow-brand-500/20 focus:ring-brand-500 border border-transparent",
    secondary: "bg-slate-700 hover:bg-slate-600 text-white focus:ring-slate-500 border border-slate-600",
    outline: "border border-slate-600 text-slate-300 hover:border-slate-400 hover:text-white hover:bg-slate-800 focus:ring-slate-500",
    danger: "bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-900/50"
  };

  // Made sizes "shorter" and tighter
  const sizes = {
    sm: "px-3 py-0.5 text-[10px]",
    md: "px-4 py-1.5 text-xs",
    lg: "px-6 py-2 text-sm"
  };

  return (
    <button 
      className={`${baseStyle} ${variants[variant]} ${sizes[size]} ${className || ''} ${isLoading ? 'opacity-70 cursor-not-allowed transform-none' : ''}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading && (
        <svg className="animate-spin -ml-1 mr-1.5 h-3 w-3 text-current" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      )}
      {children}
    </button>
  );
};