import React, { useState } from 'react';
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
  Printer,
  Check,
  Edit2,
  Eye,
  Download,
  Share2,
  MoreHorizontal
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

type Page = 'dashboard' | 'products' | 'orders' | 'analytics' | 'settings';

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
  { name: 'Products', icon: Package, id: 'products' },
  { name: 'Orders', icon: ShoppingBag, id: 'orders' },
  { name: 'Customers', icon: Users, id: 'customers' },
  { name: 'Analytics', icon: BarChart3, id: 'analytics' },
  { name: 'Settings', icon: Settings, id: 'settings' },
];

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);

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
              </h2>
              <p className="text-gray-500 text-xs tracking-wider uppercase mt-1">
                {currentPage === 'dashboard' && 'Overview & Analytics'}
                {currentPage === 'products' && 'Manage Inventory'}
                {currentPage === 'orders' && 'Order Management'}
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
            {currentPage === 'analytics' && <AnalyticsPage />}
            {currentPage === 'settings' && <SettingsPage />}
          </div>
        </main>
      </div>
    </div>
  );
}

// Analytics Page Component
function AnalyticsPage() {
  const salesData = [
    { name: 'Jan', revenue: 4000, target: 2400 },
    { name: 'Feb', revenue: 3000, target: 1398 },
    { name: 'Mar', revenue: 2000, target: 9800 },
    { name: 'Apr', revenue: 2780, target: 3908 },
    { name: 'May', revenue: 1890, target: 4800 },
    { name: 'Jun', revenue: 2390, target: 3800 },
    { name: 'Jul', revenue: 3490, target: 4300 },
  ];

  const categoryData = [
    { name: 'Suits', value: 400 },
    { name: 'Footwear', value: 300 },
    { name: 'Accessories', value: 300 },
    { name: 'Watches', value: 200 },
  ];

  const COLORS = ['#0A0A0A', '#C6A87C', '#8E7340', '#D4C5A9'];

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl font-bold text-[#0A0A0A]">Performance Analytics</h1>
        <div className="flex bg-white border border-gray-200 rounded-lg p-1">
          {['Weekly', 'Monthly', 'Yearly'].map((period) => (
            <button key={period} className="px-4 py-1.5 text-sm font-medium rounded-md hover:bg-gray-50 focus:bg-[#0A0A0A] focus:text-[#C6A87C] transition-colors">
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Top Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Conversion Rate', value: '3.6%', change: '+0.5%', positive: true },
          { label: 'Avg. Order Value', value: '₫4.2M', change: '-1.2%', positive: false },
          { label: 'Return Rate', value: '2.1%', change: '-0.3%', positive: true },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.03)] border border-gray-100">
             <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-2">{stat.label}</p>
             <div className="flex items-end justify-between">
                <h3 className="text-3xl font-serif font-bold text-[#0A0A0A]">{stat.value}</h3>
                <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.positive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {stat.change}
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
                  {categoryData.map((entry, index) => (
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
  const kpiData = [
    { label: 'Total Revenue', value: '489.5M', currency: '₫', trend: '+12.5%', isPositive: true, icon: DollarSign },
    { label: 'Total Orders', value: '1,234', currency: '', trend: '+8.2%', isPositive: true, icon: ShoppingCart },
    { label: 'Avg. Order Value', value: '3.2M', currency: '₫', trend: '-2.1%', isPositive: false, icon: TrendingUp },
    { label: 'Active Customers', value: '892', currency: '', trend: '+15.3%', isPositive: true, icon: Users },
  ];

  const chartData = [
    { name: 'Mon', value: 4000 },
    { name: 'Tue', value: 3000 },
    { name: 'Wed', value: 2000 },
    { name: 'Thu', value: 2780 },
    { name: 'Fri', value: 1890 },
    { name: 'Sat', value: 2390 },
    { name: 'Sun', value: 3490 },
  ];

  const recentOrders = [
    {
      id: 'ORD-001',
      product: 'Classic Navy Suit',
      customer: 'Nguyễn Văn A',
      amount: '₫12,500,000',
      status: 'Completed',
      date: '2024-01-15',
      image: 'https://images.unsplash.com/photo-1756277242553-147261b654d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtZW4lMjBzdWl0JTIwZmFzaGlvbnxlbnwxfHx8fDE3NjU5NTI2ODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'ORD-002',
      product: 'Silk Evening Tie',
      customer: 'Trần Thị B',
      amount: '₫8,900,000',
      status: 'Processing',
      date: '2024-01-15',
      image: 'https://images.unsplash.com/photo-1763888647863-d6d0c7383151?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzaWxrJTIwdGllfGVufDF8fHx8MTc2NTk1MjY4OXww&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'ORD-003',
      product: 'Leather Oxford Shoes',
      customer: 'Lê Văn C',
      amount: '₫4,200,000',
      status: 'Completed',
      date: '2024-01-14',
      image: 'https://images.unsplash.com/photo-1760616172899-0681b97a2de3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtZW4lMjBsZWF0aGVyJTIwc2hvZXN8ZW58MXx8fHwxNzY1OTUyNjg5fDA&ixlib=rb-4.1.0&q=80&w=1080',
    },
    {
      id: 'ORD-004',
      product: 'Gold Chronograph',
      customer: 'Phạm Minh D',
      amount: '₫85,000,000',
      status: 'Pending',
      date: '2024-01-14',
      image: 'https://images.unsplash.com/photo-1702865053958-71ec751c4118?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtZW4lMjB3YXRjaHxlbnwxfHx8fDE3NjU5NTI2ODl8MA&ixlib=rb-4.1.0&q=80&w=1080',
    },
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
                {kpi.currency && <span className="text-lg font-serif text-[#C6A87C] font-bold">{kpi.currency}</span>}
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
                  tickFormatter={(value) => `$${value}`}
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
            {[1, 2, 3].map((item, i) => (
              <div key={i} className="flex items-center gap-4">
                <span className="text-[#C6A87C] font-serif text-xl font-bold">0{item}</span>
                <div className="flex-1">
                  <h4 className="font-medium text-sm">Classic Italian Suit</h4>
                  <p className="text-white/40 text-xs mt-1">452 Sales</p>
                </div>
                <span className="font-mono text-sm">₫12.5M</span>
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
                <th className="text-left px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-gray-500">Product</th>
                <th className="text-left px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-gray-500">Customer</th>
                <th className="text-left px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-gray-500">Amount</th>
                <th className="text-left px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-gray-500">Status</th>
                <th className="text-right px-8 py-5 text-[10px] uppercase tracking-widest font-bold text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody>
              {recentOrders.map((order) => (
                <tr key={order.id} className="border-b border-gray-50 hover:bg-[#FAF8F5]/50 transition-colors group">
                  <td className="px-8 py-6">
                    <span className="font-mono text-xs font-bold text-gray-400">{order.id}</span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full overflow-hidden border border-gray-200 shadow-sm">
                        <img src={order.image} alt={order.product} className="w-full h-full object-cover" />
                      </div>
                      <span className="font-serif font-bold text-[#0A0A0A] text-sm">{order.product}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6"><span className="text-sm font-medium text-gray-600">{order.customer}</span></td>
                  <td className="px-8 py-6"><span className="font-bold text-sm text-[#0A0A0A]">{order.amount}</span></td>
                  <td className="px-8 py-6">
                    <span className={`
                      inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wider font-bold
                      ${order.status === 'Completed' ? 'bg-green-100 text-green-700' : 
                        order.status === 'Processing' ? 'bg-blue-100 text-blue-700' : 
                        'bg-orange-100 text-orange-700'}
                    `}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="text-gray-400 hover:text-[#C6A87C] transition-colors">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
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

// Products Page Component
function ProductsPage() {
  const products = [
    { id: 1, name: 'Italian Wool Suit', category: 'Suits', price: '$1,200', stock: 45, image: 'https://images.unsplash.com/photo-1756277242553-147261b654d5?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtZW4lMjBzdWl0JTIwZmFzaGlvbnxlbnwxfHx8fDE3NjU5NTI2ODl8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 2, name: 'Oxford Leather Shoes', category: 'Footwear', price: '$350', stock: 28, image: 'https://images.unsplash.com/photo-1760616172899-0681b97a2de3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtZW4lMjBsZWF0aGVyJTIwc2hvZXN8ZW58MXx8fHwxNzY1OTUyNjg5fDA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 3, name: 'Royal Oak Gold', category: 'Accessories', price: '$2,500', stock: 12, image: 'https://images.unsplash.com/photo-1702865053958-71ec751c4118?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtZW4lMjB3YXRjaHxlbnwxfHx8fDE3NjU5NTI2ODl8MA&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 4, name: 'Silk Paisley Tie', category: 'Accessories', price: '$120', stock: 150, image: 'https://images.unsplash.com/photo-1763888647863-d6d0c7383151?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBzaWxrJTIwdGllfGVufDF8fHx8MTc2NTk1MjY4OXww&ixlib=rb-4.1.0&q=80&w=1080' },
    { id: 5, name: 'Velvet Blazer', category: 'Suits', price: '$850', stock: 32, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop' },
    { id: 6, name: 'Classic Cufflinks', category: 'Accessories', price: '$85', stock: 200, image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400&h=500&fit=crop' },
    { id: 7, name: 'Leather Briefcase', category: 'Bags', price: '$650', stock: 15, image: 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=400&h=500&fit=crop' },
    { id: 8, name: 'Chelsea Boots', category: 'Footwear', price: '$280', stock: 42, image: 'https://images.unsplash.com/photo-1605733513597-a8f8341084e6?w=400&h=500&fit=crop' },
  ];

  return (
    <div className="space-y-8">
      {/* Actions Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
           <span className="text-gray-400 text-sm">Showing <b className="text-[#0A0A0A]">8</b> of <b className="text-[#0A0A0A]">342</b> products</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-gray-200 text-[#0A0A0A] px-5 py-2.5 uppercase text-xs tracking-wider hover:border-[#0A0A0A] transition-colors flex items-center gap-2 font-bold rounded-lg shadow-sm">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="bg-[#0A0A0A] hover:bg-[#2A2A2A] text-[#C6A87C] px-6 py-2.5 uppercase text-xs tracking-wider transition-all hover:shadow-lg flex items-center gap-2 font-bold rounded-lg">
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <div key={product.id} className="group relative bg-white rounded-xl overflow-hidden shadow-[0_5px_15px_rgba(0,0,0,0.05)] hover:shadow-[0_20px_40px_rgba(0,0,0,0.1)] transition-all duration-500">
            {/* Image Container */}
            <div className="aspect-[3/4] overflow-hidden relative">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              {/* Overlay on Hover */}
              <div className="absolute inset-0 bg-[#0A0A0A]/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4 backdrop-blur-[2px]">
                <button className="w-10 h-10 rounded-full bg-white text-[#0A0A0A] flex items-center justify-center hover:bg-[#C6A87C] hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-75 shadow-lg">
                  <Edit2 className="w-4 h-4" />
                </button>
                <button className="w-10 h-10 rounded-full bg-white text-[#0A0A0A] flex items-center justify-center hover:bg-[#C6A87C] hover:text-white transition-all transform translate-y-4 group-hover:translate-y-0 duration-300 delay-100 shadow-lg">
                  <Eye className="w-4 h-4" />
                </button>
              </div>
              
              {/* Badge */}
              {product.stock < 20 && (
                <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-sm">
                  Low Stock
                </div>
              )}
            </div>

            {/* Content */}
            <div className="p-6 text-center relative">
              <p className="text-[#C6A87C] text-xs font-bold uppercase tracking-widest mb-2">{product.category}</p>
              <h3 className="font-serif text-lg font-bold text-[#0A0A0A] mb-2 leading-tight group-hover:text-[#C6A87C] transition-colors">
                {product.name}
              </h3>
              <div className="flex items-center justify-center gap-4 mt-3 pt-3 border-t border-gray-100">
                 <span className="font-medium text-sm text-gray-400">{product.stock} in stock</span>
                 <span className="font-serif text-lg font-bold text-[#0A0A0A]">{product.price}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Orders Page Component - Styled as Invoice
function OrdersPage() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <button className="flex items-center gap-2 text-gray-500 hover:text-[#0A0A0A] transition-colors text-sm font-medium">
          <ChevronLeft className="w-4 h-4" /> Back to List
        </button>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-gray-300 text-[#0A0A0A] px-4 py-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-50 flex items-center gap-2 rounded-lg">
            <Download className="w-4 h-4" /> PDF
          </button>
          <button className="bg-[#0A0A0A] text-[#C6A87C] px-5 py-2 text-xs font-bold uppercase tracking-wider hover:bg-gray-900 flex items-center gap-2 rounded-lg shadow-lg">
            <Printer className="w-4 h-4" /> Print Invoice
          </button>
        </div>
      </div>

      {/* Invoice Paper */}
      <div className="bg-white p-12 md:p-16 shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-sm relative overflow-hidden">
        {/* Paper Texture Effect */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" 
             style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }} 
        />

        {/* Header */}
        <div className="flex flex-col items-center justify-center border-b-2 border-[#0A0A0A] pb-8 mb-8 relative z-10 text-center">
          <h1 className="font-serif text-[#C6A87C] uppercase tracking-[0.2em] text-4xl font-bold mb-2">
            Aristino
          </h1>
          <p className="text-xs uppercase tracking-widest text-[#0A0A0A]/60 mb-6">Luxury Fashion House</p>
          
          <div className="flex items-center justify-between w-full mt-4 pt-4 border-t border-dashed border-gray-200">
             <div className="text-left">
                <p className="font-mono text-sm text-gray-500 uppercase tracking-wider">Invoice No.</p>
                <p className="font-mono text-lg font-bold text-[#0A0A0A]">#INV-2024-001</p>
             </div>
             <div className="text-right">
                <p className="font-mono text-sm text-gray-500 uppercase tracking-wider">Date Issued</p>
                <p className="font-mono text-lg font-bold text-[#0A0A0A]">Jan 15, 2024</p>
             </div>
          </div>
        </div>

        {/* Invoice Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 relative z-10">
          <div>
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4">Billed To</h3>
            <p className="font-serif text-lg font-bold text-[#0A0A0A] mb-1">Mr. Alexander Hamilton</p>
            <p className="text-sm text-gray-600 leading-relaxed">
              123 Luxury Avenue<br />
              District 1, Ho Chi Minh City<br />
              Vietnam
            </p>
          </div>
          <div>
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4">Payment Method</h3>
            <p className="font-medium text-[#0A0A0A] text-sm mb-1">Visa ending in **** 4242</p>
            <p className="text-sm text-gray-600">Processed on Jan 15, 2024</p>
          </div>
          <div className="md:text-right">
            <h3 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4">Invoice Date</h3>
            <p className="font-medium text-[#0A0A0A] text-sm">January 15, 2024</p>
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-100">
              <Check className="w-3 h-3" /> Paid Successfully
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="mb-10 relative z-10">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#0A0A0A]">
                <th className="text-left py-3 text-[10px] uppercase tracking-widest font-bold text-[#0A0A0A]">Item Description</th>
                <th className="text-center py-3 text-[10px] uppercase tracking-widest font-bold text-[#0A0A0A]">Qty</th>
                <th className="text-right py-3 text-[10px] uppercase tracking-widest font-bold text-[#0A0A0A]">Price</th>
                <th className="text-right py-3 text-[10px] uppercase tracking-widest font-bold text-[#0A0A0A]">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              <tr className="group">
                <td className="py-5">
                  <p className="font-serif font-bold text-[#0A0A0A]">Italian Wool Suit - Navy</p>
                  <p className="text-xs text-gray-500 mt-1">Size: 42R · SKU: SUIT-001-NV</p>
                </td>
                <td className="py-5 text-center font-mono text-sm">1</td>
                <td className="py-5 text-right font-mono text-sm text-gray-600">$1,200.00</td>
                <td className="py-5 text-right font-mono font-medium text-[#0A0A0A]">$1,200.00</td>
              </tr>
              <tr className="group">
                <td className="py-5">
                  <p className="font-serif font-bold text-[#0A0A0A]">Oxford Leather Shoes</p>
                  <p className="text-xs text-gray-500 mt-1">Size: 42 · SKU: SHOE-089-BR</p>
                </td>
                <td className="py-5 text-center font-mono text-sm">1</td>
                <td className="py-5 text-right font-mono text-sm text-gray-600">$350.00</td>
                <td className="py-5 text-right font-mono font-medium text-[#0A0A0A]">$350.00</td>
              </tr>
              <tr className="group">
                <td className="py-5">
                  <p className="font-serif font-bold text-[#0A0A0A]">Silk Paisley Tie</p>
                  <p className="text-xs text-gray-500 mt-1">Color: Burgundy · SKU: TIE-221-BG</p>
                </td>
                <td className="py-5 text-center font-mono text-sm">2</td>
                <td className="py-5 text-right font-mono text-sm text-gray-600">$120.00</td>
                <td className="py-5 text-right font-mono font-medium text-[#0A0A0A]">$240.00</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div className="flex flex-col md:flex-row justify-end relative z-10">
          <div className="w-full md:w-1/2 lg:w-1/3 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Subtotal</span>
              <span className="font-mono font-medium">$1,790.00</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Tax (8%)</span>
              <span className="font-mono font-medium">$143.20</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Shipping</span>
              <span className="font-mono font-medium">Free</span>
            </div>
            <div className="pt-4 mt-4 border-t border-[#0A0A0A] flex justify-between items-center">
              <span className="font-serif text-lg font-bold text-[#0A0A0A]">Total Amount</span>
              <span className="font-serif text-2xl font-bold text-[#C6A87C]">$1,933.20</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-100 text-center relative z-10">
          <p className="font-serif text-[#C6A87C] text-lg font-bold mb-2">Thank you for choosing Aristino</p>
          <p className="text-xs text-gray-400 uppercase tracking-widest">
            Questions? Email support@aristino.com or call +84 123 456 789
          </p>
        </div>
      </div>
    </div>
  );
}
