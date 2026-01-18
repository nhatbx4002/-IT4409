import React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const statusVariants = cva(
  'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
  {
    variants: {
      variant: {
        success: 'bg-green-100 text-green-800',
        warning: 'bg-yellow-100 text-yellow-800',
        error: 'bg-red-100 text-red-800',
        info: 'bg-blue-100 text-blue-800',
        gray: 'bg-gray-100 text-gray-800'
      }
    },
    defaultVariants: {
      variant: 'gray'
    }
  }
);

interface StatusBadgeProps extends VariantProps<typeof statusVariants> {
  children: React.ReactNode;
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  variant,
  children,
  className
}) => {
  return (
    <span className={cn(statusVariants({ variant }), className)}>
      {children}
    </span>
  );
};

// Predefined status badges for common use cases
export const OrderStatusBadge: React.FC<{ status: string; className?: string }> = ({ status, className }) => {
  const statusConfig: Record<string, { label: string; variant: VariantProps<typeof statusVariants>['variant'] }> = {
    pending: { label: 'Pending', variant: 'warning' },
    confirmed: { label: 'Confirmed', variant: 'info' },
    shipping: { label: 'Shipping', variant: 'info' },
    completed: { label: 'Completed', variant: 'success' },
    canceled: { label: 'Canceled', variant: 'error' },
    paid: { label: 'Paid', variant: 'success' },
    refunded: { label: 'Refunded', variant: 'error' }
  };

  const config = statusConfig[status.toLowerCase()] || { label: status, variant: 'gray' as const };

  return (
    <StatusBadge variant={config.variant} className={className}>
      {config.label}
    </StatusBadge>
  );
};

export const ProductStatusBadge: React.FC<{ status: string; className?: string }> = ({ status, className }) => {
  const statusConfig: Record<string, { label: string; variant: VariantProps<typeof statusVariants>['variant'] }> = {
    active: { label: 'Active', variant: 'success' },
    inactive: { label: 'Inactive', variant: 'error' },
    draft: { label: 'Draft', variant: 'gray' }
  };

  const config = statusConfig[status.toLowerCase()] || { label: status, variant: 'gray' as const };

  return (
    <StatusBadge variant={config.variant} className={className}>
      {config.label}
    </StatusBadge>
  );
};

export const UserRoleBadge: React.FC<{ role: string; className?: string }> = ({ role, className }) => {
  const roleConfig: Record<string, { label: string; variant: VariantProps<typeof statusVariants>['variant'] }> = {
    admin: { label: 'Admin', variant: 'warning' },
    customer: { label: 'Customer', variant: 'info' }
  };

  const config = roleConfig[role.toLowerCase()] || { label: role, variant: 'gray' as const };

  return (
    <StatusBadge variant={config.variant} className={className}>
      {config.label}
    </StatusBadge>
  );
};

export const DiscountStatusBadge: React.FC<{ isActive?: boolean; className?: string }> = ({ isActive, className }) => {
  return (
    <StatusBadge variant={isActive ? 'success' : 'error'} className={className}>
      {isActive ? 'Active' : 'Inactive'}
    </StatusBadge>
  );
};