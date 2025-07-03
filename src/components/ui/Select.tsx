// select.ts
import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const selectVariants = cva(
  'block w-full rounded-md border bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition disabled:opacity-50 disabled:cursor-not-allowed',
  {
    variants: {
      size: {
        default: 'py-2 px-3 text-sm',
        sm: 'py-1 px-2 text-xs',
        lg: 'py-3 px-4 text-base',
      },
      variant: {
        default: 'border-gray-300 dark:border-gray-700',
        outline: 'border-2 border-primary-500',
      },
    },
    defaultVariants: {
      size: 'default',
      variant: 'default',
    },
  }
);

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface SelectProps
  extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'size'>,
    VariantProps<typeof selectVariants> {
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ options, placeholder, className, size, variant, ...props }, ref) => {
    return (
      <select
        ref={ref}
        className={cn(selectVariants({ size, variant, className }))}
        {...props}
      >
        {placeholder && (
          <option value="" disabled={!!props.required} hidden={!!props.required}>
            {placeholder}
          </option>
        )}
        {options.map((opt) => (
          <option
            key={opt.value}
            value={opt.value}
            disabled={opt.disabled}
          >
            {opt.label}
          </option>
        ))}
      </select>
    );
  }
);

Select.displayName = 'Select';
