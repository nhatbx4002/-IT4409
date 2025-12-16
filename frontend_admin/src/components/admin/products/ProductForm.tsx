import { useRef, useState } from 'react'
import { cn } from '../../../utils/cn'

const mockCategories = ['Dresses', 'Outerwear', 'Suits', 'Accessories']
const mockVariants = {
  sizes: ['XS', 'S', 'M', 'L', 'XL'],
  colors: ['Ivory', 'Charcoal', 'Sand', 'Olive'],
}

export function ProductForm() {
  const [name, setName] = useState('')
  const [category, setCategory] = useState('Dresses')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('')
  const [images, setImages] = useState<string[]>([])
  const [activeSizes, setActiveSizes] = useState<string[]>(['M'])
  const [activeColors, setActiveColors] = useState<string[]>(['Charcoal'])
  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFiles = (files: FileList | null) => {
    if (!files) return
    const next = Array.from(files).map((f) => URL.createObjectURL(f))
    setImages((prev) => [...prev, ...next])
  }

  const toggleVariant = (value: string, current: string[], setter: (v: string[]) => void) => {
    if (current.includes(value)) {
      setter(current.filter((v) => v !== value))
    } else {
      setter([...current, value])
    }
  }

  return (
    <section className="rounded-[32px] bg-bg-card p-6 shadow-float">
      <div className="flex flex-col gap-8 lg:flex-row">
        <div className="flex-1 space-y-6">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Product title"
            className="w-full bg-transparent font-heading text-4xl text-text-primary placeholder:text-text-secondary focus:outline-none"
          />

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.25em] text-text-secondary">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-transparent text-lg text-text-primary focus:outline-none"
              >
                {mockCategories.map((cat) => (
                  <option key={cat} value={cat} className="bg-bg-card">
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs uppercase tracking-[0.25em] text-text-secondary">Price</label>
              <input
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="$0.00"
                className="w-full bg-transparent text-lg text-text-primary placeholder:text-text-secondary focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs uppercase tracking-[0.25em] text-text-secondary">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the piece, the fabric, the story..."
              rows={4}
              className="w-full bg-transparent text-base text-text-primary placeholder:text-text-secondary focus:outline-none"
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-text-secondary">Imagery</p>
                <p className="font-heading text-xl text-text-primary">Mood & Fit</p>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="rounded-full border border-accent px-4 py-2 text-sm text-text-primary transition-all duration-500 hover:-translate-y-0.5 hover:bg-accent hover:text-bg-card"
              >
                Upload
              </button>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={(e) => handleFiles(e.target.files)}
              />
            </div>
            <div
              className="flex h-48 items-center justify-center rounded-2xl border border-dashed border-accent/60 bg-bg-body/70 text-text-secondary"
              onClick={() => fileInputRef.current?.click()}
            >
              Drop images here or click to upload
            </div>
            {images.length > 0 && (
              <div className="columns-2 gap-3 md:columns-3">
                {images.map((img) => (
                  <div key={img} className="mb-3 overflow-hidden rounded-xl shadow-float">
                    <img src={img} alt="Uploaded" className="w-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <aside className="w-full max-w-sm space-y-6 rounded-3xl bg-white/80 p-5 shadow-float lg:ml-6">
          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.25em] text-text-secondary">Variants</p>
            <div className="space-y-2">
              <p className="text-sm text-text-secondary">Sizes</p>
              <div className="flex flex-wrap gap-2">
                {mockVariants.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => toggleVariant(size, activeSizes, setActiveSizes)}
                    className={cn(
                      'rounded-full border border-border-soft px-4 py-2 text-sm transition-all duration-300',
                      activeSizes.includes(size)
                        ? 'bg-text-primary text-bg-card shadow-float'
                        : 'bg-white text-text-primary hover:border-text-primary/40'
                    )}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-sm text-text-secondary">Colors</p>
              <div className="flex flex-wrap gap-2">
                {mockVariants.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => toggleVariant(color, activeColors, setActiveColors)}
                    className={cn(
                      'rounded-full border border-border-soft px-4 py-2 text-sm transition-all duration-300',
                      activeColors.includes(color)
                        ? 'bg-text-primary text-bg-card shadow-float'
                        : 'bg-white text-text-primary hover:border-text-primary/40'
                    )}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <p className="text-xs uppercase tracking-[0.25em] text-text-secondary">Publishing</p>
            <div className="rounded-2xl border border-border-soft/70 bg-white p-4 shadow-float">
              <p className="font-heading text-lg text-text-primary">Visibility</p>
              <p className="text-sm text-text-secondary">Draft until you publish.</p>
              <div className="mt-4 flex gap-3">
                <button className="flex-1 rounded-full border border-text-primary px-4 py-2 text-sm text-text-primary transition-all duration-500 hover:bg-text-primary hover:text-bg-card">
                  Save Draft
                </button>
                <button className="flex-1 rounded-full bg-text-primary px-4 py-2 text-sm text-bg-card transition-all duration-500 hover:-translate-y-0.5 hover:shadow-float">
                  Publish
                </button>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </section>
  )
}
