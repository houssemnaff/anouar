'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { Wallet } from 'lucide-react';

interface OrderFormProps {
  formData: {
    customerName: string;
    customerPhone: string;
    deliveryAddress: string;
  };
  isSubmitting: boolean;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
}

export function OrderForm({ formData, isSubmitting, onInputChange, onSubmit }: OrderFormProps) {
  return (
    <div className="bg-card border border-border rounded-2xl p-6 md:p-8">
      <h2 className="text-2xl font-bold text-primary mb-6">
        Delivery Information
      </h2>

      <form onSubmit={onSubmit} className="space-y-6">
        {/* Name */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Full Name *
          </label>
          <input
            type="text"
            name="customerName"
            value={formData.customerName}
            onChange={onInputChange}
            placeholder="Enter your full name"
            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Phone Number *
          </label>
          <input
            type="tel"
            name="customerPhone"
            value={formData.customerPhone}
            onChange={onInputChange}
            placeholder="Enter your phone number"
            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            required
          />
        </div>

        {/* Address */}
        <div>
          <label className="block text-sm font-semibold text-foreground mb-2">
            Delivery Address *
          </label>
          <textarea
            name="deliveryAddress"
            value={formData.deliveryAddress}
            onChange={onInputChange}
            placeholder="Enter your complete delivery address"
            rows={4}
            className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            required
          />
        </div>

       {/* Payment Info */}
<div className="bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-200 rounded-xl p-5 shadow-md">
  <div className="flex items-center gap-3 mb-2">
    <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
      <Wallet className="w-5 h-5 text-white" />
    </div>
    <div>
      <p className="text-sm text-blue-900 font-bold">
        Mode de paiement
      </p>
      <p className="text-xs text-blue-700/80">
        Espèces à la livraison
      </p>
    </div>
  </div>
  <p className="text-xs text-blue-600/80 bg-blue-100/50 rounded-lg p-3 mt-3">
    💵 Vous paierez le livreur lorsque votre commande arrivera.
  </p>
</div>

{/* Submit Button */}
<Button
  type="submit"
  size="lg"
  disabled={isSubmitting}
  className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 disabled:from-blue-400 disabled:to-blue-500 text-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-xl font-semibold text-base h-12"
>
  {isSubmitting ? (
    <span className="flex items-center gap-2">
      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
      Traitement en cours...
    </span>
  ) : (
    'Passer la commande'
  )}
</Button>
</form>

{/* Back to Cart */}
<div className="mt-6 pt-6 border-t border-blue-200">
  <Link href="/cart">
    <Button 
      variant="outline" 
      className="w-full rounded-xl border-2 border-blue-600 text-blue-700 hover:bg-blue-50 hover:text-blue-800 hover:border-blue-700 transition-all duration-300 font-medium h-11"
    >
      ← Retour au panier
    </Button>
  </Link>
</div>
    </div>
  );
}
