import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface KpiCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon?: ReactNode;
  trend?: 'up' | 'down' | 'neutral';
  trendValue?: string;
  variant?: 'default' | 'emergency' | 'success' | 'warning';
  className?: string;
}

const variantStyles = {
  default: 'glass-card neon-border',
  emergency: 'emergency-critical',
  success: 'emergency-safe',
  warning: 'emergency-high'
};

export function KpiCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  trendValue,
  variant = 'default',
  className
}: KpiCardProps) {
  return (
    <motion.div
      className={cn(
        'p-6 rounded-lg tilt-effect magnetic relative overflow-hidden group cursor-pointer',
        variantStyles[variant],
        className
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background pulse effect */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="p-2 rounded-md bg-primary/10 text-primary">
                {icon}
              </div>
            )}
            <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
              {title}
            </h3>
          </div>
          
          {trend && trendValue && (
            <div className={cn(
              'flex items-center gap-1 text-xs px-2 py-1 rounded-full',
              trend === 'up' && 'bg-success/20 text-success',
              trend === 'down' && 'bg-danger/20 text-danger',
              trend === 'neutral' && 'bg-muted/20 text-muted-foreground'
            )}>
              <span className={cn(
                'w-2 h-2 rounded-full',
                trend === 'up' && 'bg-success',
                trend === 'down' && 'bg-danger',
                trend === 'neutral' && 'bg-muted-foreground'
              )} />
              {trendValue}
            </div>
          )}
        </div>

        {/* Value */}
        <div className="mb-2">
          <motion.div 
            className="text-3xl font-bold font-heading number-scrub"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          >
            {value}
          </motion.div>
          {subtitle && (
            <p className="text-sm text-muted-foreground mt-1">
              {subtitle}
            </p>
          )}
        </div>

        {/* Scan line effect */}
        <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
    </motion.div>
  );
}