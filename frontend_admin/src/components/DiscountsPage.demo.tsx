/**
 * Luxury Discount Management Dashboard - Demo
 *
 * This demo showcases the luxury minimalist discount management interface
 * with high-end fashion editorial aesthetics.
 *
 * Features:
 * - Serif typography (Playfair Display) for headings and KPIs
 * - Clean sans-serif (Manrope/Inter) for UI elements
 * - Off-white background (#F5F5F7)
 * - Black sidebar (#050505)
 * - Gold accents (#Cfb187)
 * - Premium voucher card visualization
 * - Split-screen create/edit modal with live preview
 */

import React, { useState } from 'react';
import {
  Ticket,
  TrendingUp,
  Users,
  DollarSign,
  Calendar,
  Copy,
  Eye,
  EyeOff,
  Edit2,
  Trash2,
  Plus,
  Search,
  Filter,
  Sparkles,
} from 'lucide-react';
import {
  formatDiscountValue,
  getStatusBadge,
  formatCurrency,
  formatNumber,
  generateDiscountCode,
  type Discount,
  type DiscountType,
  type ApplyType,
} from '../lib/discounts';

// Mock Data
const mockDiscounts: Discount[] = [
  {
    id: 1,
    name: 'Summer Collection 2024',
    code: 'SUMMER24',
    description: 'Special discount for summer collection items',
    discount_type: 'percentage',
    discount_value: 20,
    max_discount_amount: 500000,
    min_order_value: 1000000,
    apply_type: 'code',
    start_date: '2024-01-01T00:00:00Z',
    end_date: '2024-12-31T23:59:59Z',
    usage_limit: 1000,
    usage_count: 342,
    applicable_to: 'all',
    target_ids: null,
    is_active: true,
    created_at: '2024-01-01T00:00:00Z',
    updated_at: '2024-01-15T00:00:00Z',
  },
  {
    id: 2,
    name: 'Flash Sale - Free Shipping',
    code: null,
    description: 'Automatic free shipping for orders over 500K',
    discount_type: 'free_shipping',
    discount_value: 0,
    min_order_value: 500000,
    apply_type: 'auto_apply',
    start_date: '2024-06-01T00:00:00Z',
    end_date: '2024-06-30T23:59:59Z',
    usage_limit: 5000,
    usage_count: 1205,
    applicable_to: 'all',
    target_ids: null,
    is_active: true,
  },
  {
    id: 3,
    name: 'VIP Exclusive',
    code: 'VIP2024',
    description: 'Exclusive discount for VIP customers',
    discount_type: 'fixed_amount',
    discount_value: 200000,
    min_order_value: 2000000,
    apply_type: 'code',
    usage_limit: 100,
    usage_count: 78,
    applicable_to: 'all',
    target_ids: null,
    is_active: true,
  },
  {
    id: 4,
    name: 'Expired Campaign',
    code: 'OLD2023',
    description: 'This campaign has ended',
    discount_type: 'percentage',
    discount_value: 15,
    apply_type: 'code',
    start_date: '2023-01-01T00:00:00Z',
    end_date: '2023-12-31T23:59:59Z',
    usage_limit: 1000,
    usage_count: 856,
    applicable_to: 'all',
    target_ids: null,
    is_active: false,
  },
];

const mockKPI = {
  totalRevenueImpact: 125000000,
  totalRedemptions: 2481,
  activeCoupons: 3,
  expiredCoupons: 15,
  averageDiscountValue: 50000,
  redemptionsProgress: {
    current: 2481,
    total: 6000,
    percentage: 41.35,
  },
};

// ============== COMPONENTS ==============

/**
 * VoucherCard - Premium visual representation of a coupon
 * Black background with gold accents and dashed border
 */
const VoucherCard: React.FC<{ discount: Discount; size?: 'normal' | 'large' }> = ({
  discount,
  size = 'normal',
}) => {
  const isLarge = size === 'large';
  const paddingClass = isLarge ? 'p-8' : 'p-6';
  const titleSize = isLarge ? 'text-2xl' : 'text-lg';
  const codeSize = isLarge ? 'text-3xl' : 'text-xl';
  const valueSize = isLarge ? 'text-4xl' : 'text-2xl';

  return (
    <div
      className={`relative bg-[#050505] rounded-2xl overflow-hidden ${paddingClass} border border-[#Cfb187] shadow-2xl`}
      style={{
        background: 'linear-gradient(135deg, #050505 0%, #1a1a1a 100%)',
      }}
    >
      {/* Decorative gold accent */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#Cfb187] opacity-10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-[#Cfb187] opacity-10 rounded-full blur-2xl transform -translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10">
        {/* Campaign Name */}
        <h3 className={`${titleSize} font-serif font-bold text-white mb-2`} style={{ fontFamily: "'Playfair Display', serif" }}>
          {discount.name}
        </h3>

        {/* Dashed divider */}
        <div className="border-t-2 border-dashed border-[#Cfb187]/40 my-4" />

        {/* Discount Value */}
        <div className="mb-4">
          <p className="text-[#Cfb187]/60 text-xs uppercase tracking-widest mb-1">Discount</p>
          <p className={`${valueSize} font-serif font-bold text-[#Cfb187]`} style={{ fontFamily: "'Playfair Display', serif" }}>
            {formatDiscountValue(discount)}
          </p>
        </div>

        {/* Code Section */}
        {discount.code && (
          <div className="bg-white/5 rounded-lg p-3 border border-[#Cfb187]/20">
            <p className="text-[#Cfb187]/60 text-xs uppercase tracking-widest mb-2">Coupon Code</p>
            <p className={`${codeSize} font-mono font-bold text-white tracking-wider`} style={{ fontFamily: 'monospace' }}>
              {discount.code.toUpperCase()}
            </p>
          </div>
        )}

        {/* Footer info */}
        <div className="mt-4 flex items-center justify-between text-xs text-white/40">
          <span>{discount.usage_count || 0} / {discount.usage_limit || '∞'} used</span>
          {discount.end_date && (
            <span>Expires {new Date(discount.end_date).toLocaleDateString('vi-VN')}</span>
          )}
        </div>
      </div>
    </div>
  );
};

/**
 * KPICard - Metric display with optional progress bar
 */
const KPICard: React.FC<{
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: string;
  trendPositive?: boolean;
  progress?: { current: number; total: number; percentage: number };
}> = ({ title, value, subtitle, icon: Icon, trend, trendPositive, progress }) => (
  <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(198,168,124,0.15)] transition-all duration-300 border border-gray-100 p-6 relative overflow-hidden group">
    {/* Top accent bar */}
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#Cfb187] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 rounded-lg bg-[#F5F5F7] flex items-center justify-center group-hover:bg-[#Cfb187] transition-colors duration-300">
        <Icon className="w-6 h-6 text-[#Cfb187] group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${trendPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
          <TrendingUp className="w-3 h-3" />
          {trend}
        </div>
      )}
    </div>

    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
    <div className="flex items-baseline gap-1">
      <span className="text-3xl text-[#111111] font-bold tracking-tight" style={{ fontFamily: "'Playfair Display', serif" }}>
        {value}
      </span>
    </div>

    {subtitle && <p className="text-gray-400 text-xs mt-2">{subtitle}</p>}

    {/* Progress bar for redemptions */}
    {progress && (
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs mb-2">
          <span className="text-gray-500">Redemptions</span>
          <span className="font-bold text-[#111111]">{progress.current} / {progress.total}</span>
        </div>
        <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-[#Cfb187] to-[#B08D55] rounded-full transition-all duration-500" style={{ width: `${Math.min(progress.percentage, 100)}%` }} />
        </div>
        <p className="text-xs text-gray-400 mt-1">{progress.percentage.toFixed(1)}% used</p>
      </div>
    )}
  </div>
);

/**
 * CreateDiscountModal - Split-screen form with live preview
 */
const CreateDiscountModal: React.FC<{
  discount?: Discount | null;
  onClose: () => void;
}> = ({ discount, onClose }) => {
  const [formData, setFormData] = useState({
    name: discount?.name || '',
    code: discount?.code || '',
    description: discount?.description || '',
    discount_type: discount?.discount_type || 'percentage' as DiscountType,
    discount_value: discount?.discount_value || '',
    max_discount_amount: discount?.max_discount_amount || '',
    min_order_value: discount?.min_order_value || '',
    apply_type: discount?.apply_type || 'code' as ApplyType,
    start_date: discount?.start_date?.split('T')[0] || '',
    end_date: discount?.end_date?.split('T')[0] || '',
    usage_limit: discount?.usage_limit || 1000,
    applicable_to: discount?.applicable_to || 'all',
    is_active: discount?.is_active ?? true,
  });

  const handleGenerateCode = async () => {
    const code = await generateDiscountCode(8);
    setFormData({ ...formData, code });
  };

  const previewDiscount: Discount = {
    id: 0,
    ...formData,
    code: formData.apply_type === 'code' ? formData.code || 'XXXXXX' : null,
    usage_count: 0,
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full my-8 flex flex-col lg:flex-row overflow-hidden">
        {/* Left Panel - Form */}
        <div className="flex-1 p-8 overflow-y-auto">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#111111]" style={{ fontFamily: "'Playfair Display', serif" }}>
              {discount ? 'Edit Campaign' : 'Create New Campaign'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
              ✕
            </button>
          </div>

          <div className="space-y-6">
            {/* Campaign Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Campaign Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-[#F5F5F7] border border-transparent focus:border-[#Cfb187] rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#Cfb187] transition-colors"
                placeholder="e.g., Summer Sale 2024"
              />
            </div>

            {/* Apply Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Apply Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['code', 'auto_apply'] as ApplyType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, apply_type: type })}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      formData.apply_type === type
                        ? 'border-[#Cfb187] bg-[#Cfb187]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 ${
                        formData.apply_type === type ? 'border-[#Cfb187] bg-[#Cfb187]' : 'border-gray-300'
                      }`} />
                      <div>
                        <p className="font-bold text-sm text-[#111111] capitalize">
                          {type === 'code' ? 'Coupon Code' : 'Auto Apply'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {type === 'code' ? 'User enters code at checkout' : 'Automatically applied'}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Coupon Code */}
            {formData.apply_type === 'code' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Coupon Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                    className="flex-1 bg-[#F5F5F7] border border-transparent focus:border-[#Cfb187] rounded-lg px-4 py-3 text-sm font-mono font-bold focus:outline-none focus:ring-1 focus:ring-[#Cfb187] transition-colors"
                    placeholder="SUMMER24"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateCode}
                    className="px-4 py-3 bg-[#F5F5F7] hover:bg-gray-200 rounded-lg text-sm font-bold text-[#111111] transition-colors flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Generate
                  </button>
                </div>
              </div>
            )}

            {/* Discount Type & Value */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-3">
                Discount Type
              </label>
              <div className="grid grid-cols-3 gap-3 mb-4">
                {(['percentage', 'fixed_amount', 'free_shipping'] as DiscountType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, discount_type: type })}
                    className={`p-4 rounded-lg border-2 text-center transition-all ${
                      formData.discount_type === type
                        ? 'border-[#Cfb187] bg-[#Cfb187]/10'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <p className="font-bold text-sm text-[#111111] capitalize">
                      {type === 'fixed_amount' ? 'Fixed' : type === 'free_shipping' ? 'Free Ship' : 'Percent'}
                    </p>
                  </button>
                ))}
              </div>

              {formData.discount_type !== 'free_shipping' && (
                <div className="flex gap-3">
                  <div className="flex-1">
                    <input
                      type="number"
                      value={formData.discount_value}
                      onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                      className="w-full bg-[#F5F5F7] border border-transparent focus:border-[#Cfb187] rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#Cfb187] transition-colors"
                      placeholder={formData.discount_type === 'percentage' ? '10' : '100000'}
                    />
                  </div>
                  <div className="flex items-center bg-gray-100 px-4 rounded-lg">
                    <span className="text-sm font-bold text-gray-600">
                      {formData.discount_type === 'percentage' ? '%' : '₫'}
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.start_date}
                  onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                  className="w-full bg-[#F5F5F7] border border-transparent focus:border-[#Cfb187] rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#Cfb187] transition-colors"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={formData.end_date}
                  onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                  className="w-full bg-[#F5F5F7] border border-transparent focus:border-[#Cfb187] rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#Cfb187] transition-colors"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                className="bg-[#111111] hover:bg-[#2a2a2a] text-[#Cfb187] px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all hover:shadow-lg"
              >
                {discount ? 'Update Campaign' : 'Create Campaign'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Panel - Live Preview */}
        <div className="lg:w-96 bg-[#F5F5F7] p-8 overflow-y-auto">
          <h3 className="text-lg font-bold text-[#111111] mb-6" style={{ fontFamily: "'Playfair Display', serif" }}>
            Live Preview
          </h3>
          <VoucherCard discount={previewDiscount} size="large" />
        </div>
      </div>
    </div>
  );
};

/**
 * DiscountsPage - Main component with KPI cards, table, and voucher preview
 */
const DiscountsDemo: React.FC = () => {
  const [showModal, setShowModal] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);

  return (
    <div className="min-h-screen bg-[#F5F5F7] p-8">
      <div className="max-w-[1600px] mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-[#111111] mb-1" style={{ fontFamily: "'Playfair Display', serif" }}>
              Campaign Analytics
            </h1>
            <p className="text-gray-500 text-sm tracking-wide">Manage discounts and promotional campaigns</p>
          </div>
          <button
            onClick={() => {
              setEditingDiscount(null);
              setShowModal(true);
            }}
            className="bg-[#111111] hover:bg-[#2a2a2a] text-[#Cfb187] px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wider transition-all hover:shadow-lg flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            New Campaign
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <KPICard
            title="Revenue Impact"
            value={formatCurrency(mockKPI.totalRevenueImpact)}
            subtitle="Total discount value given"
            icon={DollarSign}
            trend="+12%"
            trendPositive
          />
          <KPICard
            title="Redemptions"
            value={formatNumber(mockKPI.totalRedemptions)}
            subtitle="Total times coupons were used"
            icon={Users}
            progress={mockKPI.redemptionsProgress}
          />
          <KPICard
            title="Active Campaigns"
            value={mockKPI.activeCoupons}
            subtitle={`${mockKPI.expiredCoupons} expired campaigns`}
            icon={Ticket}
          />
        </div>

        {/* Voucher Previews */}
        <div>
          <h2 className="text-2xl font-bold text-[#111111] mb-4" style={{ fontFamily: "'Playfair Display', serif" }}>
            Featured Campaigns
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockDiscounts.slice(0, 4).map((discount) => (
              <VoucherCard key={discount.id} discount={discount} />
            ))}
          </div>
        </div>

        {/* Data Table */}
        <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search campaigns..."
                    className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#Cfb187] focus:border-[#Cfb187] w-64"
                  />
                </div>
                <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-[#Cfb187]">
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Expired</option>
                </select>
              </div>
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-[#111111] bg-gray-50 border border-gray-200 rounded-lg hover:border-[#Cfb187] transition-colors">
                <Filter className="w-4 h-4" />
                Filter
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F5F5F7] border-b border-gray-100">
                  <th className="text-left px-8 py-5 text-[11px] uppercase tracking-widest font-bold text-gray-500">
                    Campaign
                  </th>
                  <th className="text-left px-8 py-5 text-[11px] uppercase tracking-widest font-bold text-gray-500">
                    Code
                  </th>
                  <th className="text-left px-8 py-5 text-[11px] uppercase tracking-widest font-bold text-gray-500">
                    Discount
                  </th>
                  <th className="text-left px-8 py-5 text-[11px] uppercase tracking-widest font-bold text-gray-500">
                    Usage
                  </th>
                  <th className="text-left px-8 py-5 text-[11px] uppercase tracking-widest font-bold text-gray-500">
                    Status
                  </th>
                  <th className="text-right px-8 py-5 text-[11px] uppercase tracking-widest font-bold text-gray-500">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {mockDiscounts.map((discount) => {
                  const status = getStatusBadge(discount);
                  return (
                    <tr key={discount.id} className="border-b border-gray-50 hover:bg-[#F5F5F7]/50 transition-colors group">
                      <td className="px-8 py-6">
                        <div>
                          <p className="font-bold text-[#111111] text-sm">{discount.name}</p>
                          {discount.description && (
                            <p className="text-xs text-gray-500 mt-1 line-clamp-1">{discount.description}</p>
                          )}
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        {discount.code ? (
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-sm font-bold text-[#111111] bg-[#F5F5F7] px-2 py-1 rounded">
                              {discount.code.toUpperCase()}
                            </span>
                            <button className="text-gray-400 hover:text-[#Cfb187] transition-colors opacity-0 group-hover:opacity-100">
                              <Copy className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">Auto Apply</span>
                        )}
                      </td>
                      <td className="px-8 py-6">
                        <span className="font-bold text-sm text-[#Cfb187]">{formatDiscountValue(discount)}</span>
                      </td>
                      <td className="px-8 py-6">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-[#111111]">{discount.usage_count || 0}</span>
                          <span className="text-gray-300">/</span>
                          <span className="text-sm text-gray-500">{discount.usage_limit || '∞'}</span>
                        </div>
                      </td>
                      <td className="px-8 py-6">
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] uppercase tracking-wider font-bold ${status.className}`}>
                          {status.label}
                        </span>
                      </td>
                      <td className="px-8 py-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-[#Cfb187]/10 hover:text-[#Cfb187] transition-colors">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Create Modal */}
      {showModal && (
        <CreateDiscountModal
          discount={editingDiscount}
          onClose={() => {
            setShowModal(false);
            setEditingDiscount(null);
          }}
        />
      )}
    </div>
  );
};

export default DiscountsDemo;
