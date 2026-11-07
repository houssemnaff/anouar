'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/header';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store-context';
import { ChevronDown } from 'lucide-react';


export default function ProductsPage() {
  const { products, loading } = useStore();
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [showOnSaleOnly, setShowOnSaleOnly] = useState(false);
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [showSortDropdown, setShowSortDropdown] = useState(false);

  const categories = useMemo(() => {
    const unique = Array.from(new Set(products.map((p) => p.category).filter(Boolean)));
    unique.sort((a, b) => a.localeCompare(b, 'fr'));
    return ['All', ...unique];
  }, [products]);

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
<section className="relative overflow-hidden py-12">
  <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-cyan-500/10" />
  <div className="absolute -top-20 left-1/4 w-72 h-72 rounded-full bg-primary/10 blur-3xl" />
  <div className="absolute -bottom-24 right-1/4 w-72 h-72 rounded-full bg-cyan-500/10 blur-3xl" />
  <div className="relative container mx-auto px-4 text-center">
    <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-semibold uppercase tracking-widest mb-3">
      Boutique
    </span>
    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-blue-500 to-cyan-500 bg-clip-text text-transparent mb-3">
      Nos Produits
    </h1>
    <p className="text-muted-foreground max-w-xl mx-auto">
      Découvrez toute notre collection Apple — iPhone, iPad, Mac et accessoires
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
                  <h3 className="text-lg font-semibold text-primary mb-4">Catégories</h3>
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
                      {category === 'All' ? 'Toutes' : category}
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
                  <h3 className="text-lg font-semibold text-primary mb-4">Trier par</h3>
                  <div className="space-y-2">
                    {[
                      { value: 'name', label: 'Nom (A-Z)' },
                      { value: 'price-low', label: 'Prix croissant' },
                      { value: 'price-high', label: 'Prix décroissant' },
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
                    <span className="text-sm">
                      {selectedCategory === 'All' ? 'Toutes' : selectedCategory}
                    </span>
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
                          {category === 'All' ? 'Toutes' : category}
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
                    <span className="text-sm">Trier</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  {showSortDropdown && (
                    <div className="absolute top-full left-0 right-0 bg-card border border-border rounded-lg mt-2 z-10 max-h-48 overflow-y-auto">
                      {[
                        { value: 'name', label: 'Nom (A-Z)' },
                      { value: 'price-low', label: 'Prix croissant' },
                      { value: 'price-high', label: 'Prix décroissant' },
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
              {loading ? (
                <div className="text-center py-16">
                  <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                  <p className="text-muted-foreground">Chargement des produits...</p>
                </div>
              ) : filteredAndSortedProducts.length > 0 ? (
                <>
                  <div className="flex items-center justify-between mb-6">
                    <p className="text-muted-foreground">
                      {filteredAndSortedProducts.length} produit
                      {filteredAndSortedProducts.length !== 1 ? 's' : ''} trouvé
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
                    Aucun produit trouvé dans cette catégorie
                  </p>
                  <Button
                    onClick={() => setSelectedCategory('All')}
                    className="rounded-lg"
                  >
                    Voir tous les produits
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
