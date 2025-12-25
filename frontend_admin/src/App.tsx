import React from 'react';
import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Users,
  BarChart3,
  Settings,
  Search,
  Bell,
  Menu,
  X,
  TrendingUp,
  TrendingDown,
  DollarSign,
  ShoppingCart,
  Plus,
  Filter,
  ChevronLeft,
  ChevronRight,
  Edit2,
  Trash2,
  MoreHorizontal,
  Ticket
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  Legend
} from 'recharts';
import LoginPage from './components/LoginPage';
import { useAuth } from './hooks/useAuth';
import { adminApiClient, getPaginatedAdminData } from './lib/api';
import { getKPIStats, getRevenueChart, getRecentOrders, getBestSellers, getAnalyticsData, type BestSeller } from './lib/dashboard';
import { listProducts, createProduct, updateProduct, deleteProduct, type Product } from './lib/products';
import { listOrders, getOrderById, updateOrderStatus, processRefund, type Order, type OrderStatus } from './lib/orders';
import DiscountsPage from './components/DiscountsPage';

type Page = 'dashboard' | 'products' | 'orders' | 'analytics' | 'settings' | 'customers' | 'discounts';

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
  { name: 'Products', icon: Package, id: 'products' },
  { name: 'Orders', icon: ShoppingBag, id: 'orders' },
  { name: 'Discounts', icon: Ticket, id: 'discounts' },
  { name: 'Customers', icon: Users, id: 'customers' },
  { name: 'Analytics', icon: BarChart3, id: 'analytics' },
  { name: 'Settings', icon: Settings, id: 'settings' },
];

const formatCurrency = (value?: number | string | null) => {
  if (value === null || value === undefined) return '₫0';
  const numeric = typeof value === 'string' ? Number(value) : value;
  if (Number.isNaN(numeric)) return '₫0';
  return numeric.toLocaleString('vi-VN', { style: 'currency', currency: 'VND', maximumFractionDigits: 0 });
};

const formatNumber = (value?: number | string | null) => {
  if (value === null || value === undefined) return '0';
  const numeric = typeof value === 'string' ? Number(value) : value;
  if (Number.isNaN(numeric)) return '0';
  return numeric.toLocaleString('vi-VN');
};

const formatDate = (value?: string | null) => {
  if (!value) return '—';
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleDateString('vi-VN');
};

export default function App() {
  const [currentPage, setCurrentPage] = React.useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0A0A0A] text-white">
        <div className="text-center space-y-3">
          <p className="text-sm uppercase tracking-[0.3em] text-[#C6A87C]">Aristino Admin</p>
          <p className="text-lg font-semibold">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return <LoginPage onAuthenticated={() => {
      // Auth state is managed by useAuth hook
      window.location.reload();
    }} />;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#F5F5F5] font-sans text-brand-black">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          ${isCollapsed ? 'w-[90px]' : 'w-[280px]'} bg-[#0A0A0A] text-white
          flex flex-col shadow-2xl
          transform transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Logo */}
        <div className={`h-24 flex items-center ${isCollapsed ? 'justify-center' : 'justify-between px-8'} border-b border-white/10 relative`}>
          {!isCollapsed ? (
            <div className="flex flex-col">
              <h1 className="font-serif text-[#C6A87C] uppercase tracking-[0.2em] text-2xl font-bold">
                Aristino
              </h1>
              <span className="text-[10px] text-white/40 uppercase tracking-[0.3em] mt-1">Luxury Fashion</span>
            </div>
          ) : (
            <h1 className="font-serif text-[#C6A87C] text-4xl font-bold">A</h1>
          )}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/60 hover:text-white absolute right-4"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Desktop Collapse Toggle */}
          <button 
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="hidden lg:flex absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 bg-[#C6A87C] text-[#0A0A0A] rounded-full items-center justify-center hover:bg-white transition-colors shadow-lg z-50"
          >
            {isCollapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-8 space-y-2">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  setCurrentPage(item.id as Page);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center ${isCollapsed ? 'justify-center px-2' : 'gap-4 px-6'} py-4 rounded-lg
                  transition-all duration-300 group relative overflow-hidden
                  ${isActive 
                    ? 'bg-gradient-to-r from-[#C6A87C] to-[#B08D55] text-black shadow-lg shadow-[#C6A87C]/20' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }
                `}
                title={isCollapsed ? item.name : ''}
              >
                <Icon 
                  className={`w-5 h-5 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} 
                  strokeWidth={isActive ? 2 : 1.5}
                />
                {!isCollapsed && (
                  <span className={`text-sm tracking-wide ${isActive ? 'font-bold' : 'font-medium'}`}>
                    {item.name}
                  </span>
                )}
                {isActive && !isCollapsed && (
                  <div className="absolute right-4 w-1.5 h-1.5 rounded-full bg-black/40" />
                )}
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className={`p-6 border-t border-white/10 bg-black/20 ${isCollapsed ? 'flex justify-center' : ''}`}>
          <div className="flex items-center gap-4">
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#C6A87C] to-[#8E7340] flex items-center justify-center shadow-lg border-2 border-[#0A0A0A]">
                <span className="text-[#0A0A0A] text-sm font-bold">AD</span>
              </div>
              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-[#0A0A0A]" />
            </div>
            {!isCollapsed && (
              <>
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-medium truncate">Admin User</p>
                  <p className="text-white/40 text-xs truncate">admin@aristino.com</p>
                </div>
                <button className="text-white/40 hover:text-white transition-colors">
                  <Settings className="w-4 h-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden bg-[#F8F8F8]">
        {/* Header */}
        <header className="h-24 bg-white/80 backdrop-blur-md border-b border-gray-200/60 sticky top-0 z-30 px-8 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            <div>
              <h2 className="font-serif text-3xl text-[#0A0A0A] font-bold">
                {currentPage === 'dashboard' && 'Dashboard'}
                {currentPage === 'products' && 'Collections'}
                {currentPage === 'orders' && 'Invoices'}
                {currentPage === 'discounts' && 'Campaigns'}
              </h2>
              <p className="text-gray-500 text-xs tracking-wider uppercase mt-1">
                {currentPage === 'dashboard' && 'Overview & Analytics'}
                {currentPage === 'products' && 'Manage Inventory'}
                {currentPage === 'orders' && 'Order Management'}
                {currentPage === 'discounts' && 'Discount & Coupons'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden md:flex items-center bg-gray-100 rounded-full px-4 py-2.5 border border-transparent focus-within:border-[#C6A87C] focus-within:bg-white transition-all w-64">
              <Search className="w-4 h-4 text-gray-400 mr-2" />
              <input 
                type="text" 
                placeholder="Search..." 
                className="bg-transparent border-none outline-none text-sm w-full placeholder-gray-400"
              />
            </div>
            <div className="h-8 w-[1px] bg-gray-200 hidden md:block" />
            <button className="relative group">
              <Bell className="w-6 h-6 text-gray-400 group-hover:text-[#0A0A0A] transition-colors" />
              <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-[#C6A87C] rounded-full ring-2 ring-white"></span>
            </button>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6 lg:p-10 scrollbar-hide">
          <div className="max-w-[1600px] mx-auto animate-in fade-in duration-500">
            {currentPage === 'dashboard' && <DashboardPage />}
            {currentPage === 'products' && <ProductsPage />}
            {currentPage === 'orders' && <OrdersPage />}
            {currentPage === 'discounts' && <DiscountsPage />}
            {currentPage === 'analytics' && <AnalyticsPage />}
            {currentPage === 'settings' && <SettingsPage />}
            {currentPage === 'customers' && <CustomersPage />}
          </div>
        </main>
      </div>
    </div>
  );
}

// Analytics Page Component
function AnalyticsPage() {
  const [period, setPeriod] = useState<'Weekly' | 'Monthly' | 'Yearly'>('Weekly');
  const [analytics, setAnalytics] = useState<any>(null);
  const [revenueSeries, setRevenueSeries] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const computeRange = (p: typeof period) => {
    const now = new Date();
    const to = now.toISOString().slice(0, 10);
    const days = p === 'Yearly' ? 365 : p === 'Monthly' ? 30 : 7;
    const fromDate = new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
    const from = fromDate.toISOString().slice(0, 10);
    const granularity: 'month' | 'day' = p === 'Yearly' ? 'month' : 'day';
    return { from, to, granularity };
  };

  const loadData = async (p: typeof period) => {
    const { from, to, granularity } = computeRange(p);
    try {
      setLoading(true);
      setError(null);
      const [analyticsRes, revenueRes] = await Promise.all([
        getAnalyticsData({ from, to }),
        getRevenueChart({ from, to, granularity }),
      ]);
      setAnalytics(analyticsRes);
      setRevenueSeries(Array.isArray(revenueRes) ? revenueRes : []);
    } catch (err: any) {
      setError(err?.message || 'Failed to load analytics data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData(period);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [period]);

  const salesData = revenueSeries.map((point) => ({
    name: (point as any).period ?? (point as any).date ?? '',
    revenue: (point as any).revenue ?? (point as any).value ?? 0,
    target: ((point as any).revenue ?? (point as any).value ?? 0) * 1.1,
  }));

  const categoryData =
    Array.isArray((analytics as any)?.categories) && (analytics as any).categories.length
      ? (analytics as any).categories.map((c: any) => ({ name: c.name, value: c.value ?? c.count ?? 0 }))
      : [];

  const topStats = [
    {
      label: 'Conversion Rate',
      value: analytics?.conversionRate ? `${analytics.conversionRate}%` : '—',
      change: analytics?.conversionChange ? `${analytics.conversionChange}%` : '',
      positive: (analytics?.conversionChange ?? 0) >= 0,
    },
    {
      label: 'Avg. Order Value',
      value: analytics?.averageOrderValue ? formatCurrency(analytics.averageOrderValue) : '—',
      change: analytics?.aovChange ? `${analytics.aovChange}%` : '',
      positive: (analytics?.aovChange ?? 0) >= 0,
    },
    {
      label: 'Return Rate',
      value: analytics?.returnRate ? `${analytics.returnRate}%` : '—',
      change: analytics?.returnChange ? `${analytics.returnChange}%` : '',
      positive: (analytics?.returnChange ?? 0) >= 0,
    },
  ];

  const COLORS = ['#0A0A0A', '#C6A87C', '#8E7340', '#D4C5A9'];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-[#0A0A0A]">Performance Analytics</h1>
        <div className="flex bg-white border border-gray-200 rounded-lg p-1">
          {['Weekly', 'Monthly', 'Yearly'].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p as typeof period)}
              className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${period === p ? 'bg-[#0A0A0A] text-[#C6A87C]' : 'hover:bg-gray-50'}`}
            >
              {p}
            </button>
          ))}
        </div>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">{error}</div>}
      {loading && <div className="text-sm text-gray-500">Loading analytics...</div>}

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {topStats.map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100">
             <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">{stat.label}</p>
             <div className="flex items-end justify-between">
                <h3 className="text-3xl font-serif font-bold text-[#0A0A0A]">{stat.value}</h3>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {stat.change || '—'}
                </span>
             </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales vs Target Chart */}
        <div className="bg-white p-8 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100">
          <h3 className="font-serif text-xl font-bold text-[#0A0A0A] mb-6">Revenue vs Target</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} barSize={20}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <Tooltip 
                  cursor={{ fill: '#FAF8F5' }}
                  contentStyle={{ backgroundColor: '#0A0A0A', border: 'none', borderRadius: '8px', color: '#fff' }}
                />
                <Legend iconType="circle" />
                <Bar dataKey="revenue" name="Revenue" fill="#0A0A0A" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" name="Target" fill="#C6A87C" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="bg-white p-8 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100">
          <h3 className="font-serif text-xl font-bold text-[#0A0A0A] mb-6">Sales by Category</h3>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={80}
                  outerRadius={110}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((_entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#0A0A0A', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Legend verticalAlign="middle" align="right" layout="vertical" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

       {/* Traffic Trends */}
       <div className="bg-white p-8 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100">
          <h3 className="font-serif text-xl font-bold text-[#0A0A0A] mb-6">Store Traffic Trends</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#9CA3AF' }} />
                <Tooltip contentStyle={{ backgroundColor: '#0A0A0A', border: 'none', borderRadius: '8px', color: '#fff' }} />
                <Line type="monotone" dataKey="revenue" stroke="#0A0A0A" strokeWidth={3} dot={{ fill: '#0A0A0A', strokeWidth: 2 }} activeDot={{ r: 8, fill: '#C6A87C' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
       </div>
    </div>
  );
}

// Settings Page Component
function SettingsPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="font-serif text-3xl font-bold text-[#0A0A0A]">System Settings</h1>
      
      {/* Profile Section */}
      <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100">
          <h3 className="font-serif text-xl font-bold text-[#0A0A0A] mb-1">Profile Information</h3>
          <p className="text-gray-500 text-sm">Update your account's profile information and email address.</p>
        </div>
        <div className="p-8 space-y-6">
          <div className="flex items-center gap-6">
            <div className="w-20 h-20 rounded-full bg-[#FAF8F5] border-2 border-[#C6A87C] flex items-center justify-center text-2xl font-bold text-[#0A0A0A]">
              AD
            </div>
            <div>
              <button className="bg-[#0A0A0A] text-[#C6A87C] px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg hover:bg-gray-800 transition-colors">
                Change Avatar
              </button>
              <p className="text-xs text-gray-400 mt-2">JPG, GIF or PNG. Max size of 800K</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">First Name</label>
              <input type="text" defaultValue="Admin" className="w-full bg-[#FAF8F5] border-none rounded-lg px-4 py-3 text-sm font-medium focus:ring-1 focus:ring-[#C6A87C]" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Last Name</label>
              <input type="text" defaultValue="User" className="w-full bg-[#FAF8F5] border-none rounded-lg px-4 py-3 text-sm font-medium focus:ring-1 focus:ring-[#C6A87C]" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-bold uppercase tracking-wider text-gray-500">Email Address</label>
              <input type="email" defaultValue="admin@aristino.com" className="w-full bg-[#FAF8F5] border-none rounded-lg px-4 py-3 text-sm font-medium focus:ring-1 focus:ring-[#C6A87C]" />
            </div>
          </div>
        </div>
        <div className="px-8 py-4 bg-[#FAF8F5] flex justify-end">
          <button className="bg-[#C6A87C] hover:bg-[#B08D55] text-white px-6 py-2.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-colors">
            Save Changes
          </button>
        </div>
      </div>

      {/* Preferences */}
      <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
        <div className="p-8 border-b border-gray-100">
          <h3 className="font-serif text-xl font-bold text-[#0A0A0A] mb-1">Preferences</h3>
          <p className="text-gray-500 text-sm">Manage your notification and display settings.</p>
        </div>
        <div className="p-8 space-y-6">
          {[
            { title: 'Email Notifications', desc: 'Receive daily summary emails about your sales.' },
            { title: 'Desktop Notifications', desc: 'Get notified when a new order arrives.' },
            { title: 'Sound Effects', desc: 'Play a sound when a new order arrives.' },
          ].map((item, i) => (
            <div key={i} className="flex items-center justify-between pb-6 border-b border-gray-50 last:border-0 last:pb-0">
              <div>
                <h4 className="font-bold text-[#0A0A0A] text-sm">{item.title}</h4>
                <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked={i === 0} />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#0A0A0A]"></div>
              </label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Dashboard Page Component
function DashboardPage() {
  const [kpis, setKpis] = useState<any>(null);
  const [chartData, setChartData] = useState<{ name: string; value: number }[]>([]);
  const [bestSellers, setBestSellers] = useState<BestSeller[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [_loading, setLoading] = useState(true);
  const [_error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const [kpiRes, revenueRes, bestSellerRes, recentRes] = await Promise.all([
          getKPIStats(),
          getRevenueChart({ granularity: 'day' }),
          getBestSellers({ limit: 3 }),
          getRecentOrders(6),
        ]);

        if (!mounted) return;
        setKpis(kpiRes);
        setChartData(
          (Array.isArray(revenueRes) ? revenueRes : []).map((point: any) => ({
            name: point.period ?? point.date ?? '',
            value: point.revenue ?? point.value ?? 0,
          }))
        );
        setBestSellers(Array.isArray(bestSellerRes) ? bestSellerRes : []);
        setRecentOrders(Array.isArray(recentRes) ? recentRes : []);
      } catch (err: any) {
        if (!mounted) return;
        setError(err?.message || 'Failed to load dashboard data');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const kpiData = [
    { label: 'Total Revenue', value: formatCurrency(kpis?.revenue?.thisMonth ?? 0), trend: '+', isPositive: true, icon: DollarSign },
    { label: 'Total Orders', value: formatNumber(kpis?.orders?.thisMonth ?? 0), trend: '+', isPositive: true, icon: ShoppingCart },
    { label: 'Avg. Order Value', value: formatCurrency(kpis?.averageOrderValue ?? 0), trend: '—', isPositive: true, icon: TrendingUp },
    { label: 'Active Customers', value: formatNumber(kpis?.users?.total ?? 0), trend: '+', isPositive: true, icon: Users },
  ];


  return (
    <div className="space-y-8">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {kpiData.map((kpi, idx) => {
          const Icon = kpi.icon;
          return (
            <div 
              key={idx}
              className="group bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] hover:shadow-[0_10px_30px_rgba(198,168,124,0.15)] transition-all duration-300 border border-gray-100 p-6 relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#C6A87C] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg bg-[#FAF8F5] flex items-center justify-center group-hover:bg-[#C6A87C] transition-colors duration-300">
                  <Icon className="w-6 h-6 text-[#C6A87C] group-hover:text-white transition-colors duration-300" strokeWidth={1.5} />
                </div>
                <div className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-bold ${kpi.isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'}`}>
                  {kpi.isPositive ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                  {kpi.trend}
                </div>
              </div>
              <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{kpi.label}</p>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-serif text-[#0A0A0A] font-bold tracking-tight">{kpi.value}</span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 p-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#0A0A0A]">Revenue Analytics</h3>
              <p className="text-gray-400 text-xs uppercase tracking-wider mt-1">Weekly Performance</p>
            </div>
            <select className="bg-[#FAF8F5] border-none text-sm font-bold text-[#0A0A0A] py-2 px-4 rounded-lg focus:ring-1 focus:ring-[#C6A87C]">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Year</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C6A87C" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#C6A87C" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9CA3AF', fontSize: 12 }} 
                  dy={10}
                />
                <YAxis 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  tickFormatter={(value) => formatCurrency(Number(value))}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0A0A0A', border: 'none', borderRadius: '8px', color: '#fff' }}
                  itemStyle={{ color: '#C6A87C' }}
                />
                <Area 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#C6A87C" 
                  strokeWidth={3}
                  fillOpacity={1} 
                  fill="url(#colorRevenue)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Selling Categories or Simple Stats */}
        <div className="bg-[#0A0A0A] text-white rounded-xl p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-32 bg-[#C6A87C] rounded-full filter blur-[100px] opacity-20 transform translate-x-1/2 -translate-y-1/2" />
          <h3 className="font-serif text-xl font-bold mb-6 relative z-10">Best Sellers</h3>
          <div className="space-y-6 relative z-10">
            {(bestSellers.length ? bestSellers : [{ product_id: 0, name: 'No data yet', totalSold: 0, revenue: 0 }]).slice(0, 3).map((item, i) => (
              <div key={item.product_id ?? i} className="flex items-center gap-4">
                <span className="text-[#C6A87C] font-serif text-xl font-bold">0{i + 1}</span>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">{item.name || `Product ${item.product_id}`}</h4>
                  <p className="text-white/40 text-xs mt-1">{formatNumber(item.totalSold ?? (item as any).total_quantity ?? 0)} Sales</p>
                </div>
                <span className="font-mono text-sm">{formatCurrency(item.revenue ?? (item as any).total_revenue ?? 0)}</span>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 bg-[#C6A87C] hover:bg-[#B08D55] text-black font-bold py-3 px-6 rounded-lg transition-colors text-sm uppercase tracking-wide relative z-10">
            View All Report
          </button>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between p-8 border-b border-gray-100">
          <div>
            <h3 className="font-serif text-xl font-bold text-[#0A0A0A]">Recent Transactions</h3>
            <p className="text-gray-400 text-xs uppercase tracking-wider mt-1">Latest financial activity</p>
          </div>
          <button className="text-[#C6A87C] hover:text-[#0A0A0A] text-sm font-bold flex items-center gap-2 transition-colors">
            View All Orders <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-[#FAF8F5]">
                <th className="text-left px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-gray-500">Order ID</th>
                <th className="text-left px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-gray-500">Customer</th>
                <th className="text-left px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-gray-500">Amount</th>
                <th className="text-left px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-gray-500">Status</th>
                <th className="text-right px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => {
                const status = (order as any)?.status || 'pending';
                const statusClass = status.toLowerCase() === 'completed'
                  ? 'bg-green-100 text-green-700'
                  : status.toLowerCase() === 'processing'
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-orange-100 text-orange-700';
                return (
                  <tr key={order.id} className="border-b border-gray-50 hover:bg-[#FAF8F5]/50 transition-colors group">
                    <td className="px-8 py-6">
                      <span className="font-mono text-xs font-bold text-gray-400">#{order.id}</span>
                    </td>
                    <td className="px-8 py-6"><span className="text-sm font-medium text-gray-600">{(order as any)?.user?.name || (order as any)?.user?.email || 'Guest'}</span></td>
                    <td className="px-8 py-6"><span className="font-bold text-sm text-[#0A0A0A]">{formatCurrency((order as any)?.total_amount ?? (order as any)?.totalAmount ?? 0)}</span></td>
                    <td className="px-8 py-6">
                      <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold ${statusClass}
                    `}>
                        {status}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <button className="text-gray-400 hover:text-[#C6A87C] transition-colors">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Products Page Component
function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [total, setTotal] = useState<number | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [formValues, setFormValues] = useState({
    name: '',
    description: '',
    base_price: '',
    sale_price: '',
    brand: '',
    category_id: '1',
  });
  const [formImages, setFormImages] = useState<File[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const loadProducts = async (nextPage = page, nextSearch = search) => {
    try {
      setLoading(true);
      setError(null);
      const res = await listProducts({ page: nextPage, limit, search: nextSearch });
      setProducts(res.items);
      setTotal(res.pagination?.total);
      setPage(res.pagination?.page ?? nextPage);
    } catch (err: any) {
      setError(err?.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(1, '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openModal = (product?: Product) => {
    if (product) {
      setEditing(product);
      setFormValues({
        name: product.name ?? '',
        description: product.description ?? '',
        base_price: String(product.base_price ?? ''),
        sale_price: product.sale_price ? String(product.sale_price) : '',
        brand: product.brand ?? '',
        category_id: product.category_id ? String(product.category_id) : '1',
      });
    } else {
      setEditing(null);
      setFormValues({
        name: '',
        description: '',
        base_price: '',
        sale_price: '',
        brand: '',
        category_id: '1',
      });
    }
    setFormImages([]);
    setFormError(null);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditing(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);
    setFormSubmitting(true);
    try {
      const payload: any = {
        name: formValues.name,
        description: formValues.description,
        base_price: Number(formValues.base_price),
        sale_price: formValues.sale_price ? Number(formValues.sale_price) : undefined,
        brand: formValues.brand,
        category_id: Number(formValues.category_id),
        images: formImages,
      };
      if (editing) {
        await updateProduct(editing.id, payload);
      } else {
        await createProduct(payload);
      }
      closeModal();
      loadProducts(page, search);
    } catch (err: any) {
      setFormError(err?.message || 'Failed to save product');
    } finally {
      setFormSubmitting(false);
    }
  };

  const handleDelete = async (id: number | string) => {
    const confirmed = window.confirm('Are you sure you want to delete this product?');
    if (!confirmed) return;
    try {
      await deleteProduct(id);
      loadProducts(page, search);
    } catch (err: any) {
      setError(err?.message || 'Failed to delete product');
    }
  };

  return (
    <div className="space-y-8">
      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
           <span className="text-gray-400 text-sm">
            Showing <b className="text-[#0A0A0A]">{products?.length || 0}</b>
            {typeof total === 'number' ? <> of <b className="text-[#0A0A0A]">{total}</b></> : null} products
           </span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                loadProducts(1, search);
              }
            }}
            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#C6A87C]"
          />
          <button className="bg-white border border-gray-200 text-[#0A0A0A] px-5 py-2.5 uppercase text-xs tracking-wider hover:border-[#0A0A0A] transition-colors flex items-center gap-2 font-bold rounded-lg shadow-sm">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button
            onClick={() => openModal()}
            className="bg-[#0A0A0A] hover:bg-[#2A2A2A] text-[#C6A87C] px-6 py-2.5 uppercase text-xs tracking-wider transition-all hover:shadow-lg flex items-center gap-2 font-bold rounded-lg"
          >
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {loading && (
          <div className="col-span-full text-center text-sm text-gray-500 py-6">Loading products...</div>
        )}
        {error && !loading && (
          <div className="col-span-full text-center text-sm text-red-600 py-6">{error}</div>
        )}
        {!loading && !error && (products || []).map((product) => (
          <div key={product.id} className="group relative bg-white rounded-xl overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all duration-500">
            {/* Image Container */}
            <div className="aspect-[3/4] overflow-hidden relative">
              <img
                src={
                  (product.images && product.images[0]) ||
                  ((product as any)?.variants?.[0]?.image_url) ||
                  'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop'
                }
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-[#0A0A0A]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-[2px]">
                <button
                  onClick={() => openModal(product)}
                  className="w-10 h-10 rounded-full bg-white text-[#0A0A0A] flex items-center justify-center hover:bg-[#C6A87C] hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75 shadow-lg"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="w-10 h-10 rounded-full bg-white text-[#0A0A0A] flex items-center justify-center hover:bg-red-500 hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-100 shadow-lg"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              
              {/* Badge */}
              {(() => {
                const totalStock = (product as any)?.variants?.reduce((sum: number, variant: any) => sum + (variant.stock_quantity || 0), 0) || 0;
                return totalStock < 20 && totalStock > 0 ? (
                  <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm">
                    Low Stock
                  </div>
                ) : totalStock === 0 ? (
                  <div className="absolute top-4 left-4 bg-gray-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm">
                    Out of Stock
                  </div>
                ) : null;
              })()}
            </div>

            {/* Content */}
            <div className="p-6 text-center relative">
              <p className="text-[#C6A87C] text-xs font-bold uppercase tracking-widest mb-2">{(product as any).category?.name || product.brand || 'Category'}</p>
              <h3 className="font-serif text-lg font-bold text-[#0A0A0A] mb-2 leading-tight group-hover:text-[#C6A87C] transition-colors">
                {product.name}
              </h3>
              <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-gray-100">
                 <span className="font-medium text-sm text-gray-400">{(product as any)?.stock_quantity ?? '--'} in stock</span>
                 <span className="font-serif text-lg font-bold text-[#0A0A0A]">{formatCurrency(product.base_price ?? 0)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {!loading && !error && (
        <div className="flex items-center justify-between px-2">
          <p className="text-sm text-gray-600">
            Page {page} {typeof total === 'number' ? `of ${Math.max(1, Math.ceil(total / limit))}` : ''}
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                const next = Math.max(1, page - 1);
                setPage(next);
                loadProducts(next, search);
              }}
              disabled={page === 1}
              className="w-8 h-8 border border-border-light flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            <button
              onClick={() => {
                const next = page + 1;
                setPage(next);
                loadProducts(next, search);
              }}
              disabled={typeof total === 'number' ? page * limit >= total : false}
              className="w-8 h-8 border border-border-light flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-lg w-full p-6 relative">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
              onClick={closeModal}
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-serif text-xl font-bold text-[#0A0A0A] mb-4">
              {editing ? 'Edit Product' : 'Add Product'}
            </h3>
            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Name</label>
                <input
                  value={formValues.name}
                  onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                  required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#C6A87C] focus:border-[#C6A87C]"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Description</label>
                <textarea
                  value={formValues.description}
                  onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#C6A87C] focus:border-[#C6A87C]"
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Base Price</label>
                  <input
                    type="number"
                    value={formValues.base_price}
                    onChange={(e) => setFormValues({ ...formValues, base_price: e.target.value })}
                    required
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#C6A87C] focus:border-[#C6A87C]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Sale Price</label>
                  <input
                    type="number"
                    value={formValues.sale_price}
                    onChange={(e) => setFormValues({ ...formValues, sale_price: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#C6A87C] focus:border-[#C6A87C]"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Brand</label>
                  <input
                    value={formValues.brand}
                    onChange={(e) => setFormValues({ ...formValues, brand: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#C6A87C] focus:border-[#C6A87C]"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Category ID</label>
                  <input
                    type="number"
                    value={formValues.category_id}
                    onChange={(e) => setFormValues({ ...formValues, category_id: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-[#C6A87C] focus:border-[#C6A87C]"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">Images</label>
                <input
                  type="file"
                  multiple
                  onChange={(e) => setFormImages(e.target.files ? Array.from(e.target.files) : [])}
                  className="w-full text-sm"
                />
              </div>
              {formError && <p className="text-sm text-red-600">{formError}</p>}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-4 py-2 text-sm font-semibold text-gray-600 hover:text-gray-800"
                  disabled={formSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="bg-[#0A0A0A] text-[#C6A87C] px-5 py-2 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-[#2A2A2A] transition-colors disabled:opacity-50"
                >
                  {formSubmitting ? 'Saving...' : editing ? 'Update Product' : 'Create Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Orders Page Component - Styled as Invoice
function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [pagination, setPagination] = useState<{ page: number; total?: number; limit: number }>({ page: 1, limit: 10 });
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | ''>('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadOrders = async (page = pagination.page) => {
    try {
      setLoading(true);
      setError(null);
      const res = await listOrders({
        page,
        limit: pagination.limit,
        status: statusFilter || undefined,
        search,
      });
      setOrders(res.items);
      setPagination({
        page: res.pagination?.page ?? page,
        limit: res.pagination?.limit ?? pagination.limit,
        total: res.pagination?.total,
      });
    } catch (err: any) {
      setError(err?.message || 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusFilter]);

  const loadDetail = async (id: number | string) => {
    try {
      setDetailLoading(true);
      const res = await getOrderById(id);
      setSelectedOrder(res as Order);
    } catch (err: any) {
      setActionMessage(err?.message || 'Failed to load order detail');
    } finally {
      setDetailLoading(false);
    }
  };

  const handleStatusUpdate = async (orderId: number | string, nextStatus: OrderStatus) => {
    const confirmed = window.confirm(`Change status to "${nextStatus}"?`);
    if (!confirmed) return;
    try {
      await updateOrderStatus(orderId, nextStatus);
      setActionMessage('Status updated');
      loadOrders(pagination.page);
      if (selectedOrder?.id === orderId) {
        loadDetail(orderId);
      }
    } catch (err: any) {
      setActionMessage(err?.message || 'Failed to update status');
    }
  };

  const handleRefund = async (orderId: number | string) => {
    const reason = window.prompt('Enter refund reason');
    const amountInput = window.prompt('Enter refund amount');
    if (!reason || !amountInput) return;
    const amount = Number(amountInput);
    if (Number.isNaN(amount)) {
      setActionMessage('Invalid refund amount');
      return;
    }
    try {
      await processRefund(orderId, { reason, amount });
      setActionMessage('Refund processed');
      loadOrders(pagination.page);
      if (selectedOrder?.id === orderId) {
        loadDetail(orderId);
      }
    } catch (err: any) {
      setActionMessage(err?.message || 'Failed to process refund');
    }
  };

  const statusOptions: OrderStatus[] = ['pending', 'confirmed', 'shipping', 'completed', 'canceled', 'paid', 'refunded'];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Search by code or customer"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') loadOrders(1); }}
            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#C6A87C]"
          />
          <button
            onClick={() => loadOrders(1)}
            className="bg-[#0A0A0A] text-[#C6A87C] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#2A2A2A]"
          >
            Search
          </button>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as OrderStatus | '')}
            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#C6A87C]"
          >
            <option value="">All Status</option>
            {statusOptions.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {loading && <div className="bg-white border border-gray-100 rounded-lg p-6 text-sm text-gray-500">Loading orders...</div>}
      {error && <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">{error}</div>}

      {!loading && !error && (
        <div className="bg-white border border-border-light">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F9F9F9]">
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest font-semibold text-gray-600">Order ID</th>
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest font-semibold text-gray-600">Customer</th>
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest font-semibold text-gray-600">Total</th>
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest font-semibold text-gray-600">Status</th>
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest font-semibold text-gray-600">Created</th>
                  <th className="text-right px-6 py-4 text-[11px] uppercase tracking-widest font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => {
                  const status = (order as any)?.status || 'pending';
                  const statusClass = status.toLowerCase() === 'completed'
                    ? 'bg-green-100 text-green-700'
                    : status.toLowerCase() === 'processing' || status.toLowerCase() === 'shipping'
                      ? 'bg-blue-100 text-blue-700'
                      : status.toLowerCase() === 'canceled'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-orange-100 text-orange-700';
                  return (
                    <tr key={order.id} className="border-b border-border-light hover:bg-gray-50/50 transition-colors">
                      <td className="px-6 py-5">
                        <button
                          onClick={() => loadDetail(order.id)}
                          className="font-mono text-sm font-medium text-[#0A0A0A] underline"
                        >
                          #{order.id}
                        </button>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm">{(order as any)?.user?.name || (order as any)?.user?.email || 'Guest'}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="font-semibold text-sm">{formatCurrency((order as any)?.total_amount ?? (order as any)?.totalAmount ?? 0)}</span>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-block px-3 py-1 text-[10px] uppercase tracking-wider rounded-full ${statusClass}`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-sm text-gray-600">{formatDate((order as any)?.created_at ?? (order as any)?.createdAt)}</span>
                      </td>
                      <td className="px-6 py-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <select
                            value=""
                            onChange={(e) => {
                              const next = e.target.value as OrderStatus;
                              if (next) handleStatusUpdate(order.id, next);
                              e.target.value = '';
                            }}
                            className="text-xs border border-gray-200 rounded px-2 py-1"
                          >
                            <option value="">Status</option>
                            {statusOptions.map((s) => (
                              <option key={s} value={s}>{s}</option>
                            ))}
                          </select>
                          <button
                            onClick={() => handleRefund(order.id)}
                            className="text-xs text-[#C6A87C] hover:text-[#0A0A0A]"
                          >
                            Refund
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t border-border-light">
            <p className="text-sm text-gray-600">
              Page {pagination.page}{pagination.total ? ` of ${Math.max(1, Math.ceil((pagination.total ?? 0) / pagination.limit))}` : ''}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const next = Math.max(1, pagination.page - 1);
                  setPagination((prev) => ({ ...prev, page: next }));
                  loadOrders(next);
                }}
                disabled={pagination.page === 1}
                className="w-8 h-8 border border-border-light flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const next = pagination.page + 1;
                  setPagination((prev) => ({ ...prev, page: next }));
                  loadOrders(next);
                }}
                disabled={pagination.total ? pagination.page * pagination.limit >= (pagination.total ?? 0) : false}
                className="w-8 h-8 border border-border-light flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedOrder && (
        <div className="bg-white border border-gray-100 rounded-lg p-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-serif text-xl font-bold text-[#0A0A0A]">Order #{selectedOrder.id}</h3>
              <p className="text-gray-500 text-sm">Placed on {formatDate((selectedOrder as any)?.created_at ?? (selectedOrder as any)?.createdAt)}</p>
            </div>
            <div className="flex items-center gap-3">
              <select
                value=""
                onChange={(e) => {
                  const next = e.target.value as OrderStatus;
                  if (next) handleStatusUpdate(selectedOrder.id, next);
                  e.target.value = '';
                }}
                className="text-xs border border-gray-200 rounded px-3 py-2"
              >
                <option value="">Update Status</option>
                {statusOptions.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
              <button
                onClick={() => handleRefund(selectedOrder.id)}
                className="bg-[#0A0A0A] text-[#C6A87C] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#2A2A2A]"
              >
                Refund
              </button>
            </div>
          </div>

          {detailLoading ? (
            <p className="text-sm text-gray-500">Loading order details...</p>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div>
                  <p className="text-xs uppercase tracking-widest font-bold text-gray-500">Customer</p>
                  <p className="font-serif text-lg font-bold text-[#0A0A0A]">{(selectedOrder as any)?.user?.name || (selectedOrder as any)?.user?.email || 'Guest'}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest font-bold text-gray-500">Total</p>
                  <p className="font-semibold">{formatCurrency((selectedOrder as any)?.total_amount ?? (selectedOrder as any)?.totalAmount ?? 0)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest font-bold text-gray-500">Status</p>
                  <p className="font-semibold capitalize">{(selectedOrder as any)?.status}</p>
                </div>
              </div>

              <div className="border border-gray-100">
                <table className="w-full">
                  <thead className="bg-[#FAF8F5]">
                    <tr>
                      <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-gray-500">Item</th>
                      <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-gray-500">Qty</th>
                      <th className="text-left px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-gray-500">Price</th>
                      <th className="text-right px-4 py-3 text-[10px] uppercase tracking-widest font-bold text-gray-500">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {(selectedOrder as any)?.order_items?.map((item: any) => (
                      <tr key={item.id}>
                        <td className="px-4 py-3">
                          <p className="font-medium text-sm">{item.product?.name || `Product ${item.product_id}`}</p>
                          <p className="text-xs text-gray-500">SKU: {item.product?.slug || item.product_id}</p>
                        </td>
                        <td className="px-4 py-3 text-sm">{item.quantity}</td>
                        <td className="px-4 py-3 text-sm">{formatCurrency(item.unit_price ?? 0)}</td>
                        <td className="px-4 py-3 text-sm text-right">{formatCurrency(item.line_total ?? (item.unit_price ?? 0) * item.quantity)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
          {actionMessage && <p className="text-sm text-gray-600 mt-4">{actionMessage}</p>}
        </div>
      )}
    </div>
  );
}

// Customers Page Component - User Management
function CustomersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [total, setTotal] = useState<number | undefined>(undefined);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsers = async (nextPage = page, nextSearch = search) => {
    try {
      setLoading(true);
      setError(null);
      const { listUsers } = await import('./lib/users');
      const res = await listUsers({ page: nextPage, limit, search: nextSearch });
      setUsers(res.items || []);
      setTotal(res.pagination?.total);
      setPage(res.pagination?.page ?? nextPage);
    } catch (err: any) {
      setError(err?.message || 'Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUsers(1, '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleRoleUpdate = async (userId: number | string, newRole: string) => {
    try {
      const { updateUserRole } = await import('./lib/users');
      await updateUserRole(userId, newRole as any);
      loadUsers(page, search);
    } catch (err: any) {
      setError(err?.message || 'Failed to update user role');
    }
  };

  const handleLockToggle = async (userId: number | string, isLocked: boolean) => {
    try {
      const { lockUser } = await import('./lib/users');
      await lockUser(userId, !isLocked);
      loadUsers(page, search);
    } catch (err: any) {
      setError(err?.message || 'Failed to update user status');
    }
  };

  const handleDelete = async (userId: number | string) => {
    const confirmed = window.confirm('Are you sure you want to deactivate this user?');
    if (!confirmed) return;
    try {
      const { deleteUser } = await import('./lib/users');
      await deleteUser(userId);
      loadUsers(page, search);
    } catch (err: any) {
      setError(err?.message || 'Failed to deactivate user');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
           <span className="text-gray-400 text-sm">
            Showing <b className="text-[#0A0A0A]">{(users || []).length}</b>
            {typeof total === 'number' ? <> of <b className="text-[#0A0A0A]">{total}</b></> : null} users
           </span>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                loadUsers(1, search);
              }
            }}
            className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#C6A87C]"
          />
          <button
            onClick={() => loadUsers(1, search)}
            className="bg-[#0A0A0A] hover:bg-[#2A2A2A] text-[#C6A87C] px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
          >
            Search
          </button>
        </div>
      </div>

      {loading && (
        <div className="bg-white border border-gray-100 rounded-lg p-6 text-sm text-gray-500">Loading users...</div>
      )}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-700">{error}</div>
      )}

      {!loading && !error && (
        <div className="bg-white border border-border-light rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-[#F9F9F9]">
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest font-semibold text-gray-600">User ID</th>
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest font-semibold text-gray-600">Name</th>
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest font-semibold text-gray-600">Email</th>
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest font-semibold text-gray-600">Role</th>
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest font-semibold text-gray-600">Status</th>
                  <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest font-semibold text-gray-600">Joined</th>
                  <th className="text-right px-6 py-4 text-[11px] uppercase tracking-widest font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border-light hover:bg-gray-50/50 transition-colors">
                    <td className="px-6 py-5">
                      <span className="font-mono text-sm font-medium text-[#0A0A0A]">#{user.id}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm">{user.name || '—'}</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm">{user.email}</span>
                    </td>
                    <td className="px-6 py-5">
                      <select
                        value={user.role || 'customer'}
                        onChange={(e) => handleRoleUpdate(user.id, e.target.value)}
                        className="text-xs border border-gray-200 rounded px-2 py-1"
                      >
                        <option value="customer">Customer</option>
                        <option value="admin">Admin</option>
                        <option value="super_admin">Super Admin</option>
                      </select>
                    </td>
                    <td className="px-6 py-5">
                      <span className={`inline-block px-3 py-1 text-[10px] uppercase tracking-wider rounded-full ${
                        user.is_locked
                          ? 'bg-red-100 text-red-700'
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {user.is_locked ? 'Locked' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-sm text-gray-600">{formatDate(user.created_at)}</span>
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleLockToggle(user.id, user.is_locked)}
                          className="text-xs px-3 py-1 rounded border border-gray-200 hover:bg-gray-50"
                        >
                          {user.is_locked ? 'Unlock' : 'Lock'}
                        </button>
                        <button
                          onClick={() => handleDelete(user.id)}
                          className="text-xs text-red-600 hover:text-red-800"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center justify-between px-6 py-4 border-t border-border-light">
            <p className="text-sm text-gray-600">
              Page {page}{total ? ` of ${Math.max(1, Math.ceil((total ?? 0) / limit))}` : ''}
            </p>
            <div className="flex items-center gap-2">
              <button
                onClick={() => {
                  const next = Math.max(1, page - 1);
                  setPage(next);
                  loadUsers(next, search);
                }}
                disabled={page === 1}
                className="w-8 h-8 border border-border-light flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={() => {
                  const next = page + 1;
                  setPage(next);
                  loadUsers(next, search);
                }}
                disabled={total ? page * limit >= (total ?? 0) : false}
                className="w-8 h-8 border border-border-light flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
