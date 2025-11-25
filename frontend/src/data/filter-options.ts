import { CATEGORY_LABEL_MAP } from '@/theme/constants';

export const CATEGORY_OPTIONS = [
  { label: CATEGORY_LABEL_MAP['shirts'], slug: 'shirts' },
  { label: CATEGORY_LABEL_MAP['pants'], slug: 'pants' },
  { label: CATEGORY_LABEL_MAP['suits'], slug: 'suits' },
  { label: CATEGORY_LABEL_MAP['shoes'], slug: 'shoes' },
  { label: CATEGORY_LABEL_MAP['dresses'], slug: 'dresses' },
  { label: CATEGORY_LABEL_MAP['blouses'], slug: 'blouses' },
  { label: CATEGORY_LABEL_MAP['bags'], slug: 'bags' },
  { label: CATEGORY_LABEL_MAP['watches'], slug: 'watches' },
] as const;

export const BRAND_OPTIONS = [
  'Elegance',
  'Urban Style',
  'Professional',
  'Modern Fit',
  'Adventure',
  'Premium Tailor',
  'Luxury',
  'Classic Footwear',
  'Fashion Forward',
  'Summer Collection',
  'Everyday',
  'Denim Co',
  'Timepiece',
  'Active',
] as const;

export const COLOR_OPTIONS = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Navy', hex: '#000080' },
  { name: 'Gray', hex: '#808080' },
  { name: 'Brown', hex: '#8B4513' },
  { name: 'Beige', hex: '#F5F5DC' },
  { name: 'Red', hex: '#B22222' },
  { name: 'Blue', hex: '#1E90FF' },
] as const;

