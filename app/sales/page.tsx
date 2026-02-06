'use client';

import { Header } from '@/components/header';
import { ProductCard } from '@/components/product-card';
import { useStore } from '@/lib/store-context';
import { Percent, TrendingDown } from 'lucide-react';

export default function SalesPage() {
  const { products, loading } = useStore();

  // Filter products that have a discount
  const saleProducts = products.filter(product => 
    product.discount && product.discount > 0
  );

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Chargement des soldes...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-red-600 to-red-700 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Percent className="w-12 h-12" />
            <h1 className="text-4xl md:text-5xl font-bold">Soldes & Promotions</h1>
          </div>
          <p className="text-center text-xl text-red-100">
            Profitez de nos meilleures offres sur une sélection de produits
          </p>
          {saleProducts.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-4">
              <TrendingDown className="w-5 h-5" />
              <p className="text-lg font-semibold">
                {saleProducts.length} produit{saleProducts.length > 1 ? 's' : ''} en promotion
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Products Section */}
      <section className="container mx-auto px-4 py-12">
        {saleProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-red-100 rounded-full flex items-center justify-center">
              <Percent className="w-12 h-12 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Aucune promotion disponible
            </h2>
            <p className="text-muted-foreground mb-6">
              Revenez bientôt pour découvrir nos nouvelles offres !
            </p>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Tous les produits en solde
              </h2>
              <p className="text-muted-foreground">
                Économisez jusqu'à {Math.max(...saleProducts.map(p => p.discount || 0))}% sur nos produits
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {saleProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
