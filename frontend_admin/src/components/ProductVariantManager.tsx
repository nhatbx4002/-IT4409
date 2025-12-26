import React from 'react';
import { Plus, X } from 'lucide-react';
import type { ProductVariant, CreateVariantPayload } from '../lib/products';

export type ProductVariantManagerProps = {
  variants: ProductVariant[];
  onAddVariant: (variant: CreateVariantPayload & { image?: File }) => Promise<void>;
  onRemoveVariant: (index: number) => void;
  productId?: number;
  productSlug?: string;
  productName?: string;
  formatCurrency: (value: number | string | null | undefined) => string;
  disabled?: boolean;
};

export function ProductVariantManager({
  variants,
  onAddVariant,
  onRemoveVariant,
  productSlug,
  productName,
  formatCurrency,
  disabled = false,
}: ProductVariantManagerProps) {
  const [showForm, setShowForm] = React.useState(false);
  const [form, setForm] = React.useState({
    color: '',
    size: '',
    sku: '',
    stock_quantity: '',
  });
  const [image, setImage] = React.useState<File | null>(null);
  const [imagePreview, setImagePreview] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);

  // Helper: Generate slug from product name
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Helper: Generate SKU from product slug and variant properties
  const generateVariantSKU = (color: string, size: string): string => {
    const slug = productSlug || (productName ? generateSlug(productName) : 'product');
    const parts = [slug];

    if (color) {
      parts.push(color.toLowerCase().replace(/\s+/g, '-'));
    }
    if (size) {
      parts.push(size.toLowerCase().replace(/\s+/g, '-'));
    }

    return parts.join('-');
  };

  // Cleanup image preview
  React.useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview]);

  const handleAdd = () => {
    setShowForm(true);
    setForm({ color: '', size: '', sku: '', stock_quantity: '' });
    setImage(null);
    setImagePreview('');
  };

  const handleCancel = () => {
    setShowForm(false);
    setForm({ color: '', size: '', sku: '', stock_quantity: '' });
    setImage(null);
    setImagePreview('');
  };

  const handleSave = async () => {
    setSubmitting(true);
    try {
      await onAddVariant({
        color: form.color || null,
        size: form.size || null,
        sku: form.sku || null,
        stock_quantity: Number(form.stock_quantity),
        image_url: image || null,
      });
      handleCancel();
    } catch (err) {
      // Error handling is done by parent
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  return (
    <div className="space-y-3 border-t border-gray-200 pt-4">
      <div className="flex items-center justify-between">
        <label className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Product Variants
        </label>
        <button
          type="button"
          onClick={handleAdd}
          disabled={disabled}
          className="text-xs bg-[#C6A87C] hover:bg-[#B08D55] text-white px-3 py-1.5 rounded-lg font-medium flex items-center gap-1 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus className="w-3 h-3" />
          Add Variant
        </button>
      </div>

      {/* Variant Form */}
      {showForm && (
        <div className="bg-gray-50 rounded-lg p-4 space-y-3 border border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Color</label>
              <input
                type="text"
                value={form.color}
                onChange={(e) => {
                  const newColor = e.target.value;
                  const newSKU = generateVariantSKU(newColor, form.size);
                  setForm({ ...form, color: newColor, sku: newSKU });
                }}
                placeholder="e.g., Red, Blue"
                disabled={submitting}
                className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-[#C6A87C] focus:border-[#C6A87C] disabled:opacity-50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Size</label>
              <input
                type="text"
                value={form.size}
                onChange={(e) => {
                  const newSize = e.target.value;
                  const newSKU = generateVariantSKU(form.color, newSize);
                  setForm({ ...form, size: newSize, sku: newSKU });
                }}
                placeholder="e.g., S, M, L, XL"
                disabled={submitting}
                className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-[#C6A87C] focus:border-[#C6A87C] disabled:opacity-50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">SKU (Auto-generated)</label>
              <input
                type="text"
                value={form.sku}
                onChange={(e) => setForm({ ...form, sku: e.target.value })}
                placeholder="Auto-generated from color & size"
                disabled={submitting}
                className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-[#C6A87C] focus:border-[#C6A87C] disabled:opacity-50 bg-gray-50"
              />
              <p className="text-[9px] text-gray-400">Format: {productSlug || productName ? generateSlug(productName || '') : 'product-slug'}-color-size</p>
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Stock *</label>
              <input
                type="number"
                value={form.stock_quantity}
                onChange={(e) => setForm({ ...form, stock_quantity: e.target.value })}
                placeholder="0"
                required
                disabled={submitting}
                className="w-full border border-gray-200 rounded px-2 py-1.5 text-sm focus:ring-1 focus:ring-[#C6A87C] focus:border-[#C6A87C] disabled:opacity-50"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                disabled={submitting}
                className="w-full text-xs disabled:opacity-50"
              />
            </div>
          </div>

          {/* Variant Image Preview */}
          {imagePreview && (
            <div className="flex items-center gap-3 p-2 bg-white rounded border border-gray-200">
              <img
                src={imagePreview}
                alt="Variant preview"
                className="w-12 h-12 object-cover rounded"
              />
              <span className="text-xs text-gray-600 truncate flex-1">{image?.name || 'Variant image'}</span>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={handleCancel}
              disabled={submitting}
              className="px-3 py-1.5 text-xs font-semibold text-gray-600 hover:text-gray-800 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={submitting}
              className="bg-[#0A0A0A] text-[#C6A87C] px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-[#2A2A2A] transition-colors disabled:opacity-50"
            >
              {submitting ? 'Saving...' : 'Save Variant'}
            </button>
          </div>
        </div>
      )}

      {/* Variants List */}
      {variants.length > 0 && !showForm && (
        <div className="space-y-2">
          <div className="max-h-64 overflow-y-auto pr-1 space-y-2 custom-scrollbar">
            {variants.map((variant, index) => (
              <div
                key={variant.id}
                className="flex items-center gap-3 p-3 bg-white border border-gray-200 rounded-lg hover:border-[#C6A87C] transition-colors"
              >
                {variant.image_url && (
                  <img
                    src={typeof variant.image_url === 'string' ? variant.image_url : URL.createObjectURL(variant.image_url as any)}
                    alt={`Variant ${index + 1}`}
                    className="w-10 h-10 object-cover rounded border border-gray-200 flex-shrink-0"
                  />
                )}
                <div className="flex-1 min-w-0 grid grid-cols-4 gap-2 text-xs">
                  <div>
                    <span className="text-gray-400">Color:</span>
                    <span className="ml-1 font-medium">{variant.color || '—'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Size:</span>
                    <span className="ml-1 font-medium">{variant.size || '—'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">SKU:</span>
                    <span className="ml-1 font-medium">{variant.sku || '—'}</span>
                  </div>
                  <div>
                    <span className="text-gray-400">Stock:</span>
                    <span className="ml-1 font-medium">{variant.stock_quantity ?? 0}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => onRemoveVariant(index)}
                  disabled={disabled}
                  className="text-red-500 hover:text-red-700 p-1 flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Remove variant"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          {variants.length > 3 && (
            <p className="text-xs text-gray-400 italic text-center">
              Scroll to see all {variants.length} variants
            </p>
          )}
        </div>
      )}

      {variants.length === 0 && !showForm && (
        <p className="text-xs text-gray-400 italic">No variants added yet. Click "Add Variant" to create product variants.</p>
      )}
    </div>
  );
}
