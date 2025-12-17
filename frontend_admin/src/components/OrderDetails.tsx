import React from 'react';
import { Printer, Check } from 'lucide-react';

const orderData = {
  id: 'ORD-001',
  date: '2024-01-15',
  customer: {
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '+84 912 345 678',
  },
  shippingAddress: {
    street: '123 Đường Nguyễn Huệ',
    city: 'Quận 1, Hồ Chí Minh',
    postalCode: '700000',
    country: 'Vietnam',
  },
  billingAddress: {
    street: '123 Đường Nguyễn Huệ',
    city: 'Quận 1, Hồ Chí Minh',
    postalCode: '700000',
    country: 'Vietnam',
  },
  items: [
    {
      id: 1,
      name: 'Classic Navy Suit',
      sku: 'ARN-NS-2024-001',
      quantity: 1,
      price: 12500000,
      image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop',
    },
    {
      id: 2,
      name: 'Premium Cotton Shirt',
      sku: 'ARN-SH-2024-005',
      quantity: 2,
      price: 2500000,
      image: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=400&h=500&fit=crop',
    },
  ],
  subtotal: 17500000,
  shipping: 500000,
  tax: 1750000,
  total: 19750000,
  status: 'shipped',
};

const statusSteps = [
  { id: 'placed', label: 'Placed', completed: true },
  { id: 'paid', label: 'Paid', completed: true },
  { id: 'shipped', label: 'Shipped', completed: true },
  { id: 'delivered', label: 'Delivered', completed: false },
];

export function OrderDetails() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(amount);
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Action Buttons */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-serif text-3xl">Order Details</h1>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-brand-black text-brand-black px-5 py-2.5 uppercase text-xs tracking-wider hover:bg-brand-black hover:text-white transition-colors flex items-center gap-2">
            <Printer className="w-4 h-4" />
            Print Invoice
          </button>
          <button className="bg-brand-gold hover:bg-brand-gold-hover text-brand-black px-5 py-2.5 uppercase text-xs tracking-wider transition-colors">
            Update Status
          </button>
        </div>
      </div>

      {/* Paper Container */}
      <div className="bg-white border border-border-light shadow-lg">
        {/* Header */}
        <div className="border-b border-border-light py-8 px-10 text-center">
          <h2 className="font-serif text-brand-gold text-4xl mb-3 uppercase tracking-wide">
            Aristino
          </h2>
          <p className="font-mono text-sm text-gray-600">
            Order ID: <span className="font-semibold text-brand-black">{orderData.id}</span>
          </p>
          <p className="text-sm text-gray-600 mt-1">
            {new Date(orderData.date).toLocaleDateString('vi-VN', { 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </p>
        </div>

        {/* Status Timeline */}
        <div className="border-b border-border-light py-8 px-10">
          <div className="flex items-center justify-between max-w-2xl mx-auto">
            {statusSteps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center">
                  <div 
                    className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-colors
                      ${step.completed 
                        ? 'bg-brand-gold border-brand-gold' 
                        : 'bg-white border-gray-300'
                      }
                    `}
                  >
                    {step.completed && (
                      <Check className="w-5 h-5 text-brand-black" strokeWidth={3} />
                    )}
                  </div>
                  <p 
                    className={`mt-2 text-xs uppercase tracking-wider
                      ${step.completed ? 'text-brand-black font-semibold' : 'text-gray-400'}
                    `}
                  >
                    {step.label}
                  </p>
                </div>
                {index < statusSteps.length - 1 && (
                  <div 
                    className={`flex-1 h-0.5 mx-2 -mt-6
                      ${step.completed && statusSteps[index + 1].completed 
                        ? 'bg-brand-gold' 
                        : 'bg-gray-300'
                      }
                    `}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Customer & Address Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-border-light py-8 px-10">
          {/* Shipping Address */}
          <div>
            <h3 className="font-serif text-lg mb-4">Shipping Address</h3>
            <div className="space-y-1 text-sm">
              <p className="font-semibold">{orderData.customer.name}</p>
              <p className="text-gray-600">{orderData.shippingAddress.street}</p>
              <p className="text-gray-600">{orderData.shippingAddress.city}</p>
              <p className="text-gray-600">{orderData.shippingAddress.postalCode}</p>
              <p className="text-gray-600">{orderData.shippingAddress.country}</p>
              <p className="text-gray-600 mt-3">{orderData.customer.phone}</p>
              <p className="text-gray-600">{orderData.customer.email}</p>
            </div>
          </div>

          {/* Billing Address */}
          <div>
            <h3 className="font-serif text-lg mb-4">Billing Address</h3>
            <div className="space-y-1 text-sm">
              <p className="font-semibold">{orderData.customer.name}</p>
              <p className="text-gray-600">{orderData.billingAddress.street}</p>
              <p className="text-gray-600">{orderData.billingAddress.city}</p>
              <p className="text-gray-600">{orderData.billingAddress.postalCode}</p>
              <p className="text-gray-600">{orderData.billingAddress.country}</p>
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="border-b border-border-light py-8 px-10">
          <h3 className="font-serif text-lg mb-6">Order Items</h3>
          <div className="space-y-4">
            {orderData.items.map((item) => (
              <div key={item.id} className="flex items-center gap-6 py-4 border-b border-border-light/50 last:border-0">
                <div className="w-16 h-20 flex-shrink-0 overflow-hidden bg-gray-100">
                  <img 
                    src={item.image} 
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1">
                  <p className="font-serif font-semibold text-sm mb-1">{item.name}</p>
                  <p className="font-mono text-xs text-gray-500">{item.sku}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Qty: {item.quantity}</p>
                  <p className="font-semibold">{formatCurrency(item.price)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="py-8 px-10">
          <div className="max-w-sm ml-auto space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span>{formatCurrency(orderData.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span>{formatCurrency(orderData.shipping)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Tax (10%)</span>
              <span>{formatCurrency(orderData.tax)}</span>
            </div>
            <div className="pt-3 border-t border-border-light">
              <div className="flex items-center justify-between">
                <span className="font-serif text-lg">Total</span>
                <span className="font-serif text-2xl text-brand-gold">
                  {formatCurrency(orderData.total)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <div className="border-t border-border-light py-6 px-10 bg-gray-50/50 text-center">
          <p className="text-xs text-gray-500 italic">
            Thank you for your business. For any inquiries, please contact support@aristino.com
          </p>
        </div>
      </div>
    </div>
  );
}
