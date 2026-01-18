/**
 * Luxury Discount Management - Usage Examples
 *
 * This file contains practical examples of how to use the discount components
 * in different scenarios.
 */

import React, { useState } from 'react';
import {
  formatDiscountValue,
  getStatusBadge,
  formatCurrency,
  generateDiscountCode,
  type Discount,
} from '../lib/discounts';

// ============================================
// EXAMPLE 1: Basic VoucherCard Display
// ============================================
export const Example1_BasicVoucher: React.FC = () => {
  const discount: Discount = {
    id: 1,
    name: 'Summer Sale',
    code: 'SUMMER24',
    discount_type: 'percentage',
    discount_value: 20,
    apply_type: 'code',
    usage_limit: 1000,
    usage_count: 342,
    is_active: true,
    applicable_to: 'all',
  };

  return (
    <div className="p-8">
      {/* Import VoucherCard from DiscountsPage.tsx */}
      {/* <VoucherCard discount={discount} size="normal" /> */}
      <pre>{JSON.stringify(discount, null, 2)}</pre>
    </div>
  );
};

// ============================================
// EXAMPLE 2: KPI Cards Grid
// ============================================
export const Example2_KPICards: React.FC = () => {
  const kpis = [
    { title: 'Revenue', value: '₫125M', icon: '💰' },
    { title: 'Redemptions', value: '2,481', icon: '👥' },
    { title: 'Active', value: '3', icon: '🎟️' },
  ];

  return (
    <div className="p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
      {kpis.map((kpi) => (
        <div key={kpi.title} className="bg-white p-6 rounded-xl shadow-sm">
          <div className="flex items-center gap-4">
            <span className="text-3xl">{kpi.icon}</span>
            <div>
              <p className="text-gray-500 text-xs uppercase tracking-wider">{kpi.title}</p>
              <p className="text-2xl font-bold">{kpi.value}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// ============================================
// EXAMPLE 3: Status Badge Helper
// ============================================
export const Example3_StatusBadges: React.FC = () => {
  const discounts: Discount[] = [
    {
      id: 1,
      name: 'Active Discount',
      code: 'ACTIVE',
      discount_type: 'percentage',
      discount_value: 10,
      apply_type: 'code',
      usage_limit: 100,
      usage_count: 50,
      is_active: true,
      applicable_to: 'all',
    },
    {
      id: 2,
      name: 'Inactive Discount',
      code: 'INACTIVE',
      discount_type: 'percentage',
      discount_value: 15,
      apply_type: 'code',
      usage_limit: 100,
      usage_count: 0,
      is_active: false,
      applicable_to: 'all',
    },
    {
      id: 3,
      name: 'Expired Discount',
      code: 'EXPIRED',
      discount_type: 'percentage',
      discount_value: 20,
      apply_type: 'code',
      end_date: '2023-01-01T00:00:00Z',
      usage_limit: 100,
      usage_count: 100,
      is_active: true,
      applicable_to: 'all',
    },
  ];

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-xl font-bold mb-4">Status Badge Examples</h2>
      {discounts.map((discount) => {
        const status = getStatusBadge(discount);
        return (
          <div key={discount.id} className="flex items-center gap-4">
            <span className="font-medium">{discount.name}</span>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${status.className}`}>
              {status.label}
            </span>
          </div>
        );
      })}
    </div>
  );
};

// ============================================
// EXAMPLE 4: Format Discount Value
// ============================================
export const Example4_FormatDiscount: React.FC = () => {
  const discounts = [
    { type: 'percentage' as const, value: 20 },
    { type: 'fixed_amount' as const, value: 100000 },
    { type: 'free_shipping' as const, value: 0 },
  ];

  const exampleDiscounts: Discount[] = discounts.map((d, i) => ({
    id: i + 1,
    name: `Example ${i + 1}`,
    code: `CODE${i + 1}`,
    discount_type: d.type,
    discount_value: d.value,
    apply_type: 'code',
    usage_limit: 100,
    usage_count: 0,
    is_active: true,
    applicable_to: 'all',
  }));

  return (
    <div className="p-8 space-y-4">
      <h2 className="text-xl font-bold mb-4">Format Discount Value Examples</h2>
      {exampleDiscounts.map((discount) => (
        <div key={discount.id} className="bg-white p-4 rounded-lg">
          <p className="text-sm text-gray-600">{discount.discount_type}</p>
          <p className="text-2xl font-bold text-[#Cfb187]">
            {formatDiscountValue(discount)}
          </p>
        </div>
      ))}
    </div>
  );
};

// ============================================
// EXAMPLE 5: Generate Random Code
// ============================================
export const Example5_GenerateCode: React.FC = () => {
  const [code, setCode] = useState('');

  const handleGenerate = async () => {
    const newCode = await generateDiscountCode(8);
    setCode(newCode);
  };

  return (
    <div className="p-8">
      <div className="bg-white p-6 rounded-xl max-w-md">
        <h3 className="text-lg font-bold mb-4">Generate Coupon Code</h3>
        <div className="flex gap-2">
          <input
            type="text"
            value={code}
            readOnly
            placeholder="Click generate to create code"
            className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-2 font-mono font-bold"
          />
          <button
            onClick={handleGenerate}
            className="px-4 py-2 bg-[#111111] text-[#Cfb187] rounded-lg font-bold hover:bg-[#2a2a2a] transition-colors"
          >
            Generate
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// EXAMPLE 6: Simple Discount Form
// ============================================
export const Example6_SimpleForm: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    discount_type: 'percentage' as 'percentage' | 'fixed_amount',
    discount_value: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Form data:', formData);
    alert('Discount created! (Check console)');
  };

  return (
    <div className="p-8">
      <div className="bg-white p-8 rounded-xl max-w-2xl">
        <h2 className="text-2xl font-bold mb-6">Create Discount</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Campaign Name
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#Cfb187]"
              placeholder="e.g., Summer Sale"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Coupon Code
            </label>
            <input
              type="text"
              value={formData.code}
              onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#Cfb187] font-mono font-bold"
              placeholder="SUMMER24"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-3">
              Discount Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              {(['percentage', 'fixed_amount'] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, discount_type: type })}
                  className={`p-3 rounded-lg border-2 capitalize ${
                    formData.discount_type === type
                      ? 'border-[#Cfb187] bg-[#Cfb187]/10 text-[#111111]'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {type === 'percentage' ? 'Percentage' : 'Fixed Amount'}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Discount Value
            </label>
            <div className="flex gap-2">
              <input
                type="number"
                value={formData.discount_value}
                onChange={(e) => setFormData({ ...formData, discount_value: e.target.value })}
                className="flex-1 px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#Cfb187]"
                placeholder={formData.discount_type === 'percentage' ? '20' : '100000'}
                required
              />
              <div className="flex items-center bg-gray-100 px-4 rounded-lg">
                <span className="font-bold text-gray-600">
                  {formData.discount_type === 'percentage' ? '%' : '₫'}
                </span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#111111] text-[#Cfb187] py-3 rounded-lg font-bold uppercase tracking-wider hover:bg-[#2a2a2a] transition-colors"
          >
            Create Campaign
          </button>
        </form>
      </div>
    </div>
  );
};

// ============================================
// EXAMPLE 7: Discount List with Actions
// ============================================
export const Example7_DiscountList: React.FC = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([
    {
      id: 1,
      name: 'Summer Sale',
      code: 'SUMMER24',
      discount_type: 'percentage',
      discount_value: 20,
      apply_type: 'code',
      usage_limit: 1000,
      usage_count: 342,
      is_active: true,
      applicable_to: 'all',
    },
    {
      id: 2,
      name: 'Free Shipping',
      code: 'FREESHIP',
      discount_type: 'free_shipping',
      discount_value: 0,
      apply_type: 'code',
      usage_limit: 500,
      usage_count: 123,
      is_active: true,
      applicable_to: 'all',
    },
  ]);

  const handleDelete = (id: number) => {
    if (confirm('Delete this discount?')) {
      setDiscounts(discounts.filter((d) => d.id !== id));
    }
  };

  const handleToggle = (id: number) => {
    setDiscounts(
      discounts.map((d) =>
        d.id === id ? { ...d, is_active: !d.is_active } : d
      )
    );
  };

  return (
    <div className="p-8">
      <div className="bg-white rounded-xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                Campaign
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                Discount
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                Usage
              </th>
              <th className="px-6 py-3 text-left text-xs font-bold text-gray-500 uppercase">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-bold text-gray-500 uppercase">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {discounts.map((discount) => {
              const status = getStatusBadge(discount);
              return (
                <tr key={discount.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 font-medium">{discount.name}</td>
                  <td className="px-6 py-4 font-mono text-sm">{discount.code}</td>
                  <td className="px-6 py-4 font-bold text-[#Cfb187]">
                    {formatDiscountValue(discount)}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {discount.usage_count} / {discount.usage_limit}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${status.className}`}>
                      {status.label}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleToggle(discount.id)}
                      className="text-blue-600 hover:text-blue-800 mr-2"
                    >
                      Toggle
                    </button>
                    <button
                      onClick={() => handleDelete(discount.id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ============================================
// EXAMPLE 8: Integration with API
// ============================================
export const Example8_APIIntegration: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateDiscount = async () => {
    setLoading(true);
    setError('');

    try {
      // Import the necessary functions
      const { createDiscount } = await import('../lib/discounts');

      const newDiscount = await createDiscount({
        name: 'New Campaign',
        code: 'NEW2024',
        discount_type: 'percentage',
        discount_value: 15,
        apply_type: 'code',
        usage_limit: 100,
        is_active: true,
        applicable_to: 'all',
      });

      console.log('Created:', newDiscount);
      alert('Discount created successfully!');
    } catch (err: any) {
      setError(err?.message || 'Failed to create discount');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <div className="bg-white p-6 rounded-xl max-w-md">
        <h2 className="text-lg font-bold mb-4">API Integration Example</h2>
        <button
          onClick={handleCreateDiscount}
          disabled={loading}
          className="w-full bg-[#111111] text-[#Cfb187] py-3 rounded-lg font-bold disabled:opacity-50"
        >
          {loading ? 'Creating...' : 'Create Test Discount'}
        </button>
        {error && <p className="text-red-600 mt-4">{error}</p>}
      </div>
    </div>
  );
};

// Export all examples
export default {
  Example1_BasicVoucher,
  Example2_KPICards,
  Example3_StatusBadges,
  Example4_FormatDiscount,
  Example5_GenerateCode,
  Example6_SimpleForm,
  Example7_DiscountList,
  Example8_APIIntegration,
};
