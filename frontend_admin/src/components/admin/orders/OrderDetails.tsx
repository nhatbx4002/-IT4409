import { Check, Circle, Printer, RefreshCw } from 'lucide-react'

const steps = ['Placed', 'Paid', 'Shipped', 'Delivered']
const currentStep = 'Shipped'

const items = [
  {
    name: 'Noir Tailored Suit',
    qty: 1,
    price: '$3,120',
    image:
      'https://images.unsplash.com/photo-1496747611180-206a5c8c46c8?auto=format&fit=crop&w=320&q=80',
  },
  {
    name: 'Silk Atelier Trench',
    qty: 2,
    price: '$4,900',
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=320&q=80',
  },
  {
    name: 'Velvet Evening Gown',
    qty: 1,
    price: '$4,260',
    image:
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=320&q=80',
  },
]

export function OrderDetails() {
  const activeIndex = steps.indexOf(currentStep)

  return (
    <div className="flex justify-center bg-bg-surface px-4 py-10">
      <article className="relative w-full max-w-3xl overflow-hidden rounded-sm border border-border-light bg-white px-6 py-10 shadow-card md:px-10">
        <div className="absolute right-6 top-6 flex gap-3">
          <button className="flex items-center gap-2 rounded-sm border border-border-light bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-text-primary transition-colors duration-150 hover:bg-bg-surface">
            <Printer size={16} />
            Print Invoice
          </button>
          <button className="flex items-center gap-2 rounded-sm border border-brand-gold bg-brand-gold px-3 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-brand-black transition-colors duration-150 hover:border-brand-gold-hover hover:bg-brand-gold-hover">
            <RefreshCw size={16} />
            Update Status
          </button>
        </div>

        <header className="flex flex-col items-center gap-2 text-center">
          <span className="font-heading text-3xl font-semibold uppercase tracking-[0.22em] text-brand-gold">
            ARISTINO
          </span>
          <p className="font-mono text-sm text-[#6b6b6b]">Order ID: #ORD-001</p>
        </header>

        <section className="mt-8">
          <div className="flex items-center justify-between gap-3">
            {steps.map((step, index) => {
              const active = index <= activeIndex
              return (
                <div key={step} className="flex flex-1 items-center gap-3">
                  <div
                    className={`flex h-9 w-9 items-center justify-center rounded-full border text-sm font-semibold ${
                      active
                        ? 'border-brand-gold bg-brand-gold text-brand-black'
                        : 'border-border-light bg-white text-[#8f8f8f]'
                    }`}
                  >
                    {active ? <Check size={16} /> : <Circle size={14} />}
                  </div>
                  <span
                    className={`text-sm font-semibold uppercase tracking-[0.16em] ${
                      active ? 'text-brand-black' : 'text-[#9a9a9a]'
                    }`}
                  >
                    {step}
                  </span>
                  {index < steps.length - 1 && (
                    <span
                      className={`h-[1px] flex-1 ${active ? 'bg-brand-gold' : 'bg-border-light'}`}
                    />
                  )}
                </div>
              )
            })}
          </div>
        </section>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          <div className="rounded-sm border border-border-light bg-white px-4 py-4">
            <h3 className="font-heading text-lg text-text-primary">Shipping Address</h3>
            <div className="mt-3 space-y-1 text-sm text-text-primary">
              <p>Alex Carter</p>
              <p>182 Nguyen Van Troi, Ward 8</p>
              <p>Phu Nhuan District, Ho Chi Minh City</p>
              <p>Phone: +84 912 345 678</p>
            </div>
          </div>
          <div className="rounded-sm border border-border-light bg-white px-4 py-4">
            <h3 className="font-heading text-lg text-text-primary">Billing Address</h3>
            <div className="mt-3 space-y-1 text-sm text-text-primary">
              <p>Alex Carter</p>
              <p>88 Le Lai, District 1</p>
              <p>Ho Chi Minh City, Vietnam</p>
              <p>Phone: +84 912 345 678</p>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="flex items-center justify-between border-b border-border-light pb-3">
            <h3 className="font-heading text-lg text-text-primary">Order Items</h3>
            <span className="text-xs uppercase tracking-[0.14em] text-[#8f8f8f]">
              {items.length} items
            </span>
          </div>
          <div className="divide-y divide-border-light">
            {items.map((item) => (
              <div key={item.name} className="flex items-center gap-4 py-4">
                <div className="h-16 w-12 overflow-hidden rounded-sm bg-border-light">
                  <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                </div>
                <div className="flex flex-1 flex-col">
                  <span className="font-heading text-base font-semibold text-text-primary">
                    {item.name}
                  </span>
                  <span className="text-sm text-[#7a7a7a]">Qty: {item.qty}</span>
                </div>
                <div className="text-sm font-semibold text-text-primary">{item.price}</div>
              </div>
            ))}
          </div>
        </section>

        <section className="mt-8 flex flex-col items-end gap-2 border-t border-border-light pt-6">
          <Row label="Subtotal" value="$12,280" />
          <Row label="Shipping" value="$40" />
          <Row label="Tax" value="$820" />
          <div className="mt-2 flex w-full justify-between text-lg font-semibold text-text-primary md:w-1/2">
            <span className="font-heading text-xl">Total</span>
            <span className="font-heading text-2xl text-brand-gold">$13,140</span>
          </div>
        </section>
      </article>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex w-full justify-between text-sm text-text-primary md:w-1/2">
      <span>{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  )
}
