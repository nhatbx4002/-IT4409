import {
  Area,
  AreaChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { ArrowUpRight } from 'lucide-react'

type Kpi = {
  title: string
  value: string
  trend: string
}

const kpis: Kpi[] = [
  { title: 'Total Revenue', value: '$128,400', trend: '+12.4%' },
  { title: 'Orders', value: '1,284', trend: '+3.1%' },
  { title: 'New Clients', value: '246', trend: '+5.2%' },
  { title: 'Retention', value: '82%', trend: '+1.9%' },
]

const revenue = [
  { month: 'Jan', value: 18 },
  { month: 'Feb', value: 24 },
  { month: 'Mar', value: 28 },
  { month: 'Apr', value: 33 },
  { month: 'May', value: 31 },
  { month: 'Jun', value: 37 },
  { month: 'Jul', value: 44 },
]

const bestSellers = [
  {
    name: 'Noir Tailored Suit',
    price: '$3,120',
    image:
      'https://images.unsplash.com/photo-1496747611180-206a5c8c46c8?auto=format&fit=crop&w=320&q=80',
  },
  {
    name: 'Silk Atelier Trench',
    price: '$2,450',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=320&q=80',
  },
  {
    name: 'Velvet Evening Gown',
    price: '$4,260',
    image:
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=320&q=80',
  },
]

export function Dashboard() {
  return (
    <div className="space-y-8">
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {kpis.map((kpi) => (
          <div
            key={kpi.title}
            className="relative overflow-hidden rounded-sm border border-border-light bg-white shadow-card"
          >
            <div className="h-[3px] w-full bg-brand-gold" />
            <div className="p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.22em] text-text-muted">
                {kpi.title}
              </p>
              <p className="mt-3 font-heading text-[2.5rem] leading-[1.05] text-text-primary">
                {kpi.value}
              </p>
              <div className="mt-2 inline-flex items-center gap-2 rounded-sm bg-[#f6f6f6] px-3 py-1 text-xs font-semibold text-emerald-700">
                <ArrowUpRight size={16} />
                <span>{kpi.trend}</span>
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <div className="rounded-sm border border-border-light bg-white p-6 shadow-card">
          <div className="flex items-center justify-between">
            <h2 className="font-heading text-2xl text-text-primary">Revenue Analytics</h2>
            <span className="text-xs uppercase tracking-[0.14em] text-text-muted">Last 7 months</span>
          </div>
          <div className="mt-6 h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenue}>
                <defs>
                  <linearGradient id="revGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#C5A065" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#C5A065" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="month"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#6b7280' }}
                  width={40}
                />
                <Tooltip content={<RevenueTooltip />} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#C5A065"
                  strokeWidth={2.4}
                  fill="url(#revGradient)"
                  dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-sm border border-border-light bg-white p-6 shadow-card">
          <h2 className="font-heading text-2xl text-text-primary">Best Sellers</h2>
          <div className="mt-4 divide-y divide-border-light">
            {bestSellers.map((product) => (
              <div key={product.name} className="flex items-center gap-4 py-4">
                <div className="h-20 w-[60px] overflow-hidden rounded-sm bg-border-light">
                  <div className="aspect-[3/4] w-full">
                    <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col">
                  <span className="font-heading text-lg text-text-primary">{product.name}</span>
                  <span className="font-semibold text-text-primary">{product.price}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}

function RevenueTooltip({ active, payload }: any) {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="rounded-sm border border-border-light bg-white px-3 py-2 text-sm text-text-primary shadow-card">
      <p className="font-heading text-base text-text-primary">{item.value}k</p>
      <p className="text-xs text-text-muted">{item.payload.month}</p>
    </div>
  )
}
