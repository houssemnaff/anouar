'use client';

import React from 'react';
import { CartItem, Product } from '@/lib/types';

interface OrderSummaryProps {
  cart: CartItem[];
  getProductById: (id: string) => Product | undefined;
  cartTotal: number;
  totalWithTax: number;
}

export function OrderSummary({ cart, getProductById, cartTotal, totalWithTax }: OrderSummaryProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 sticky top-24">
      <h2 className="text-2xl font-bold text-primary mb-6">
        Résumé de la commande
      </h2>

      {/* Items */}
      <div className="space-y-4 mb-6 pb-6 border-b border-border max-h-64 overflow-y-auto">
        {cart.map((item) => {
          const product = getProductById(item.productId);
          if (!product) return null;
          return (
            <div key={product.id} className="flex justify-between text-sm">
              <div>
                <p className="font-medium text-foreground">
                  {product.name}
                </p>
                <p className="text-muted-foreground">
                  x {item.quantity}
                </p>
              </div>
              <p className="font-semibold text-foreground">
                {(product.price * item.quantity).toFixed(2) }  Dt
              </p>
            </div>
          );
        })}
      </div>

      {/* Totals */}
      <div className="space-y-3 mb-6 pb-6 border-b border-border">
        <div className="flex justify-between text-foreground">
          <span>Sous-total :</span>
          <span>{cartTotal.toFixed(2)} Dt</span>
        </div>
        <div className="flex justify-between text-foreground">
          <span>Livraison :</span>
          <span className="text-green-600">Gratuite</span>
        </div>
        <div className="flex justify-between text-foreground">
          <span>Taxes (10%) :</span>
          <span>{(cartTotal * 0.1).toFixed(2)} Dt</span>
        </div>
      </div>

      <div className="flex justify-between items-center">
        <span className="text-lg font-semibold text-foreground">
          Total :
        </span>
        <span className="text-3xl font-bold text-primary">
          {totalWithTax.toFixed(2)} Dt
        </span>
      </div>
    </div>
  );
}
