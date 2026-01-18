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
  X
} from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
  pageTitle: string;
  currentPage: string;
  onPageChange: (page: string) => void;
}

const navigation = [
  { name: 'Dashboard', icon: LayoutDashboard, href: '#dashboard', id: 'dashboard' },
  { name: 'Products', icon: Package, href: '#products', id: 'products' },
  { name: 'Orders', icon: ShoppingBag, href: '#orders', id: 'orders' },
  { name: 'Customers', icon: Users, href: '#customers', id: 'customers' },
  { name: 'Analytics', icon: BarChart3, href: '#analytics', id: 'analytics' },
  { name: 'Settings', icon: Settings, href: '#settings', id: 'settings' },
];

export function AdminLayout({ children, pageTitle, currentPage, onPageChange }: AdminLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - The "Noir" Element */}
      <aside 
        className={`
          fixed lg:static inset-y-0 left-0 z-50
          w-[260px] bg-brand-black
          flex flex-col
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Brand Logo */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-white/10">
          <h1 className="font-serif text-brand-gold uppercase tracking-wider">
            Aristino
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white/60 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-6 space-y-1">
          {navigation.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => {
                  onPageChange(item.id);
                  setSidebarOpen(false);
                }}
                className={`
                  w-full flex items-center gap-3 px-4 py-3
                  transition-all duration-200
                  ${isActive 
                    ? 'bg-brand-gold text-brand-black' 
                    : 'text-[#999999] hover:text-white hover:bg-white/5'
                  }
                `}
              >
                <Icon 
                  className="w-5 h-5" 
                  strokeWidth={isActive ? 2 : 1.5}
                />
                <span className={`text-sm ${isActive ? 'font-bold' : 'font-medium'}`}>
                  {item.name}
                </span>
              </button>
            );
          })}
        </nav>

        {/* User Profile */}
        <div className="px-6 py-4 border-t border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-brand-gold flex items-center justify-center">
              <span className="text-brand-black text-sm font-bold">AD</span>
            </div>
            <div>
              <p className="text-white text-sm font-medium">Admin User</p>
              <p className="text-white/50 text-xs">admin@aristino.com</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header - The "Clean" Element */}
        <header className="h-20 bg-white border-b border-border-light flex items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden text-gray-600 hover:text-gray-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="font-serif text-2xl text-text-primary">
              {pageTitle}
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-gray-50 rounded transition-colors">
              <Search className="w-5 h-5 text-gray-600" />
            </button>
            <button className="p-2 hover:bg-gray-50 rounded transition-colors relative">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-brand-gold rounded-full"></span>
            </button>
            <div className="w-10 h-10 rounded-full bg-gray-200 ring-2 ring-brand-gold flex items-center justify-center overflow-hidden">
              <span className="text-sm font-semibold text-gray-700">AU</span>
            </div>
          </div>
        </header>

        {/* Main Content Wrapper */}
        <main className="flex-1 overflow-auto bg-bg-surface p-6 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}