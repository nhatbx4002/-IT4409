import type { ReactNode } from 'react'
import { Bell, Search } from 'lucide-react'

interface HeaderProps {
  breadcrumb: string[]
}

export function Header({ breadcrumb }: HeaderProps) {
  const pageTitle = breadcrumb[breadcrumb.length - 1] ?? 'Dashboard'

  return (
    <header className="sticky top-0 z-20 flex items-center justify-between border-b border-border-light bg-white px-6 py-4 md:px-10 md:py-5">
      <div className="flex flex-col">
        <span className="text-xs uppercase tracking-[0.18em] text-[#8f8f8f]">
          Admin / {pageTitle}
        </span>
        <h1 className="font-heading text-2xl font-semibold text-text-primary md:text-3xl">
          {pageTitle}
        </h1>
      </div>

      <div className="flex items-center gap-3 md:gap-4">
        <IconButton>
          <Search size={18} strokeWidth={1.5} />
        </IconButton>
        <IconButton>
          <Bell size={18} strokeWidth={1.5} />
        </IconButton>
        <div className="flex items-center gap-3">
          <div className="h-11 w-11 overflow-hidden rounded-full border-2 border-brand-gold shadow-sm">
            <img
              src="https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=120&q=80"
              alt="User avatar"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="hidden md:flex md:flex-col">
            <span className="text-sm font-semibold text-text-primary">Alex Carter</span>
            <span className="text-xs text-[#8f8f8f]">Administrator</span>
          </div>
        </div>
      </div>
    </header>
  )
}

function IconButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      className="flex h-11 w-11 items-center justify-center rounded-sm border border-border-light bg-white text-[#7a7a7a] transition-colors duration-150 hover:border-brand-gold hover:text-brand-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold/50"
    >
      {children}
    </button>
  )
}
