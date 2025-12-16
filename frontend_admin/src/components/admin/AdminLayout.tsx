import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'

export function AdminLayout() {
  return (
    <div className="flex min-h-screen bg-bg-surface text-text-primary">
      <Sidebar />
      <main className="flex-1 bg-bg-surface px-6 py-8 md:ml-[260px] md:px-10">
        <div className="mx-auto max-w-6xl">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
