'use client';

import { Header } from '@/components/header';
import { ProductCard } from '@/components/product-card';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store-context';
import Link from 'next/link';
import { ExternalLink, BookOpen, Sparkles, PackageCheck, Layers, Tag, ArrowRight, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';
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
<section className="relative overflow-hidden bg-gradient-to-b from-background to-secondary/60 py-16 md:py-28">
  {/* Décor lumineux */}
  <div className="absolute inset-0 pointer-events-none">
    <div className="absolute -top-32 left-[10%] w-96 h-96 rounded-full bg-primary/15 blur-3xl animate-pulse" />
    <div className="absolute top-1/3 right-[5%] w-80 h-80 rounded-full bg-cyan-500/15 blur-3xl" />
    <div className="absolute -bottom-32 left-1/3 w-96 h-96 rounded-full bg-purple-500/10 blur-3xl" />
    {/* Grille subtile */}
    <div className="absolute inset-0 opacity-[0.04] bg-[linear-gradient(1deg,rgba(0,0,0,.4)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,.4)_1px,transparent_1px)] bg-[length:48px_48px]" />
  </div>

  <div className="relative container mx-auto px-4">
    <div className="max-w-3xl mx-auto text-center">
      
     

      <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-5 leading-[1.1]">
        <span className="bg-gradient-to-r from-primary via-blue-500 to-cyan-500 bg-clip-text text-transparent">
          Bienvenue chez Anouar Market
        </span>
      </h2>
      <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl mx-auto">
        Découvrez notre large sélection de produits cosmétiques de qualité, livrés à votre porte.
      </p>

      {/* Boutons d'action */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center mb-10">
        <Link href="/products">
          <Button
            size="lg"
            className="group bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-700 hover:to-cyan-600 text-white shadow-lg shadow-blue-600/25 hover:shadow-xl hover:shadow-blue-600/30 transition-all duration-300 rounded-full h-12 px-8 text-base"
          >
            Commencer mes achats
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </Link>
        <Link href="/sales">
          <Button
            size="lg"
            variant="outline"
            className="rounded-full h-12 px-8 text-base bg-card/60 backdrop-blur hover:bg-card"
          >
            Voir les soldes
          </Button>
        </Link>
      </div>

      {/* Avantages */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl mx-auto">
        {[
          { icon: PackageCheck, title: 'Toujours disponibles', desc: 'Produits en stock à tout moment' },
          { icon: Layers, title: 'Grand choix de produits', desc: 'Des dizaines de références différentes' },
          { icon: Tag, title: 'Prix bas', desc: 'Les meilleurs prix du marché' },
        ].map((item) => (
          <div
            key={item.title}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card/70 backdrop-blur px-4 py-3 text-left hover:border-primary/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <item.icon className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-foreground">{item.title}</p>
              <p className="text-xs text-muted-foreground">{item.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

      {/* Catalogues Section */}
      <section className="py-12 md:py-16 bg-white">
        <div className="container mx-auto px-4">
          <h3 className="text-3xl font-bold text-primary mb-8">Nos Catalogues</h3>
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
                              Cliquez pour lire le PDF complet
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
                          Ouvrir le catalogue complet
                        </Button>
                      ) : (
                        <Button
                          onClick={() => setSelectedImage({ imageUrl: catalogue.image, title: catalogue.title })}
                          className="rounded-lg w-full gap-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Voir l'image
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              {/* Scroll Indicator */}
              {visibleCatalogues.length > 3 && (
                <div className="text-center mt-4 text-sm text-muted-foreground">
                  ← Faites défiler horizontalement pour voir plus de catalogues →
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-12 bg-secondary rounded-2xl">
              <p className="text-muted-foreground">Aucun catalogue disponible pour le moment</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h3 className="text-3xl font-bold text-primary">Produits à la une</h3>
            <Link href="/products">
              <Button variant="outline" className="rounded-lg bg-transparent">
                Voir tout
              </Button>
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
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
            Fraîcheur garantie, livrée chez vous
          </h3>
          <p className="text-lg mb-8 max-w-2xl mx-auto opacity-90">
            Commandez maintenant et profitez d'une livraison rapide à votre domicile. Paiement à la livraison disponible.
          </p>
          <Link href="/products">
            <Button
              size="lg"
              variant="secondary"
              className="rounded-lg"
            >
              Commander
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-card border-t border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-10">
            {/* Marque */}
            <div className="md:col-span-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full overflow-hidden bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <img
                    src="/anouar1-removebg-preview.png"
                    alt="Logo Anouar Market"
                    className="w-8 h-8 object-contain"
                  />
                </div>
                <h4 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-500 bg-clip-text text-transparent">
                  Anouar Market
                </h4>
              </div>
              <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
                Votre boutique de confiance, des produits cosmétiques de qualité livrés à votre porte. Paiement à la livraison disponible.
              </p>
              {/* Avantages */}
              <div className="flex flex-wrap gap-2 mt-5">
                {[
                  { icon: PackageCheck, label: 'Stock disponible' },
                  { icon: Layers, label: 'Grand choix' },
                  { icon: Tag, label: 'Prix bas' },
                ].map((item) => (
                  <span
                    key={item.label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-secondary/60 px-3 py-1.5 text-xs font-medium text-muted-foreground"
                  >
                    <item.icon className="w-3.5 h-3.5 text-primary" />
                    {item.label}
                  </span>
                ))}
              </div>
            </div>

            {/* Liens rapides */}
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Liens rapides</h4>
              <ul className="space-y-2.5 text-sm text-muted-foreground">
                <li>
                  <Link href="/" className="hover:text-primary transition-colors inline-flex items-center gap-1 group">
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    Accueil
                  </Link>
                </li>
                <li>
                  <Link href="/products" className="hover:text-primary transition-colors inline-flex items-center gap-1 group">
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    Boutique
                  </Link>
                </li>
                <li>
                  <Link href="/sales" className="hover:text-primary transition-colors inline-flex items-center gap-1 group">
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    Soldes
                  </Link>
                </li>
                <li>
                  <Link href="/cart" className="hover:text-primary transition-colors inline-flex items-center gap-1 group">
                    <ArrowRight className="w-3 h-3 opacity-0 -ml-4 group-hover:opacity-100 group-hover:ml-0 transition-all" />
                    Panier
                  </Link>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-semibold text-foreground mb-4 text-sm uppercase tracking-wider">Contact</h4>
              <ul className="space-y-3 text-sm text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <Mail className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>test@email.com</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Phone className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>+212 XXX XXX XXX</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                  <span>Livraison à domicile</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Barre du bas */}
          <div className="border-t border-border pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-muted-foreground">
            <p>&copy; {new Date().getFullYear()} Anouar Market. Tous droits réservés.</p>
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Paiement à la livraison — 100% sécurisé</span>
            </div>
          </div>
        </div>
      </footer>
    </main>
  );
}
