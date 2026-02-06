'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/header';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store-context';
import { ChevronDown } from 'lucide-react';

const categories = [
  'All',
  'Dairy',
  'Fruits',
  'Vegetables',
  'Bakery',
  'Beverages',
  'Oils & Condiments',
];

export default function ProductsPage() {
  const { products } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [showOnSaleOnly, setShowOnSaleOnly] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      // Filter by category
      if (selectedCategory !== 'All' && product.category !== selectedCategory) {
        return false;
      }
      
      // Filter by sale status
      if (showOnSaleOnly && (!product.discount || product.discount <= 0)) {
        return false;
      }
      
      return true;
    });

    // Sort
    switch (sortBy) {
      case 'price-low':
        return filtered.sort((a, b) => a.price - b.price);
      case 'price-high':
        return filtered.sort((a, b) => b.price - a.price);
      case 'name':
      default:
        return filtered.sort((a, b) => a.name.localeCompare(b.name));
    }
  }, [products, selectedCategory, sortBy, showOnSaleOnly]);

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Page Header */}
<section className="bg-gradient-to-r from-blue-50 via-blue-100 to-cyan-50 py-8">
  <div className="container mx-auto px-4">
    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-2">
      Our Products
    </h1>
    <p className="text-blue-900/80">
      Browse our collection of quality products for all your needs
    </p>
  </div>
</section>

      {/* Filters and Products */}
      <section className="py-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar Filters - Desktop */}
            <div className="hidden lg:block">
              <div className="bg-card rounded-2xl p-6 border border-border sticky top-24">
                <h3 className="text-lg font-semibold text-primary mb-4">Categories</h3>
                <div className="space-y-2">
                  {categories.map((category) => (
                    <button
                      key={category}
                      onClick={() => setSelectedCategory(category)}
                      className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                        selectedCategory === category
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-secondary text-foreground hover:bg-muted'
                      }`}
                    >
                      {category}
                    </button>
                  ))}
                </div>

                <div className="mt-8 pt-6 border-t border-border">
                  <h3 className="text-lg font-semibold text-primary mb-4">Filters</h3>
                  <label className="flex items-center gap-3 px-4 py-3 bg-secondary rounded-lg cursor-pointer hover:bg-muted transition-colors">
                    <input
                      type="checkbox"
                      checked={showOnSaleOnly}
                      onChange={(e) => setShowOnSaleOnly(e.target.checked)}
                      className="w-4 h-4 accent-red-600"
                    />
                    <span className="text-foreground font-medium">Soldes uniquement</span>
                  </label>
                </div>

                <div className="mt-8 pt-6 border-t border-border">
                  <h3 className="text-lg font-semibold text-primary mb-4">Sort By</h3>
                  <div className="space-y-2">
                    {[
                      { value: 'name', label: 'Name (A-Z)' },
                      { value: 'price-low', label: 'Price: Low to High' },
                      { value: 'price-high', label: 'Price: High to Low' },
                    ].map((option) => (
                      <button
                        key={option.value}
                        onClick={() => setSortBy(option.value)}
                        className={`w-full text-left px-4 py-2 rounded-lg transition-colors ${
                          sortBy === option.value
                            ? 'bg-accent text-accent-foreground'
                            : 'bg-secondary text-foreground hover:bg-muted'
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Filters */}
            <div className="lg:hidden col-span-1 space-y-3 mb-6">
              <div className="flex gap-2">
                <div className="flex-1 relative">
                  <button
                    onClick={() => setShowCategoryDropdown(!showCategoryDropdown)}
                    className="w-full bg-card border border-border rounded-lg px-4 py-2 flex items-center justify-between text-foreground"
                  >
                    <span className="text-sm">{selectedCategory}</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {showCategoryDropdown && (
                    <div className="absolute top-full left-0 right-0 bg-card border border-border rounded-lg mt-2 z-10 max-h-48 overflow-y-auto">
                      {categories.map((category) => (
                        <button
                          key={category}
                          onClick={() => {
                            setSelectedCategory(category);
                            setShowCategoryDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-muted"
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex-1 relative">
                  <button
                    onClick={() => setShowSortDropdown(!showSortDropdown)}
                    className="w-full bg-card border border-border rounded-lg px-4 py-2 flex items-center justify-between text-foreground"
                  >
                    <span className="text-sm">Sort</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {showSortDropdown && (
                    <div className="absolute top-full left-0 right-0 bg-card border border-border rounded-lg mt-2 z-10 max-h-48 overflow-y-auto">
                      {[
                        { value: 'name', label: 'Name (A-Z)' },
                        { value: 'price-low', label: 'Price: Low to High' },
                        { value: 'price-high', label: 'Price: High to Low' },
                      ].map((option) => (
                        <button
                          key={option.value}
                          onClick={() => {
                            setSortBy(option.value);
                            setShowSortDropdown(false);
                          }}
                          className="w-full text-left px-4 py-2 hover:bg-muted"
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Sale Filter */}
              <label className="flex items-center gap-3 px-4 py-3 bg-card border border-border rounded-lg cursor-pointer">
                <input
                  type="checkbox"
                  checked={showOnSaleOnly}
                  onChange={(e) => setShowOnSaleOnly(e.target.checked)}
                  className="w-4 h-4 accent-red-600"
                />
                <span className="text-foreground font-medium text-sm">Soldes uniquement</span>
              </label>
            </div>

            {/* Products Grid */}
            <div className="lg:col-span-3">
              {filteredAndSortedProducts.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-muted-foreground">
                      Showing {filteredAndSortedProducts.length} product
                      {filteredAndSortedProducts.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {filteredAndSortedProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                  <p className="text-lg text-muted-foreground mb-4">
                    No products found in this category
                  </p>
                  <Button
                    onClick={() => setSelectedCategory('All')}
                    className="rounded-lg"
                  >
                    View All Products
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
