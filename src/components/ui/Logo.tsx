import React from 'react';
import { cn } from '../../lib/utils';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'light' | 'dark';
  showText?: boolean;
  className?: string;
}

export const Logo: React.FC<LogoProps> = ({ 
  size = 'md', 
  variant = 'dark',
  showText = true,
  className 
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  const textSizeClasses = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-3xl'
  };

  const colorClasses = {
    light: 'text-white',
    dark: 'text-gray-900'
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Logo Icon */}
      <div className={cn(
        'rounded-lg flex items-center justify-center font-bold text-white bg-gradient-to-br from-red-500 to-red-600 shadow-lg',
        sizeClasses[size]
      )}>
        <span className={cn(
          'font-bold',
          size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-xl'
        )}>
          N
        </span>
      </div>

      {/* Brand Name */}
      {showText && (
        <div className="flex flex-col">
          <span className={cn(
            'font-bold leading-tight',
            textSizeClasses[size],
            colorClasses[variant]
          )}>
            Nevellines
          </span>
          {(size === 'lg' || size === 'xl') && (
            <span className={cn(
              'text-xs leading-tight',
              variant === 'light' ? 'text-gray-200' : 'text-gray-600'
            )}>
              Your Style Destination
            </span>
          )}
        </div>
      )}
    </div>
  );
};