export const CATEGORY_OPTIONS = [
  { label: 'Áo Khoác', slug: 'ao-khoac' },
  { label: 'Áo Polo', slug: 'ao-polo' },
  { label: 'Áo Sơ Mi', slug: 'ao-so-mi' },
  { label: 'Áo Tanktop', slug: 'ao-tanktop' },
  { label: 'Áo Thun', slug: 'ao-thun' },
  { label: 'Nước Hoa', slug: 'nuoc-hoa' },
  { label: 'Quần Âu', slug: 'quan-au' },
  { label: 'Quần Cropped', slug: 'quan-cropped' },
  { label: 'Quần Jeans', slug: 'quan-jeans' },
  { label: 'Quần Kaki', slug: 'quan-kaki' },
  { label: 'Quần Regular Fit', slug: 'quan-regular-fit' },
  { label: 'Quần Slim Fit', slug: 'quan-slim-fit' },
] as const;

export const BRAND_OPTIONS = [
  'Aristino',
  'Aristino Business',
  'Aristino Golf',
] as const;

export const COLOR_OPTIONS = [
  { name: 'Trắng', hex: '#FFFFFF' },
  { name: 'Đỏ', hex: '#EB5757' },
  { name: 'Xanh', hex: '#027A4A' },
  { name: 'Nâu', hex: '#461702' },
  { name: 'Xanh Mint', hex: '#D5E5D8' },
  { name: 'Be', hex: '#DCD5C3' },
  { name: 'Đen', hex: '#4B4849' },
  { name: 'Xám', hex: '#A4A4A4' },
] as const;

export const PRICE_RANGE: [number, number] = [100000, 20000000];
export const PRICE_STEP = 50000;

