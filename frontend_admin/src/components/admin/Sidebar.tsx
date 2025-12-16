import { NavLink } from 'react-router-dom'
import {
  LayoutGrid,
  Shirt,
  ShoppingBag,
  Users,
  Tag,
  Settings,
} from 'lucide-react'
import { cn } from '../../utils/cn'

const navItems = [
  { label: 'Dashboard', to: '/admin/dashboard', icon: LayoutGrid },
  { label: 'Products', to: '/admin/products', icon: Shirt },
  { label: 'Orders', to: '/admin/orders', icon: ShoppingBag },
  { label: 'Customers', to: '/admin/customers', icon: Users },
  { label: 'Promotions', to: '/admin/promotions', icon: Tag },
  { label: 'Settings', to: '/admin/settings', icon: Settings },
]

export function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-30 hidden w-[260px] flex-col border-r border-white/10 bg-brand-black text-white md:flex">
      <div className="flex h-20 items-center justify-center border-b border-white/10 px-6">
        <span className="font-heading text-2xl font-semibold uppercase tracking-[0.22em] text-brand-gold">
          ARISTINO
        </span>
      </div>

      <nav className="flex-1 overflow-y-auto py-6">
        <ul className="space-y-1 px-3">
          {navItems.map((item) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'group flex w-full items-center gap-3 rounded-sm px-3 py-3 text-sm transition-colors duration-200',
                    isActive
                      ? 'bg-brand-gold font-semibold text-black'
                      : 'text-[#9CA3AF] hover:bg-white/5 hover:text-white'
                  )
                }
              >
                <item.icon
                  strokeWidth={1.5}
                  size={22}
                  className="text-current group-hover:text-current"
                />
                <span className="font-medium">{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  )
}
