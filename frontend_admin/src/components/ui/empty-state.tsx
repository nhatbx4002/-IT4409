import React from 'react';
import { Package, Users, ShoppingCart, Tag } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmptyStateProps {
  type: 'products' | 'orders' | 'users' | 'discounts' | 'general';
  title?: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const icons = {
  products: Package,
  orders: ShoppingCart,
  users: Users,
  discounts: Tag,
  general: Package
};

const defaultMessages = {
  products: {
    title: 'No products found',
    description: 'Get started by adding your first product to the inventory.'
  },
  orders: {
    title: 'No orders found',
    description: 'There are no orders matching your current filters.'
  },
  users: {
    title: 'No users found',
    description: 'There are no users registered in the system yet.'
  },
  discounts: {
    title: 'No discounts found',
    description: 'Create discount codes to boost your sales.'
  },
  general: {
    title: 'No data found',
    description: 'There is no data to display at the moment.'
  }
};

export const EmptyState: React.FC<EmptyStateProps> = ({
  type,
  title,
  description,
  action,
  className = ''
}) => {
  const Icon = icons[type];
  const defaultMessage = defaultMessages[type];

  return (
    <div className={cn('text-center py-12', className)}>
      <div className="mx-auto w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <Icon className="h-6 w-6 text-gray-400" />
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        {title || defaultMessage.title}
      </h3>
      <p className="text-gray-500 mb-6 max-w-sm mx-auto">
        {description || defaultMessage.description}
      </p>
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
};