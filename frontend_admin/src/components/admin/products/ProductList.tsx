type Status = 'active' | 'draft'

type Product = {
  id: string
  name: string
  sku: string
  category: string
  status: Status
  price: string
  stock: number
  image: string
}

const products: Product[] = [
  {
    id: 'p1',
    name: 'Atelier Silk Dress',
    sku: 'ARS-9821',
    category: 'Dresses',
    status: 'active',
    price: '$1,280',
    stock: 76,
    image:
      'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=480&q=80',
  },
  {
    id: 'p2',
    name: 'Noir Tailored Suit',
    sku: 'ARS-4412',
    category: 'Suits',
    status: 'draft',
    price: '$3,120',
    stock: 28,
    image:
      'https://images.unsplash.com/photo-1496747611180-206a5c8c46c8?auto=format&fit=crop&w=480&q=80',
  },
  {
    id: 'p3',
    name: 'Pearl Collar Coat',
    sku: 'ARS-6730',
    category: 'Outerwear',
    status: 'active',
    price: '$2,980',
    stock: 52,
    image:
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=480&q=80',
  },
  {
    id: 'p4',
    name: 'Velvet Evening Gown',
    sku: 'ARS-5588',
    category: 'Evening',
    status: 'active',
    price: '$4,260',
    stock: 18,
    image:
      'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=480&q=80',
  },
]

export function ProductList() {
  return (
    <section className="rounded-sm border border-border-light bg-white p-6 shadow-card md:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="font-heading text-2xl text-text-primary">Product Inventory</h2>
        <div className="flex flex-wrap items-center gap-3">
          <button className="rounded-sm border border-border-light bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.12em] text-text-primary transition-colors duration-150 hover:bg-bg-surface">
            Export
          </button>
          <button className="rounded-sm border border-brand-gold bg-brand-gold px-4 py-2 text-xs font-bold uppercase tracking-[0.14em] text-brand-black transition-colors duration-150 hover:border-brand-gold-hover hover:bg-brand-gold-hover">
            Add Product
          </button>
        </div>
      </div>

      <div className="mb-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-1 items-center gap-3">
          <div className="w-full md:w-1/2">
            <input
              type="text"
              placeholder="Search products..."
              className="w-full rounded-sm border border-border-light bg-white px-3 py-2 text-sm text-text-primary placeholder:text-text-muted focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/40"
            />
          </div>
          <div className="w-full md:w-1/3">
            <select className="w-full rounded-sm border border-border-light bg-white px-3 py-2 text-sm text-text-primary focus:border-brand-gold focus:outline-none focus:ring-2 focus:ring-brand-gold/40">
              <option>All Categories</option>
              <option>Dresses</option>
              <option>Suits</option>
              <option>Outerwear</option>
              <option>Evening</option>
            </select>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-[#F9F9F9] text-left text-[11px] font-bold uppercase tracking-[0.22em] text-text-muted">
              <th className="px-4 py-3">Product</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Price</th>
              <th className="px-4 py-3">Inventory</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="h-24 border-b border-border-light bg-white align-middle transition-colors duration-150 hover:bg-[#fafafa]"
              >
                <td className="px-4 py-4">
                  <div className="flex items-center gap-4">
                    <div className="h-20 w-[60px] overflow-hidden rounded-sm bg-border-light">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-heading text-lg font-semibold text-text-primary">
                        {product.name}
                      </span>
                      <span className="font-mono text-xs text-text-muted">{product.sku}</span>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4">
                  <span className="rounded-sm bg-bg-surface px-2 py-1 text-xs font-semibold text-text-primary">
                    {product.category}
                  </span>
                </td>
                <td className="px-4 py-4 text-sm font-semibold text-text-primary">
                  {product.price}
                </td>
                <td className="px-4 py-4 min-w-[180px]">
                  <StockBar value={product.stock} />
                </td>
                <td className="px-4 py-4 text-sm font-semibold">
                  <StatusText status={product.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex justify-end gap-2">
        <PaginationButton label="1" active />
        <PaginationButton label="2" />
        <PaginationButton label="3" />
      </div>
    </section>
  )
}

function StockBar({ value }: { value: number }) {
  const isLow = value < 40
  return (
    <div className="w-full rounded-sm bg-[#f0f0f0]">
      <div
        className={`h-2 rounded-sm ${isLow ? 'bg-brand-gold' : 'bg-brand-black'}`}
        style={{ width: `${Math.min(value, 100)}%` }}
      />
      <div className="mt-1 text-xs text-[#7a7a7a]">{value}% in stock</div>
    </div>
  )
}

function StatusText({ status }: { status: Status }) {
  const isActive = status === 'active'
  return (
    <span className={isActive ? 'text-emerald-600' : 'text-text-muted'}>
      {isActive ? 'Active' : 'Draft'}
    </span>
  )
}

function PaginationButton({ label, active }: { label: string; active?: boolean }) {
  return (
    <button
      type="button"
      className={`h-9 w-9 rounded-sm border text-sm font-semibold transition-colors duration-150 ${
        active
          ? 'border-brand-black bg-brand-black text-white'
          : 'border-border-light bg-white text-text-primary hover:bg-bg-surface'
      }`}
    >
      {label}
    </button>
  )
}
