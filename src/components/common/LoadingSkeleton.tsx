import React from 'react';
import { cn } from '@/utils/cn';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'circular' | 'rectangular';
  count?: number;
}

export const LoadingSkeleton: React.FC<SkeletonProps> = ({
  className,
  variant = 'rectangular',
  count = 1,
}) => {
  const baseClasses = 'animate-pulse bg-lapis-700/50';
  const variantClasses = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className={cn(baseClasses, variantClasses[variant], className)}
          role="status"
          aria-label="Loading"
        />
      ))}
    </>
  );
};

export const CardSkeleton: React.FC = () => (
  <div className="p-4 rounded-xl bg-lapis-800/40 border border-gold-500/20 space-y-3">
    <LoadingSkeleton variant="circular" className="w-12 h-12" />
    <LoadingSkeleton variant="text" className="w-3/4" />
    <LoadingSkeleton variant="text" className="w-1/2" />
  </div>
);