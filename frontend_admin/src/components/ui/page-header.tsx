import React from 'react';
import { Plus } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ReactNode;
  };
  children?: React.ReactNode;
  className?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  description,
  action,
  children,
  className = ''
}) => {
  return (
    <div className={cn('mb-8', className)}>
      <div className="md:flex md:items-center md:justify-between">
        <div className="min-w-0 flex-1">
          <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            {title}
          </h2>
          {description && (
            <p className="mt-1 text-sm text-gray-500">{description}</p>
          )}
        </div>
        <div className="mt-4 flex md:ml-4 md:mt-0">
          {action && (
            <Button onClick={action.onClick}>
              {action.icon || <Plus className="h-4 w-4 mr-2" />}
              {action.label}
            </Button>
          )}
          {children}
        </div>
      </div>
    </div>
  );
};