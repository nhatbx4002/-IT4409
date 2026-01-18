import React, { useState } from 'react';
import { Plus, Filter, ChevronLeft, ChevronRight } from 'lucide-react';

const products = [
  {
    id: 'PRD-001',
    name: 'Executive Navy Suit',
    sku: 'ARN-NS-2024-001',
    category: 'Suits',
    price: '₫12,500,000',
    stock: 45,
    maxStock: 100,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop',
  },
  {
    id: 'PRD-002',
    name: 'Silk Evening Gown',
    sku: 'ARN-EG-2024-002',
    category: 'Dresses',
    price: '₫8,900,000',
    stock: 12,
    maxStock: 50,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=400&h=500&fit=crop',
  },
  {
    id: 'PRD-003',
    name: 'Leather Oxford Shoes',
    sku: 'ARN-SH-2024-003',
    category: 'Shoes',
    price: '₫4,200,000',
    stock: 78,
    maxStock: 100,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=400&h=500&fit=crop',
  },
  {
    id: 'PRD-004',
    name: 'Cashmere Overcoat',
    sku: 'ARN-OC-2024-004',
    category: 'Outerwear',
    price: '₫15,800,000',
    stock: 8,
    maxStock: 30,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?w=400&h=500&fit=crop',
  },
  {
    id: 'PRD-005',
    name: 'Premium Cotton Shirt',
    sku: 'ARN-SH-2024-005',
    category: 'Shirts',
    price: '₫2,500,000',
    stock: 120,
    maxStock: 150,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1620012253295-c15cc3e65df4?w=400&h=500&fit=crop',
  },
  {
    id: 'PRD-006',
    name: 'Tailored Blazer',
    sku: 'ARN-BL-2024-006',
    category: 'Jackets',
    price: '₫9,300,000',
    stock: 34,
    maxStock: 80,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=400&h=500&fit=crop',
  },
  {
    id: 'PRD-007',
    name: 'Luxury Handbag',
    sku: 'ARN-HB-2024-007',
    category: 'Accessories',
    price: '₫6,700,000',
    stock: 5,
    maxStock: 25,
    status: 'active',
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=400&h=500&fit=crop',
  },
  {
    id: 'PRD-008',
    name: 'Wool Trousers',
    sku: 'ARN-TR-2024-008',
    category: 'Trousers',
    price: '₫3,800,000',
    stock: 0,
    maxStock: 100,
    status: 'draft',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=400&h=500&fit=crop',
  },
];

export function ProductList() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil((products?.length || 0) / itemsPerPage);
  
  const currentProducts = (products || []).slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="space-y-6">
      {/* Top Actions */}
      <div className="flex items-center justify-between">
        <h1 className="font-serif text-3xl">Product Inventory</h1>
        <div className="flex items-center gap-3">
          <button className="bg-white border border-brand-black text-brand-black px-5 py-2.5 uppercase text-xs tracking-wider hover:bg-brand-black hover:text-white transition-colors flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filter
          </button>
          <button className="bg-brand-gold hover:bg-brand-gold-hover text-brand-black px-5 py-2.5 uppercase text-xs tracking-wider transition-colors flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add Product
          </button>
        </div>
      </div>

      {/* Data Table - Gallery Style */}
      <div className="bg-white border border-border-light">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border-light">
                <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest font-semibold text-gray-600">
                  Image
                </th>
                <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest font-semibold text-gray-600">
                  Product Info
                </th>
                <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest font-semibold text-gray-600">
                  Category
                </th>
                <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest font-semibold text-gray-600">
                  Price
                </th>
                <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest font-semibold text-gray-600">
                  Stock
                </th>
                <th className="text-left px-6 py-4 text-[11px] uppercase tracking-widest font-semibold text-gray-600">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {currentProducts.map((product) => {
                const stockPercentage = (product.stock / product.maxStock) * 100;
                const isLowStock = stockPercentage < 30;
                
                return (
                  <tr 
                    key={product.id} 
                    className="border-b border-border-light hover:bg-gray-50/50 transition-colors"
                  >
                    <td className="px-6 py-6">
                      <div className="w-[60px] h-[80px] overflow-hidden bg-gray-100">
                        <img 
                          src={product.image} 
                          alt={product.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <div className="space-y-1">
                        <p className="font-serif font-semibold text-sm">{product.name}</p>
                        <p className="font-mono text-xs text-gray-500">{product.sku}</p>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-sm">{product.category}</span>
                    </td>
                    <td className="px-6 py-6">
                      <span className="font-semibold text-sm">{product.price}</span>
                    </td>
                    <td className="px-6 py-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span>{product.stock} units</span>
                          <span className="text-gray-500">of {product.maxStock}</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 overflow-hidden">
                          <div 
                            className={`h-full ${isLowStock ? 'bg-brand-gold' : 'bg-brand-black'}`}
                            style={{ width: `${stockPercentage}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      {product.status === 'active' ? (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500"></div>
                          <span className="text-sm">Active</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-gray-400"></div>
                          <span className="text-sm text-gray-500">Draft</span>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border-light">
          <p className="text-sm text-gray-600">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, products?.length || 0)} of {products?.length || 0} products
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="w-8 h-8 border border-border-light flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            
            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => setCurrentPage(i + 1)}
                className={`w-8 h-8 border flex items-center justify-center text-sm transition-colors
                  ${currentPage === i + 1 
                    ? 'bg-brand-black text-white border-brand-black' 
                    : 'border-border-light hover:bg-gray-50'
                  }
                `}
              >
                {i + 1}
              </button>
            ))}
            
            <button
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
              className="w-8 h-8 border border-border-light flex items-center justify-center hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
