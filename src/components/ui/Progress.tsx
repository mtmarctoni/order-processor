import React from 'react';
import { cn } from '../../lib/utils';

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  color?: 'default' | 'success' | 'warning' | 'error';
  showValue?: boolean;
  animate?: boolean;
}

const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ 
    className, 
    value = 0, 
    max = 100, 
    size = 'md', 
    color = 'default',
    showValue = false,
    animate = true,
    ...props 
  }, ref) => {
    // Ensure value is between 0 and max
    const percentage = Math.min(Math.max(0, value), max) / max * 100;
    
    const sizeClasses = {
      sm: 'h-1',
      md: 'h-2',
      lg: 'h-3',
    };
    
    const colorClasses = {
      default: 'bg-primary-500',
      success: 'bg-success-500',
      warning: 'bg-warning-500',
      error: 'bg-error-500',
    };
    
    return (
      <div className={cn('w-full flex items-center gap-2', className)} ref={ref} {...props}>
        <div className="w-full overflow-hidden bg-gray-200 dark:bg-gray-700 rounded-full">
          <div 
            className={cn(
              sizeClasses[size],
              colorClasses[color],
              animate && 'transition-all duration-300 ease-in-out',
              'rounded-full'
            )}
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
          />
        </div>
        
        {showValue && (
          <span className="text-xs font-medium text-gray-700 dark:text-gray-300 min-w-[40px] text-right">
            {Math.round(percentage)}%
          </span>
        )}
      </div>
    );
  }
);

Progress.displayName = 'Progress';

export { Progress };