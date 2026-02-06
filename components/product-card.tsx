'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store-context';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useStore();

  const handleAddToCart = () => {
    addToCart(product.id, 1);
  };

  return (
    <div className="rounded-2xl bg-card overflow-hidden border border-border hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
      {/* Product Image */}
      <div className="relative w-full aspect-[4/3] bg-secondary overflow-hidden">
        {product.inStock ? (
          <Image
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground">Out of Stock</span>
          </div>
        )}
        {product.featured && (
          <div className="absolute top-3 right-3 bg-accent text-accent-foreground px-3 py-1 rounded-full text-xs font-semibold">
            Featured
          </div>
        )}
        {product.discount && product.discount > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg">
            -{product.discount}%
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-grow">
        <div className="flex-grow">
          <Link href={`/product/${product.id}`}>
            <h3 className="font-semibold text-lg text-card-foreground hover:text-primary transition-colors mb-1">
              {product.name}
            </h3>
          </Link>
          <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
          <p className="text-sm text-card-foreground line-clamp-2 mb-3">
            {product.description}
          </p>
        </div>

        {/* Price and Action */}
        {/* Price and Action */}
        <div className="flex items-center justify-between pt-3 border-t border-blue-100">
          <div>
            {product.discount && product.discount > 0 ? (
              <div className="flex flex-col">
                <span className="text-sm text-gray-400 line-through">
                  ${product.price.toFixed(2)}
                </span>
                <span className="text-2xl font-bold text-red-600">
                  ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                </span>
              </div>
            ) : (
              <div className="text-2xl font-bold text-blue-600">
                ${product.price.toFixed(2)}
              </div>
            )}
          </div>
          <Button
            onClick={handleAddToCart}
            disabled={!product.inStock}
            className="gap-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg transition-all px-3 py-1.5 h-8"
          >
            <ShoppingCart className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
