'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Header } from '@/components/header';
import { Button } from '@/components/ui/button';
import { useStore } from '@/lib/store-context';
import { Trash2, Minus, Plus, ShoppingCart } from 'lucide-react';

export default function CartPage() {
  const { cart, removeFromCart, updateCartQuantity, getCartTotal, getProductById } =
    useStore();

  const cartTotal = getCartTotal();
  const isEmpty = cart.length === 0;

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    if (newQuantity > 0) {
      updateCartQuantity(productId, newQuantity);
    }
  };

  return (
    <main className="min-h-screen bg-background">
      <Header />

     

      {/* Cart Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          {isEmpty ? (
            // Empty Cart
            <div className="text-center py-16">
              <div className="mb-6 flex justify-center">
                <div className="text-6xl">🛒</div>
              </div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Your cart is empty
              </h2>
              <p className="text-muted-foreground mb-8">
                Add some delicious groceries to get started!
              </p>
              <Link href="/products">
                <Button size="lg" className="rounded-lg gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Continue Shopping
                </Button>
              </Link>
            </div>
          ) : (
            // Cart with Items
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Cart Items */}
              <div className="lg:col-span-2">
                <div className="space-y-4">
                  {cart.map((cartItem) => {
                    const product = getProductById(cartItem.productId);
                    if (!product) return null;

                    const itemTotal = product.price * cartItem.quantity;

                    return (
                      <div
                        key={product.id}
                        className="bg-card border border-border rounded-2xl p-4 md:p-6 flex gap-4 md:gap-6 items-start"
                      >
                        {/* Product Image */}
                        <div className="relative w-20 h-20 md:w-24 md:h-24 flex-shrink-0 bg-secondary rounded-xl overflow-hidden">
                          <Image
                            src={product.image || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            className="object-cover"
                          />
                        </div>

                        {/* Product Info */}
                        <div className="flex-grow">
                          <Link href={`/product/${product.id}`}>
                            <h3 className="font-semibold text-lg text-card-foreground hover:text-primary transition-colors mb-1">
                              {product.name}
                            </h3>
                          </Link>
                          <p className="text-sm text-muted-foreground mb-3">
                            {product.category}
                          </p>

                          {/* Quantity Controls */}
                          <div className="flex items-center justify-between mt-4">
                            <div className="flex items-center border border-border rounded-lg">
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    product.id,
                                    cartItem.quantity - 1
                                  )
                                }
                                className="p-1 md:p-2 hover:bg-secondary transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="px-3 md:px-4 py-1 md:py-2 text-sm md:text-base font-semibold">
                                {cartItem.quantity}
                              </span>
                              <button
                                onClick={() =>
                                  handleQuantityChange(
                                    product.id,
                                    cartItem.quantity + 1
                                  )
                                }
                                className="p-1 md:p-2 hover:bg-secondary transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>

                            <div className="text-right">
                              <p className="text-xs text-muted-foreground mb-1">
                                ${product.price.toFixed(2)} each
                              </p>
                              <p className="text-lg md:text-xl font-bold text-primary">
                                ${itemTotal.toFixed(2)}
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Remove Button */}
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                          title="Remove from cart"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    );
                  })}
                </div>

                {/* Continue Shopping */}
                <div className="mt-8">
                  <Link href="/products">
                    <Button variant="outline" className="rounded-lg bg-transparent">
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Cart Summary */}
              <div className="lg:col-span-1">
                <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
                  <h2 className="text-2xl font-bold text-primary mb-6">
                    Order Summary
                  </h2>

                  <div className="space-y-3 mb-6 pb-6 border-b border-border">
                    <div className="flex justify-between text-foreground">
                      <span>Subtotal:</span>
                      <span>${cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-foreground">
                      <span>Shipping:</span>
                      <span className="text-green-600">Free</span>
                    </div>
                    <div className="flex justify-between text-foreground">
                      <span>Tax:</span>
                      <span>${(cartTotal * 0.1).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mb-6">
                    <span className="text-lg font-semibold text-foreground">
                      Total:
                    </span>
                    <span className="text-3xl font-bold text-primary">
                      ${(cartTotal * 1.1).toFixed(2)}
                    </span>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-200 rounded-lg p-4 mb-6 shadow-sm">
  <p className="text-sm text-blue-900">
    <span className="font-semibold">Paiement:</span> Espèces à la livraison
  </p>
  <p className="text-xs text-blue-700/80 mt-2">
    Payez lorsque votre commande arrive à votre porte.
  </p>
</div>

<Link href="/order">
  <Button 
    size="lg" 
    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-lg font-semibold"
  >
    Procéder au paiement
  </Button>
</Link>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
