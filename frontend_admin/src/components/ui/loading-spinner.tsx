import React from 'react';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  text?: string;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
  size = 'md',
  className = '',
  text
}) => {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-6 w-6',
    lg: 'h-8 w-8'
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <Loader2 className={cn('animate-spin text-primary', sizeClasses[size])} />
      {text && (
        <span className="ml-2 text-sm text-muted-foreground">{text}</span>
      )}
    </div>
  );
};

interface LoadingStateProps {
  loading: boolean;
  error: string | null;
  children: React.ReactNode;
  fallback?: React.ReactNode;
  errorComponent?: React.ReactNode;
  onRetry?: () => void;
  className?: string;
}

export const LoadingState: React.FC<LoadingStateProps> = ({
  loading,
  error,
  children,
  fallback,
  errorComponent,
  onRetry,
  className = ''
}) => {
  if (loading) {
    return (
      fallback || (
        <div className={`flex items-center justify-center p-8 ${className}`}>
          <LoadingSpinner size="lg" text="Loading..." />
        </div>
      )
    );
  }

  if (error) {
    return (
      errorComponent || (
        <div className={`p-8 ${className}`}>
          <ApiError error={error} onRetry={onRetry} />
        </div>
      )
    );
  }

  return <>{children}</>;
};