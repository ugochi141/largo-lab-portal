/**
 * Skeleton Loader Component
 * Provides loading placeholders for content
 */

import React from 'react';

interface SkeletonProps {
  className?: string;
  variant?: 'text' | 'rect' | 'circle';
  width?: string;
  height?: string;
  lines?: number;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  className = '',
  variant = 'text',
  width,
  height,
  lines = 1
}) => {
  const baseClass = 'animate-pulse bg-neutral-200 rounded';

  const variantClasses = {
    text: 'h-4',
    rect: 'h-24',
    circle: 'rounded-full'
  };

  const style = {
    width: width || (variant === 'circle' ? height : '100%'),
    height: height || variantClasses[variant]
  };

  if (variant === 'text' && lines > 1) {
    return (
      <div className={`space-y-2 ${className}`}>
        {Array.from({ length: lines }).map((_, index) => (
          <div
            key={index}
            className={`${baseClass} ${variantClasses.text}`}
            style={{ width: index === lines - 1 ? '80%' : '100%' }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`${baseClass} ${className}`}
      style={style}
    />
  );
};

// Table Skeleton
export const TableSkeleton: React.FC<{ rows?: number; columns?: number }> = ({
  rows = 5,
  columns = 4
}) => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex gap-4">
        {Array.from({ length: columns }).map((_, i) => (
          <div key={i} className="flex-1">
            <Skeleton height="h-10" />
          </div>
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} className="flex gap-4">
          {Array.from({ length: columns }).map((_, colIndex) => (
            <div key={colIndex} className="flex-1">
              <Skeleton height="h-12" />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

// Card Skeleton
export const CardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
      <Skeleton variant="circle" width="3rem" height="3rem" />
      <Skeleton lines={2} />
      <div className="flex gap-2">
        <Skeleton width="5rem" height="h-8" />
        <Skeleton width="5rem" height="h-8" />
      </div>
    </div>
  );
};

// List Skeleton
export const ListSkeleton: React.FC<{ items?: number }> = ({ items = 5 }) => {
  return (
    <div className="space-y-3">
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center gap-4 p-4 bg-white rounded-lg shadow">
          <Skeleton variant="circle" width="2.5rem" height="2.5rem" />
          <div className="flex-1">
            <Skeleton lines={2} />
          </div>
        </div>
      ))}
    </div>
  );
};

export default Skeleton;
