import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { Card, CardContent } from '../ui/Card';
import { cn } from '../../lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  change?: {
    value: number;
    trend: 'up' | 'down' | 'neutral';
  };
  description?: string;
  className?: string;
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  change,
  description,
  className,
}) => {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
            <div className="mt-2 flex items-baseline">
              <motion.p 
                className="text-2xl font-semibold text-gray-900 dark:text-white"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {value}
              </motion.p>
              
              {change && (
                <span
                  className={`ml-2 text-xs font-medium flex items-center ${
                    change.trend === 'up'
                      ? 'text-success-500'
                      : change.trend === 'down'
                      ? 'text-error-500'
                      : 'text-gray-500'
                  }`}
                >
                  {change.trend === 'up' ? (
                    <ArrowUp size={12} className="mr-0.5" />
                  ) : change.trend === 'down' ? (
                    <ArrowDown size={12} className="mr-0.5" />
                  ) : null}
                  {Math.abs(change.value)}%
                </span>
              )}
            </div>
            
            {description && (
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                {description}
              </p>
            )}
          </div>
          
          <div className="p-3 rounded-full bg-primary-100 dark:bg-primary-900/20">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;