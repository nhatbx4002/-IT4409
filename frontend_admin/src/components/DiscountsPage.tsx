import React, { useState, useEffect } from 'react';
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
  listDiscounts,
  getDiscountKPI,
  createDiscount,
  updateDiscount,
  deleteDiscount,
  toggleDiscountStatus,
  generateDiscountCode,
  formatDiscountValue,
  getStatusBadge,
  formatCurrency,
  formatNumber,
  type Discount,
  type DiscountKPI,
  type DiscountType,
  type ApplyType,
} from '../lib/discounts';

// Typography: Serif for headings, sans-serif for UI
const FONT_SERIF = "'Playfair Display', 'Merriweather', serif";
const FONT_SANS = "'Inter', 'DM Sans', sans-serif";

// Luxury Voucher/Ticket Visual Component
interface VoucherCardProps {
  discount: Discount;
  size?: 'normal' | 'large';
}

const VoucherCard: React.FC<VoucherCardProps> = ({ discount, size = 'normal' }) => {
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
        <h3
          className={`${titleSize} font-serif font-bold text-white mb-2`}
          style={{ fontFamily: FONT_SERIF }}
        >
          {discount.name}
        </h3>

        {/* Dashed divider */}
        <div className="border-t-2 border-dashed border-[#Cfb187]/40 my-4" />

        {/* Discount Value */}
        <div className="mb-4">
          <p className="text-[#Cfb187]/60 text-xs uppercase tracking-widest mb-1">Discount</p>
          <p
            className={`${valueSize} font-serif font-bold text-[#Cfb187]`}
            style={{ fontFamily: FONT_SERIF }}
          >
            {formatDiscountValue(discount)}
          </p>
        </div>

        {/* Code Section */}
        {discount.code && (
          <div className="bg-white/5 rounded-lg p-3 border border-[#Cfb187]/20">
            <p className="text-[#Cfb187]/60 text-xs uppercase tracking-widest mb-2">Coupon Code</p>
            <p
              className={`${codeSize} font-mono font-bold text-white tracking-wider`}
              style={{ fontFamily: 'monospace' }}
            >
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

// KPI Card Component
interface KPICardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ElementType;
  trend?: string;
  trendPositive?: boolean;
  progress?: {
    current: number;
    total: number;
    percentage: number;
  };
}

const KPICard: React.FC<KPICardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  trendPositive,
  progress,
}) => (
  <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(198,168,124,0.15)] transition-all duration-300 border border-gray-100 p-6 relative overflow-hidden group">
    {/* Top accent bar */}
    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#Cfb187] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

    <div className="flex items-start justify-between mb-4">
      <div className="w-12 h-12 rounded-lg bg-[#F5F5F7] flex items-center justify-center group-hover:bg-[#Cfb187] transition-colors duration-300">
        <Icon className="w-6 h-6 text-[#Cfb187] group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
      </div>
      {trend && (
        <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${
          trendPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
        }`}>
          <TrendingUp className="w-3 h-3" />
          {trend}
        </div>
      )}
    </div>

    <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
    <div className="flex items-baseline gap-1">
      <span
        className="text-3xl text-[#111111] font-bold tracking-tight"
        style={{ fontFamily: FONT_SERIF }}
      >
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
          <div
            className="h-full bg-gradient-to-r from-[#Cfb187] to-[#B08D55] rounded-full transition-all duration-500"
            style={{ width: `${Math.min(progress.percentage, 100)}%` }}
          />
        </div>
        <p className="text-xs text-gray-400 mt-1">{progress.percentage.toFixed(1)}% used</p>
      </div>
    )}
  </div>
);

// Create/Edit Discount Modal
interface CreateDiscountModalProps {
  discount?: Discount | null;
  onSave: (discount: Partial<Discount>) => Promise<void>;
  onClose: () => void;
}

const CreateDiscountModal: React.FC<CreateDiscountModalProps> = ({ discount, onSave, onClose }) => {
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
  const [isRightPanel, setIsRightPanel] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateCode = async () => {
    const code = await generateDiscountCode(8);
    setFormData({ ...formData, code });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        discount_value: Number(formData.discount_value),
        max_discount_amount: formData.max_discount_amount ? Number(formData.max_discount_amount) : null,
        min_order_value: formData.min_order_value ? Number(formData.min_order_value) : 0,
        code: formData.apply_type === 'code' ? formData.code : null,
      };

      await onSave(payload);
      onClose();
    } catch (err: any) {
      setError(err?.message || 'Failed to save discount');
    } finally {
      setLoading(false);
    }
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
            <h2
              className="text-2xl font-bold text-[#111111]"
              style={{ fontFamily: FONT_SERIF }}
            >
              {discount ? 'Edit Campaign' : 'Create New Campaign'}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
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
                required
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
                    required
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
                      required
                    />
                  </div>
                  <div className="flex items-center bg-gray-100 px-4 rounded-lg">
                    <span className="text-sm font-bold text-gray-600">
                      {formData.discount_type === 'percentage' ? '%' : '₫'}
                    </span>
                  </div>
                </div>
              )}

              {formData.discount_type === 'percentage' && (
                <div className="mt-3">
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                    Max Discount Amount (Optional)
                  </label>
                  <input
                    type="number"
                    value={formData.max_discount_amount}
                    onChange={(e) => setFormData({ ...formData, max_discount_amount: e.target.value })}
                    className="w-full bg-[#F5F5F7] border border-transparent focus:border-[#Cfb187] rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#Cfb187] transition-colors"
                    placeholder="500000"
                  />
                </div>
              )}
            </div>

            {/* Min Order Value */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Minimum Order Value
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  value={formData.min_order_value}
                  onChange={(e) => setFormData({ ...formData, min_order_value: e.target.value })}
                  className="flex-1 bg-[#F5F5F7] border border-transparent focus:border-[#Cfb187] rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#Cfb187] transition-colors"
                  placeholder="0"
                />
                <div className="flex items-center bg-gray-100 px-4 rounded-lg">
                  <span className="text-sm font-bold text-gray-600">₫</span>
                </div>
              </div>
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

            {/* Usage Limit */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">
                Usage Limit
              </label>
              <input
                type="number"
                value={formData.usage_limit}
                onChange={(e) => setFormData({ ...formData, usage_limit: Number(e.target.value) })}
                className="w-full bg-[#F5F5F7] border border-transparent focus:border-[#Cfb187] rounded-lg px-4 py-3 text-sm font-medium focus:outline-none focus:ring-1 focus:ring-[#Cfb187] transition-colors"
                min="1"
              />
            </div>

            {error && <p className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">{error}</p>}

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2.5 text-sm font-semibold text-gray-600 hover:text-gray-800 transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-[#111111] hover:bg-[#2a2a2a] text-[#Cfb187] px-6 py-2.5 rounded-lg text-sm font-bold uppercase tracking-wider transition-all hover:shadow-lg disabled:opacity-50"
              >
                {loading ? 'Saving...' : discount ? 'Update Campaign' : 'Create Campaign'}
              </button>
            </div>
          </form>
        </div>

        {/* Right Panel - Live Preview */}
        <div className="lg:w-96 bg-[#F5F5F7] p-8 overflow-y-auto">
          <h3
            className="text-lg font-bold text-[#111111] mb-6"
            style={{ fontFamily: FONT_SERIF }}
          >
            Live Preview
          </h3>
          <VoucherCard discount={previewDiscount} size="large" />
        </div>
      </div>
    </div>
  );
};

// Main Discounts Page Component
const DiscountsPage: React.FC = () => {
  const [discounts, setDiscounts] = useState<Discount[]>([]);
  const [kpi, setKpi] = useState<DiscountKPI | null>(null);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState<number | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'expired'>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editingDiscount, setEditingDiscount] = useState<Discount | null>(null);

  const loadDiscounts = async (nextPage = page, nextSearch = search) => {
    try {
      setLoading(true);
      setError(null);
      const res = await listDiscounts({
        page: nextPage,
        limit,
        search: nextSearch,
        status: statusFilter,
      });
      setDiscounts(res.items);
      setTotal(res.pagination?.total);
      setPage(res.pagination?.page ?? nextPage);
    } catch (err: any) {
      setError(err?.message || 'Failed to load discounts');
    } finally {
      setLoading(false);
    }
  };

  const loadKPI = async () => {
    try {
      const data = await getDiscountKPI();
      setKpi(data);
    } catch (err: any) {
      console.error('Failed to load KPI:', err);
    }
  };

  useEffect(() => {
    loadDiscounts(1, '');
    loadKPI();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const handleSave = async (discountData: Partial<Discount>) => {
    if (editingDiscount) {
      await updateDiscount(editingDiscount.id, discountData);
    } else {
      await createDiscount(discountData as any);
    }
    loadDiscounts(page, search);
    loadKPI();
  };

  const handleDelete = async (id: number) => {
    const confirmed = window.confirm('Are you sure you want to delete this discount?');
    if (!confirmed) return;
    try {
      await deleteDiscount(id);
      loadDiscounts(page, search);
      loadKPI();
    } catch (err: any) {
      setError(err?.message || 'Failed to delete discount');
    }
  };

  const handleToggleStatus = async (discount: Discount) => {
    try {
      await toggleDiscountStatus(discount.id, !discount.is_active);
      loadDiscounts(page, search);
      loadKPI();
    } catch (err: any) {
      setError(err?.message || 'Failed to update status');
    }
  };

  const openModal = (discount?: Discount) => {
    setEditingDiscount(discount || null);
    setShowModal(true);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1
            className="text-4xl font-bold text-[#111111] mb-1"
            style={{ fontFamily: FONT_SERIF }}
          >
            Campaign Analytics
          </h1>
          <p className="text-gray-500 text-sm tracking-wide">Manage discounts and promotional campaigns</p>
        </div>
        <button
          onClick={() => openModal()}
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
          value={formatCurrency(kpi?.totalRevenueImpact || 0)}
          subtitle="Total discount value given"
          icon={DollarSign}
          trend="+12%"
          trendPositive
        />
        <KPICard
          title="Redemptions"
          value={formatNumber(kpi?.totalRedemptions || 0)}
          subtitle="Total times coupons were used"
          icon={Users}
          progress={kpi?.redemptionsProgress}
        />
        <KPICard
          title="Active Campaigns"
          value={kpi?.activeCoupons || 0}
          subtitle={`${kpi?.expiredCoupons || 0} expired campaigns`}
          icon={Ticket}
        />
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  loadDiscounts(1, search);
                }
              }}
              className="w-full bg-white border border-gray-200 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#Cfb187] focus:border-[#Cfb187] transition-colors"
            />
          </div>
          <button
            onClick={() => loadDiscounts(1, search)}
            className="bg-white border border-gray-200 text-[#111111] px-4 py-2.5 rounded-lg text-sm font-bold hover:border-[#Cfb187] transition-colors"
          >
            Search
          </button>
        </div>

        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            className="bg-white border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-1 focus:ring-[#Cfb187] focus:border-[#Cfb187]"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="expired">Expired</option>
          </select>
          <button className="bg-white border border-gray-200 text-[#111111] px-4 py-2.5 rounded-lg text-sm font-bold hover:border-[#Cfb187] transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
        {error && (
          <div className="bg-red-50 border-b border-red-100 text-red-700 px-6 py-4 text-sm">
            {error}
          </div>
        )}

        {loading && discounts.length === 0 ? (
          <div className="p-12 text-center text-sm text-gray-500">Loading campaigns...</div>
        ) : discounts.length === 0 ? (
          <div className="p-12 text-center">
            <Ticket className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 font-medium">No campaigns found</p>
            <p className="text-gray-400 text-sm mt-1">Create your first discount campaign to get started</p>
          </div>
        ) : (
          <>
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
                      Valid Period
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
                  {discounts.map((discount) => {
                    const status = getStatusBadge(discount);
                    return (
                      <tr
                        key={discount.id}
                        className="border-b border-gray-50 hover:bg-[#F5F5F7]/50 transition-colors group"
                      >
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
                              <button
                                onClick={() => {
                                  navigator.clipboard.writeText(discount.code!);
                                }}
                                className="text-gray-400 hover:text-[#Cfb187] transition-colors opacity-0 group-hover:opacity-100"
                              >
                                <Copy className="w-4 h-4" />
                              </button>
                            </div>
                          ) : (
                            <span className="text-xs text-gray-400">Auto Apply</span>
                          )}
                        </td>
                        <td className="px-8 py-6">
                          <span className="font-bold text-sm text-[#Cfb187]">
                            {formatDiscountValue(discount)}
                          </span>
                        </td>
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-[#111111]">
                              {discount.usage_count || 0}
                            </span>
                            <span className="text-gray-300">/</span>
                            <span className="text-sm text-gray-500">{discount.usage_limit || '∞'}</span>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <div className="text-xs text-gray-600">
                            {discount.start_date && (
                              <p>From {new Date(discount.start_date).toLocaleDateString('vi-VN')}</p>
                            )}
                            {discount.end_date && (
                              <p>To {new Date(discount.end_date).toLocaleDateString('vi-VN')}</p>
                            )}
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-[11px] uppercase tracking-wider font-bold ${status.className}`}
                          >
                            {status.label}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleToggleStatus(discount)}
                              className={`p-2 rounded-lg transition-colors ${
                                discount.is_active
                                  ? 'bg-green-50 text-green-600 hover:bg-green-100'
                                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
                              }`}
                              title={discount.is_active ? 'Deactivate' : 'Activate'}
                            >
                              {discount.is_active ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>
                            <button
                              onClick={() => openModal(discount)}
                              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-[#Cfb187]/10 hover:text-[#Cfb187] transition-colors"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(discount.id)}
                              className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-red-50 hover:text-red-600 transition-colors"
                              title="Delete"
                            >
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

            {/* Pagination */}
            {total && total > limit && (
              <div className="flex items-center justify-between px-8 py-4 border-t border-gray-100">
                <p className="text-sm text-gray-600">
                  Page {page} of {Math.ceil(total / limit)}
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const next = Math.max(1, page - 1);
                      setPage(next);
                      loadDiscounts(next, search);
                    }}
                    disabled={page === 1}
                    className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    ←
                  </button>
                  <button
                    onClick={() => {
                      const next = page + 1;
                      setPage(next);
                      loadDiscounts(next, search);
                    }}
                    disabled={page * limit >= (total || 0)}
                    className="w-8 h-8 border border-gray-200 rounded-lg flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  >
                    →
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <CreateDiscountModal
          discount={editingDiscount}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditingDiscount(null);
          }}
        />
      )}
    </div>
  );
};

export default DiscountsPage;
