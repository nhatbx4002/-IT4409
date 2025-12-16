import { useNavigate } from 'react-router-dom'

type OrderStatus = 'Paid' | 'Pending' | 'Cancelled'

type Order = {
  id: string
  customer: {
    name: string
    avatar: string
  }
  date: string
  total: string
  status: OrderStatus
}

const stats = [
  { label: 'Total Orders', value: '1,284' },
  { label: 'Pending', value: '42' },
  { label: 'Returns', value: '12' },
]

const orders: Order[] = [
  {
    id: '#ORD-7782',
    customer: {
      name: 'Evelyn Hart',
      avatar: 'https://images.unsplash.com/photo-1502685104226-ee32379fefbe?auto=format&fit=crop&w=80&q=80',
    },
    date: 'Dec 12, 2025',
    total: '$2,450',
    status: 'Paid',
  },
  {
    id: '#ORD-7781',
    customer: {
      name: 'Daniel Cho',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
    },
    date: 'Dec 11, 2025',
    total: '$3,120',
    status: 'Pending',
  },
  {
    id: '#ORD-7775',
    customer: {
      name: 'Lucia Moretti',
      avatar: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=80&q=80',
    },
    date: 'Dec 10, 2025',
    total: '$2,980',
    status: 'Paid',
  },
  {
    id: '#ORD-7769',
    customer: {
      name: 'Sophia Nguyen',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&q=80',
    },
    date: 'Dec 9, 2025',
    total: '$4,260',
    status: 'Cancelled',
  },
]

export function OrderList() {
  const navigate = useNavigate()

  return (
    <div className="space-y-6">
      <div className="grid gap-3 sm:grid-cols-3">
        {stats.map((item) => (
          <div
            key={item.label}
            className="rounded-sm border border-border-light bg-white px-4 py-3 shadow-card"
          >
            <p className="text-xs uppercase tracking-[0.18em] text-text-muted">{item.label}</p>
            <p className="mt-2 text-xl font-semibold text-text-primary">{item.value}</p>
          </div>
        ))}
      </div>

      <div className="overflow-x-auto rounded-sm border border-border-light bg-white shadow-card">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-[#F9F9F9] text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-text-muted">
              <th className="px-5 py-3">Order ID</th>
              <th className="px-5 py-3">Customer</th>
              <th className="px-5 py-3">Date</th>
              <th className="px-5 py-3">Total</th>
              <th className="px-5 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr
                key={order.id}
                className="h-20 cursor-pointer border-t border-border-light transition-colors duration-150 hover:bg-[#fafafa]"
                onClick={() => navigate(`/admin/orders/${order.id.replace('#', '')}`)}
              >
                <td className="px-5 py-3 font-mono text-sm text-text-muted">{order.id}</td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 overflow-hidden rounded-full bg-border-light">
                      <img src={order.customer.avatar} alt={order.customer.name} className="h-full w-full object-cover" />
                    </div>
                    <span className="text-sm font-semibold text-text-primary">{order.customer.name}</span>
                  </div>
                </td>
                <td className="px-5 py-3 text-sm text-text-primary">{order.date}</td>
                <td className="px-5 py-3 text-lg font-heading text-text-primary">{order.total}</td>
                <td className="px-5 py-3">
                  <StatusBadge status={order.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: OrderStatus }) {
  if (status === 'Paid') {
    return (
      <span className="inline-flex rounded-sm bg-brand-black px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-brand-gold">
        Paid
      </span>
    )
  }

  if (status === 'Pending') {
    return (
      <span className="inline-flex rounded-sm bg-[#e5e7eb] px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-text-primary">
        Pending
      </span>
    )
  }

  return (
    <span className="inline-flex rounded-sm border border-red-500 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-red-600">
      Cancelled
    </span>
  )
}
