'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { useStore } from '@/lib/store-context';
import { ShoppingCart, Eye, Sparkles, Check } from 'lucide-react';
import { useState } from 'react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useStore();
  const [added, setAdded] = useState(false);

  const hasDiscount = !!product.discount && product.discount > 0;
  const finalPrice = product.price * (1 - (product.discount ?? 0) / 100);

  const handleAddToCart = () => {
    if (!product.inStock) return;
    addToCart(product.id, 1);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="group relative rounded-3xl bg-card overflow-hidden border border-border/60 flex flex-col h-full transition-all duration-500 hover:shadow-2xl hover:shadow-primary/10 hover:-translate-y-1.5 hover:border-primary/30">
      {/* Glow decoratif */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-48 h-48 rounded-full bg-primary/10 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

      {/* Image */}
      <Link
        href={`/product/${product.id}`}
        className="relative block w-full aspect-[4/3] bg-gradient-to-br from-secondary via-background to-secondary overflow-hidden"
      >
        {product.inStock ? (
          <Image
            src={product.image || '/placeholder.svg'}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, 25vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-2 text-muted-foreground">
            <div className="w-12 h-12 rounded-2xl bg-muted flex items-center justify-center">
              <Eye className="w-5 h-5 opacity-50" />
            </div>
            <span className="text-xs font-medium uppercase tracking-widest">
              Rupture de stock
            </span>
          </div>
        )}

        {/* Damier par défaut derrière l'image pendant le chargement */}
        <div className="absolute inset-0 bg-[linear-gradient(45deg,#e5e7eb_25%,transparent_25%,transparent_75%,#e5e7eb_75%),linear-gradient(45deg,#e5e7eb_25%,transparent_25%,transparent_75%,#e5e7eb_75%)] bg-[length:20px_20px] bg-[position:0_0,10px_10px] opacity-0 -z-10" />

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {hasDiscount && (
            <span className="bg-gradient-to-r from-red-500 to-rose-600 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg shadow-red-500/30">
              -{product.discount}%
            </span>
          )}
          {product.featured && (
            <span className="bg-primary/90 backdrop-blur text-primary-foreground px-3 py-1 rounded-full text-xs font-semibold shadow-md flex items-center gap-1">
              <Sparkles className="w-3 h-3" />
              À la une
            </span>
          )}
        </div>

        {/* Bouton aperçu au survol */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
          <div className="rounded-xl bg-background/80 backdrop-blur-md border border-border/50 text-center py-2 text-sm font-medium text-foreground flex items-center justify-center gap-2">
            <Eye className="w-4 h-4" />
            Voir le produit
          </div>
        </div>
      </Link>

      {/* Info */}
      <div className="p-4 flex flex-col flex-grow gap-2">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-primary/70">
          {product.category}
        </span>

        <Link href={`/product/${product.id}`}>
          <h3 className="font-semibold text-base leading-snug text-card-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {product.name}
          </h3>
        </Link>

        <p className="text-sm text-muted-foreground line-clamp-2 flex-grow">
          {product.description}
        </p>

        {/* Prix + action */}
        <div className="flex items-end justify-between pt-2">
          <div className="flex items-baseline gap-2">
            <span
              className={`text-xl font-bold tracking-tight ${
                hasDiscount ? 'text-red-500' : 'text-foreground'
              }`}
            >
             {finalPrice.toFixed(2)}  Dt
            </span>
            {hasDiscount && (
              <span className="text-sm text-muted-foreground line-through">
               {product.price.toFixed(2)}  Dt
              </span>
            )}
          </div>

          <button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            aria-label="Ajouter au panier"
            className={`h-10 w-10 rounded-full flex items-center justify-center transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed ${
              added
                ? 'bg-emerald-500 text-white scale-110'
                : 'bg-primary text-primary-foreground shadow-md shadow-primary/25 hover:shadow-lg hover:shadow-primary/40 hover:scale-110 active:scale-95'
            }`}
          >
            {added ? (
              <Check className="w-4 h-4" />
            ) : (
              <ShoppingCart className="w-4 h-4" />
            )}
          </button>
        </div>

        {/* Stock */}
        <div className="flex items-center gap-1.5 text-xs">
          {product.inStock ? (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-emerald-600 dark:text-emerald-400 font-medium">
                En stock
              </span>
            </>
          ) : (
            <>
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              <span className="text-red-500 font-medium">Indisponible</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
