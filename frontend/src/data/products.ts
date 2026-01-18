import type { Product } from "@/types/products";

export const products: Product[] = [
  {
    id: "1",
    name: "Premium Oxford Dress Shirt",
    brand: "ARISTINO",
    category: "Shirts",
    price: 189,
    images: [
      "https://images.unsplash.com/photo-1590588460172-2e7f65714644?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtZW5zJTIwZHJlc3MlMjBzaGlydHxlbnwxfHx8fDE3NjE1NjgzNTV8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1623609163865-75c5e51beb43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtZW5zJTIwZm9ybWFsJTIwc2hpcnR8ZW58MXx8fHwxNzYxNTY4MzU1fDA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Light Blue", hex: "#ADD8E6" },
      { name: "Navy", hex: "#000080" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    rating: 4.8,
    reviewCount: 124,
    isNew: true,
    inStock: true
  },
  {
    id: "2",
    name: "Classic Fit Formal Shirt",
    brand: "ARISTINO",
    category: "Shirts",
    price: 165,
    images: [
      "https://images.unsplash.com/photo-1623609163865-75c5e51beb43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtZW5zJTIwZm9ybWFsJTIwc2hpcnR8ZW58MXx8fHwxNzYxNTY4MzU1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1590588460172-2e7f65714644?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtZW5zJTIwZHJlc3MlMjBzaGlydHxlbnwxfHx8fDE3NjE1NjgzNTV8MA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    colors: [
      { name: "White", hex: "#FFFFFF" },
      { name: "Cream", hex: "#FFFDD0" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    rating: 4.6,
    reviewCount: 89,
    isNew: false,
    inStock: true
  },
  {
    id: "3",
    name: "Casual Linen Shirt",
    brand: "ARISTINO",
    category: "Shirts",
    price: 145,
    salePrice: 109,
    images: [
      "https://images.unsplash.com/photo-1743530253401-2e706c253121?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtZW5zJTIwY2FzdWFsJTIwc2hpcnR8ZW58MXx8fHwxNzYxNTY4MzU1fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1644860588182-0998b4ef5587?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtZW5zJTIwbGluZW4lMjBzaGlydHxlbnwxfHx8fDE3NjE1NjgzNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    colors: [
      { name: "Beige", hex: "#F5F5DC" },
      { name: "Light Gray", hex: "#D3D3D3" },
      { name: "Olive", hex: "#808000" }
    ],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.7,
    reviewCount: 156,
    isNew: true,
    inStock: true
  },
  {
    id: "4",
    name: "Slim Fit Oxford Shirt",
    brand: "ARISTINO",
    category: "Shirts",
    price: 175,
    images: [
      "https://images.unsplash.com/photo-1738651875561-2f81f962338c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtZW5zJTIwb3hmb3JkJTIwc2hpcnR8ZW58MXx8fHwxNzYxNTY4MzU2fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1590588460172-2e7f65714644?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtZW5zJTIwZHJlc3MlMjBzaGlydHxlbnwxfHx8fDE3NjE1NjgzNTV8MA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    colors: [
      { name: "Light Blue", hex: "#ADD8E6" },
      { name: "Pink", hex: "#FFB6C1" },
      { name: "White", hex: "#FFFFFF" }
    ],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.9,
    reviewCount: 203,
    isNew: false,
    inStock: true
  },
  {
    id: "5",
    name: "Premium Linen Blend Shirt",
    brand: "ARISTINO",
    category: "Shirts",
    price: 195,
    images: [
      "https://images.unsplash.com/photo-1644860588182-0998b4ef5587?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtZW5zJTIwbGluZW4lMjBzaGlydHxlbnwxfHx8fDE3NjE1NjgzNTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1743530253401-2e706c253121?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtZW5zJTIwY2FzdWFsJTIwc2hpcnR8ZW58MXx8fHwxNzYxNTY4MzU1fDA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    colors: [
      { name: "Natural", hex: "#F5F5DC" },
      { name: "Sage", hex: "#9CAF88" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    rating: 4.5,
    reviewCount: 67,
    isNew: true,
    inStock: true
  },
  {
    id: "6",
    name: "Luxury Polo Shirt",
    brand: "ARISTINO",
    category: "Shirts",
    price: 135,
    salePrice: 95,
    images: [
      "https://images.unsplash.com/photo-1744551358329-d14e62a178a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtZW5zJTIwcG9sbyUyMHNoaXJ0fGVufDF8fHx8MTc2MTU2ODM1N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1590588460172-2e7f65714644?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtZW5zJTIwZHJlc3MlMjBzaGlydHxlbnwxfHx8fDE3NjE1NjgzNTV8MA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    colors: [
      { name: "Navy", hex: "#000080" },
      { name: "Black", hex: "#000000" },
      { name: "White", hex: "#FFFFFF" },
      { name: "Gray", hex: "#808080" }
    ],
    sizes: ["S", "M", "L", "XL", "XXL"],
    rating: 4.4,
    reviewCount: 145,
    isNew: false,
    inStock: true
  },
  {
    id: "7",
    name: "Striped Dress Shirt",
    brand: "ARISTINO",
    category: "Shirts",
    price: 159,
    images: [
      "https://images.unsplash.com/photo-1588713562374-a3f2a0a5af33?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtZW5zJTIwc3RyaXBlZCUyMHNoaXJ0fGVufDF8fHx8MTc2MTU2ODM1N3ww&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1623609163865-75c5e51beb43?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtZW5zJTIwZm9ybWFsJTIwc2hpcnR8ZW58MXx8fHwxNzYxNTY4MzU1fDA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    colors: [
      { name: "Blue Stripe", hex: "#4169E1" },
      { name: "Gray Stripe", hex: "#696969" }
    ],
    sizes: ["M", "L", "XL", "XXL"],
    rating: 4.6,
    reviewCount: 92,
    isNew: false,
    inStock: true
  },
  {
    id: "8",
    name: "Checkered Casual Shirt",
    brand: "ARISTINO",
    category: "Shirts",
    price: 149,
    images: [
      "https://images.unsplash.com/photo-1585588598468-13d32d65d069?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtZW5zJTIwY2hlY2tlcmVkJTIwc2hpcnR8ZW58MXx8fHwxNzYxNTY4MzU3fDA&ixlib=rb-4.1.0&q=80&w=1080",
      "https://images.unsplash.com/photo-1743530253401-2e706c253121?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsdXh1cnklMjBtZW5zJTIwY2FzdWFsJTIwc2hpcnR8ZW58MXx8fHwxNzYxNTY4MzU1fDA&ixlib=rb-4.1.0&q=80&w=1080"
    ],
    colors: [
      { name: "Navy Check", hex: "#000080" },
      { name: "Red Check", hex: "#8B0000" }
    ],
    sizes: ["S", "M", "L", "XL"],
    rating: 4.7,
    reviewCount: 118,
    isNew: true,
    inStock: true
  }
];

// Duplicate products for a fuller catalog (48 products as specified)
export const allProducts: Product[] = [
  ...products,
  ...products.map((p, idx) => ({ ...p, id: `${p.id}-${idx + 8}`, isNew: false })),
  ...products.map((p, idx) => ({ ...p, id: `${p.id}-${idx + 16}`, isNew: idx % 3 === 0 })),
  ...products.map((p, idx) => ({ ...p, id: `${p.id}-${idx + 24}`, isNew: false })),
  ...products.map((p, idx) => ({ ...p, id: `${p.id}-${idx + 32}`, isNew: idx % 4 === 0 })),
  ...products.map((p, idx) => ({ ...p, id: `${p.id}-${idx + 40}`, isNew: false }))
];
