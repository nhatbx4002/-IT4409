import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { AdminLayout } from './components/admin/AdminLayout'
import { Dashboard } from './components/admin/Dashboard'
import { ProductList } from './components/admin/products/ProductList'
import { ProductForm } from './components/admin/products/ProductForm'
import { OrderDetails } from './components/admin/orders/OrderDetails'
import { OrderList } from './components/admin/orders/OrderList'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="/admin" element={<AdminLayout />}>
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="products" element={<ProductsPage />} />
          <Route path="orders" element={<OrdersPage />} />
          <Route path="customers" element={<Placeholder title="Customers" />} />
          <Route path="promotions" element={<Placeholder title="Promotions" />} />
          <Route path="settings" element={<Placeholder title="Settings" />} />
          <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

function DashboardPage() {
  return (
    <div className="space-y-8">
      <Dashboard />
    </div>
  )
}

function ProductsPage() {
  return (
    <div className="space-y-8">
      <ProductList />
      <ProductForm />
    </div>
  )
}

function OrdersPage() {
  return (
    <div className="space-y-8">
      <OrderList />
    </div>
  )
}

function Placeholder({ title }: { title: string }) {
  return (
    <div className="flex min-h-[50vh] items-center justify-center rounded-sm border border-border-light bg-white shadow-card">
      <div className="text-center">
        <h1 className="font-heading text-3xl text-text-primary">{title}</h1>
        <p className="mt-2 text-sm text-text-muted">Content coming soon</p>
      </div>
    </div>
  )
}

export default App
