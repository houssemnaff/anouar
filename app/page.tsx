'use client';

import { Header } from '@/components/header';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store-context';
import Link from 'next/link';
import { ExternalLink, BookOpen } from 'lucide-react';
import { useState } from 'react';
import dynamic from 'next/dynamic';

// Import CatalogueViewer dynamically to avoid SSR issues with PDF.js
const CatalogueViewer = dynamic(
  () => import('@/components/catalogue-viewer').then((mod) => mod.CatalogueViewer),
  { ssr: false }
);

export default function Home() {
  const { products, catalogues } = useStore();
  const featuredProducts = products.filter((p) => p.featured);
  const visibleCatalogues = catalogues.filter((c) => c.visible);
  const [selectedCatalogue, setSelectedCatalogue] = useState<{ pdfUrl: string; title: string } | null>(null);
  const [selectedImage, setSelectedImage] = useState<{ imageUrl: string; title: string } | null>(null);

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* PDF Viewer Modal */}
      {selectedCatalogue && (
        <CatalogueViewer
          pdfUrl={selectedCatalogue.pdfUrl}
          title={selectedCatalogue.title}
          onClose={() => setSelectedCatalogue(null)}
        />
      )}

      {/* Image Viewer Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedImage(null)}
        >
          <div className="relative max-w-5xl max-h-full" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            <img
              src={selectedImage.imageUrl}
              alt={selectedImage.title}
              className="max-w-full max-h-[90vh] object-contain rounded-lg shadow-2xl"
            />
            <h3 className="text-white text-center mt-4 text-xl font-semibold">{selectedImage.title}</h3>
          </div>
        </div>
      )}

     {/* Hero Section */}
<section className="bg-gradient-to-r from-blue-50 via-blue-100 to-cyan-50 py-12 md:py-20">
  <div className="container mx-auto px-4">
    <div className="max-w-2xl">
      <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent mb-4 leading-tight">
        Welcome to Anouar Market
      </h2>
      <p className="text-lg text-blue-900/80 mb-6 leading-relaxed">
        Everything you need in one place. Discover our wide selection of quality products, from fresh groceries to household essentials.
      </p>
      <Link href="/products">
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg"
        >
          Start Shopping
        </Button>
      </Link>
    </div>
  </div>
</section>

      {/* Catalogues Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-primary mb-8">Our Catalogues</h3>
          {visibleCatalogues.length > 0 ? (
            <div className="relative">
              <div className="flex gap-6 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-blue-600 scrollbar-track-gray-200 snap-x snap-mandatory">
                {visibleCatalogues.map((catalogue) => (
                  <div
                    key={catalogue.id}
                    className="flex-shrink-0 w-[85vw] md:w-[calc(33.333%-16px)] rounded-2xl bg-card border border-border overflow-hidden hover:shadow-lg transition-shadow snap-start"
                  >
                    {/* Catalogue Preview */}
                    <div className="relative h-64 bg-secondary group cursor-pointer">
                      {catalogue.pdfUrl ? (
                        // Preview de la première page du PDF
                        <div className="relative w-full h-full">
                          <iframe
                            src={`${catalogue.pdfUrl}#page=1&toolbar=0&navpanes=0&scrollbar=0`}
                            className="w-full h-full pointer-events-none"
                            title={`Preview of ${catalogue.title}`}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-4">
                            <span className="text-white text-sm font-semibold bg-blue-600 px-4 py-2 rounded-full flex items-center gap-2">
                              <BookOpen className="w-4 h-4" />
                              Click to read full PDF
                            </span>
                          </div>
                        </div>
                      ) : (
                        // Affichage de l'image normale
                        <img
                          src={catalogue.image || "/placeholder.svg"}
                          alt={catalogue.title}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>

                    {/* Catalogue Content */}
                    <div className="p-6">
                      <h4 className="text-xl font-semibold text-primary mb-2">{catalogue.title}</h4>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-2">{catalogue.description}</p>
                      {catalogue.pdfUrl ? (
                        <Button
                          onClick={() => setSelectedCatalogue({ pdfUrl: catalogue.pdfUrl!, title: catalogue.title })}
                          className="rounded-lg w-full gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        >
                          <BookOpen className="w-4 h-4" />
                          Open Full Catalogue
                        </Button>
                      ) : (
                        <Button
                          onClick={() => setSelectedImage({ imageUrl: catalogue.image, title: catalogue.title })}
                          className="rounded-lg w-full gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        >
                          <ExternalLink className="w-4 h-4" />
                          View Image
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {/* Scroll Indicator */}
              {visibleCatalogues.length > 3 && (
                <div className="text-center mt-4 text-sm text-muted-foreground">
                  ← Scroll horizontally to see more catalogues →
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-secondary rounded-2xl">
              <p className="text-muted-foreground">No catalogues available at the moment</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-primary">Featured Products</h3>
            <Link href="/products">
              <Button variant="outline" className="rounded-lg bg-transparent">
                View All
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary text-primary-foreground py-12 md:py-16">
        <div className="container mx-auto px-4 text-center">
          <h3 className="text-3xl md:text-4xl font-bold mb-4">
            Fresh Quality, Always Delivered
          </h3>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Order now and enjoy fast delivery right to your home. Cash on delivery available for all orders.
          </p>
          <Link href="/products">
            <Button
              size="lg"
              variant="secondary"
              className="rounded-lg"
            >
              Shop Now
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary py-8 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="font-bold text-primary mb-3">Apple Anwar Market</h4>
              <p className="text-sm text-muted-foreground">
                Your trusted local grocery store delivering quality products to your doorstep.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-primary mb-3">Quick Links</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/products" className="hover:text-primary transition-colors">
                    Shop
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="hover:text-primary transition-colors">
                    Cart
                  </Link>
                </li>
                <li>
                  <Link href="/admin" className="hover:text-primary transition-colors">
                    Admin
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-primary mb-3">Contact</h4>
              <p className="text-sm text-muted-foreground">
                Email: info@appleanwar.com<br />
                Phone: +1 (555) 123-4567
              </p>
            </div>
          </div>
          <div className="border-t border-border pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Apple Anwar Market. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </main>
  );
}
