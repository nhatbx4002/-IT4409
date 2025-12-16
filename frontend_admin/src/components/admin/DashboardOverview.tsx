import { ArrowDownRight, ArrowUpRight } from 'lucide-react'

type Kpi = {
  label: string
  value: string
  trend: string
  positive: boolean
}

type Order = {
  product: string
  customer: string
  date: string
  amount: string
  status: 'Completed' | 'Pending' | 'Refunded'
  image: string
}

const kpis: Kpi[] = [
  { label: 'Total Revenue', value: '$182K', trend: '+12.4%', positive: true },
  { label: 'Orders', value: '1,284', trend: '+3.1%', positive: true },
  { label: 'New Clients', value: '246', trend: '-2.5%', positive: false },
  { label: 'Retention', value: '82%', trend: '+1.9%', positive: true },
]

const orders: Order[] = [
  {
    product: 'Silk Atelier Trench',
    customer: 'Evelyn Hart',
    date: 'Dec 12, 2025',
    amount: '$2,450',
    status: 'Completed',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=320&q=80',
  },
  {
    product: 'Noir Tailored Suit',
    customer: 'Daniel Cho',
    date: 'Dec 11, 2025',
    amount: '$3,120',
    status: 'Pending',
    image:
      'https://images.unsplash.com/photo-1496747611180-206a5c8c46c8?auto=format&fit=crop&w=320&q=80',
  },
  {
    product: 'Pearl Collar Coat',
    customer: 'Lucia Moretti',
    date: 'Dec 10, 2025',
    amount: '$2,980',
    status: 'Completed',
    image:
      'https://images.unsplash.com/photo-1496747611180-206a5c8c46c8?auto=format&fit=crop&w=320&q=80&sat=-50',
  },
  {
    product: 'Velvet Evening Gown',
    customer: 'Sophia Nguyen',
    date: 'Dec 9, 2025',
    amount: '$4,260',
    status: 'Refunded',
    image:
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=320&q=80',
  },
]

export function DashboardOverview() {
  return (
    <div className="space-y-10">
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <KpiCard key={kpi.label} kpi={kpi} />
        ))}
      </div>

      <section className="overflow-hidden rounded-sm border border-border-light bg-white shadow-card">
        <div className="flex flex-col items-start justify-between gap-4 border-b border-border-light px-6 py-5 sm:flex-row sm:items-center">
          <div>
            <h2 className="font-heading text-2xl text-text-primary">Recent Transactions</h2>
            <p className="text-sm text-[#7a7a7a]">Latest high-value orders from the atelier</p>
          </div>
          <button className="inline-flex items-center justify-center rounded-sm border border-brand-gold bg-brand-gold px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-brand-black transition-colors duration-150 hover:border-brand-gold-hover hover:bg-brand-gold-hover">
            Export Report
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead>
              <tr className="bg-[#F9F9F9]">
                {['Product', 'Customer', 'Date', 'Amount', 'Status'].map((col) => (
                  <th
                    key={col}
                    className="px-5 py-4 text-left text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7a7a7a]"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order.product} className="border-b border-border-light bg-white">
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="h-16 w-12 overflow-hidden rounded-sm bg-border-light">
                        <div className="relative h-full w-full">
                          <div className="aspect-[3/4] w-full">
                            <img
                              src={order.image}
                              alt={order.product}
                              className="h-full w-full object-cover"
                            />
                          </div>
                        </div>
                      </div>
                      <div>
                        <p className="font-heading text-base text-text-primary">{order.product}</p>
                        <p className="text-xs text-[#7a7a7a]">3:4 aspect</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 text-sm text-text-primary">{order.customer}</td>
                  <td className="px-5 py-4 text-sm text-text-primary">{order.date}</td>
                  <td className="px-5 py-4 text-sm font-semibold text-text-primary">
                    {order.amount}
                  </td>
                  <td className="px-5 py-4">
                    <StatusBadge status={order.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

function KpiCard({ kpi }: { kpi: Kpi }) {
  return (
    <div className="relative overflow-hidden rounded-sm border border-border-light bg-white shadow-card">
      <div className="h-[3px] w-full bg-brand-gold" />
      <div className="p-6">
        <p className="text-[11px] font-semibold uppercase tracking-[0.3em] text-[#8f8f8f]">
          {kpi.label}
        </p>
        <p className="mt-4 font-heading text-[2.8rem] leading-[1.05] text-text-primary">
          {kpi.value}
        </p>
        <div className="mt-3 inline-flex items-center gap-2 rounded-sm bg-[#f5f5f5] px-3 py-1 text-xs font-semibold text-text-primary">
          {kpi.positive ? (
            <ArrowUpRight size={16} className="text-green-600" />
          ) : (
            <ArrowDownRight size={16} className="text-red-600" />
          )}
          <span className={kpi.positive ? 'text-green-700' : 'text-red-600'}>{kpi.trend}</span>
        </div>
      </div>
    </div>
  )
}

function StatusBadge({ status }: { status: Order['status'] }) {
  const text = status.toUpperCase()

  return (
    <span className="inline-flex items-center rounded-sm bg-brand-black px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-gold">
      {text}
    </span>
  )
}
