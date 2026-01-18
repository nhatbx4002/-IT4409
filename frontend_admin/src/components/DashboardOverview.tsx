import React from 'react';
import { TrendingUp, TrendingDown, Package, DollarSign, ShoppingCart, Users } from 'lucide-react';

const kpiData = [
  {
    label: 'Total Revenue',
    value: '₫489.5M',
    trend: '+12.5%',
    isPositive: true,
    icon: DollarSign,
  },
  {
    label: 'Orders',
    value: '1,234',
    trend: '+8.2%',
    isPositive: true,
    icon: ShoppingCart,
  },
  {
    label: 'Products Sold',
    value: '3,456',
    trend: '-3.1%',
    isPositive: false,
    icon: Package,
  },
  {
    label: 'Active Customers',
    value: '892',
    trend: '+15.3%',
    isPositive: true,
    icon: Users,
  },
];

const recentOrders = [
  {
    id: 'ORD-001',
    product: 'Classic Navy Suit',
    customer: 'Nguyễn Văn A',
    amount: '₫12.5M',
    status: 'Completed',
    date: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop',
  },
  {
    id: 'ORD-002',
    product: 'Silk Evening Dress',
    customer: 'Trần Thị B',
    amount: '₫8.9M',
    status: 'Processing',
    date: '2024-01-15',
    image: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=400&h=500&fit=crop',
  },
  {
    id: 'ORD-003',
    product: 'Leather Oxford Shoes',
    customer: 'Lê Văn C',
    amount: '₫4.2M',
    status: 'Completed',
    date: '2024-01-14',
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400&h=500&fit=crop',
  },
  {
    id: 'ORD-004',
    product: 'Cashmere Overcoat',
    customer: 'Phạm Thị D',
    amount: '₫15.8M',
    status: 'Shipped',
    date: '2024-01-14',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=500&fit=crop',
  },
  {
    id: 'ORD-005',
    product: 'Tailored Blazer',
    customer: 'Hoàng Văn E',
    amount: '₫9.3M',
    status: 'Completed',
    date: '2024-01-13',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=500&fit=crop',
  },
];

export function DashboardOverview() {
  return (
    <div className="space-y-8">
      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={kpi.label}
              className="bg-white border border-border-light border-t-[3px] border-t-brand-gold p-6"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 bg-brand-black/5 flex items-center justify-center">
                  <Icon className="w-6 h-6 text-brand-gold" strokeWidth={1.5} />
                </div>
                <div className="flex items-center gap-1">
                  {kpi.isPositive ? (
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-600" />
                  )}
                  <span className={`text-xs ${kpi.isPositive ? 'text-green-600' : 'text-red-600'}`}>
                    {kpi.trend}
                  </span>
                </div>
              </div>
              <p className="text-xs uppercase tracking-widest text-gray-500 mb-2 font-sans">
                {kpi.label}
              </p>
              <p className="font-serif text-3xl text-brand-black">
                {kpi.value}
              </p>
            </div>
          );
        })}
      </div>

      {/* Recent Orders Section */}
      <div className="bg-white border border-border-light">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border-light">
          <h3 className="font-serif text-xl">Recent Transactions</h3>
          <button className="bg-brand-gold hover:bg-brand-gold-hover text-brand-black px-6 py-2.5 uppercase text-xs tracking-wider transition-colors">
            Export Report
          </button>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#F9F9F9]">
                <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest font-semibold text-gray-600">
                  Order ID
                </th>
                <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest font-semibold text-gray-600">
                  Product
                </th>
                <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest font-semibold text-gray-600">
                  Customer
                </th>
                <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest font-semibold text-gray-600">
                  Amount
                </th>
                <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest font-semibold text-gray-600">
                  Status
                </th>
                <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest font-semibold text-gray-600">
                  Date
                </th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-border-light hover:bg-gray-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <span className="font-mono text-sm font-medium">{order.id}</span>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-16 flex-shrink-0 overflow-hidden bg-gray-100">
                        <img 
                          src={order.image} 
                          alt={order.product}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="font-serif font-medium text-sm">{order.product}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm">{order.customer}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="font-semibold text-sm">{order.amount}</span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="inline-block bg-brand-black text-brand-gold px-3 py-1 text-[10px] uppercase tracking-wider">
                      {order.status}
                    </span>
                  </td>
                  <td className="px-6 py-5">
                    <span className="text-sm text-gray-600">{order.date}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
