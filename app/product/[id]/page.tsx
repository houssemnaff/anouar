'use client';

import { use, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store-context';
import { ChevronLeft, ShoppingCart, Minus, Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
export default function ProductDetailPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const router = useRouter();
  const { getProductById, addToCart } = useStore();
  const [quantity, setQuantity] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

 const { id } = use(params);
  const product = getProductById(id);

  if (!product) {
    return (
      <main className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-8 rounded-lg gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Go Back
          </Button>
          <div className="text-center">
            <h1 className="text-2xl font-bold text-foreground mb-4">
              Product not found
            </h1>
            <p className="text-muted-foreground mb-8">
              The product you're looking for doesn't exist.
            </p>
            <Link href="/products">
              <Button className="rounded-lg">Back to Products</Button>
            </Link>
          </div>
        </div>
      </main>
    );
  }

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />

      {/* Breadcrumb */}
      <div className="bg-secondary py-4 border-b border-border">
        <div className="container mx-auto px-4">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="rounded-lg gap-2"
          >
            <ChevronLeft className="w-4 h-4" />
            Go Back
          </Button>
        </div>
      </div>

      {/* Product Detail */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            {/* Product Image */}
            <div className="flex items-center justify-center">
              <div className="relative w-full aspect-square bg-secondary rounded-2xl overflow-hidden border border-border">
                {product.inStock ? (
                  <Image
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    fill
                    className="object-cover"
                    priority
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-lg text-muted-foreground">
                      Out of Stock
                    </span>
                  </div>
                )}
                {product.featured && (
                  <div className="absolute top-4 right-4 bg-accent text-accent-foreground px-4 py-2 rounded-full font-semibold">
                    Featured
                  </div>
                )}
                {product.discount && product.discount > 0 && (
                  <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg">
                    -{product.discount}% OFF
                  </div>
                )}
              </div>
            </div>

            {/* Product Info */}
            <div className="flex flex-col justify-center">
              <div className="mb-4">
                <span className="inline-block text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {product.category}
                </span>
              </div>

              <h1 className="text-4xl font-bold text-primary mb-4">
                {product.name}
              </h1>

              <p className="text-lg text-foreground mb-6 leading-relaxed">
                {product.description}
              </p>

              {/* Status */}
              <div className="mb-8">
                {product.inStock ? (
                  <p className="text-lg font-semibold text-green-600">
                    ✓ In Stock
                  </p>
                ) : (
                  <p className="text-lg font-semibold text-red-600">
                    Out of Stock
                  </p>
                )}
              </div>

              {/* Price */}
              <div className="mb-8">
                {product.discount && product.discount > 0 ? (
                  <div className="flex items-baseline gap-4">
                    <div className="text-3xl font-bold text-muted-foreground line-through">
                      ${product.price.toFixed(2)}
                    </div>
                    <div className="text-5xl font-bold text-red-600">
                      ${(product.price * (1 - product.discount / 100)).toFixed(2)}
                    </div>
                  </div>
                ) : (
                  <div className="text-5xl font-bold text-primary">
                    ${product.price.toFixed(2)}
                  </div>
                )}
                {product.discount && product.discount > 0 && (
                  <p className="text-lg text-green-600 font-semibold mt-2">
                    You save ${(product.price * (product.discount / 100)).toFixed(2)} ({product.discount}% off)
                  </p>
                )}
              </div>

              {/* Quantity Selector */}
              {product.inStock && (
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-lg font-semibold text-foreground">
                    Quantity:
                  </span>
                  <div className="flex items-center border border-border rounded-lg">
                    <button
                      onClick={() => handleQuantityChange(quantity - 1)}
                      className="p-2 hover:bg-secondary transition-colors"
                      disabled={quantity <= 1}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="px-6 py-2 text-lg font-semibold">
                      {quantity}
                    </span>
                    <button
                      onClick={() => handleQuantityChange(quantity + 1)}
                      className="p-2 hover:bg-secondary transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

             {/* Add to Cart Button */}
<Button
  onClick={handleAddToCart}
  disabled={!product.inStock}
  size="lg"
  className="gap-2 rounded-xl mb-4 w-full sm:w-auto bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 font-semibold"
>
  <ShoppingCart className="w-5 h-5" />
  {addedToCart ? 'Ajouté au panier !' : 'Ajouter au panier'}
</Button>

{addedToCart && (
  <Link href="/cart" className="w-full sm:w-auto">
    <Button 
      variant="outline" 
      size="lg" 
      className="rounded-xl w-full border-2 border-blue-600 text-blue-700 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-700 transition-all duration-300 font-semibold"
    >
      Voir le panier
    </Button>
  </Link>
)}

              {/* Additional Info */}
              <div className="mt-12 pt-8 border-t border-border space-y-4">
                <div>
                  <h3 className="font-semibold text-primary mb-2">
                    Delivery Information
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Fast delivery available. Cash on delivery accepted.
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-primary mb-2">
                    Quality Guarantee
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    We guarantee fresh, quality products. If you're not satisfied,
                    we'll make it right.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      <section className="py-12 bg-secondary">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-primary mb-8">
            More in {product.category}
          </h2>
          <Link href={`/products?category=${product.category}`}>
            <Button className="rounded-lg">Browse Category</Button>
          </Link>
        </div>
      </section>
    </main>
  );
}
