'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function EmptyCartMessage() {
  return (
    <section className="py-16">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Votre panier est vide
        </h2>
        <p className="text-muted-foreground mb-8">
          Ajoutez des produits à votre panier avant de passer une commande.
        </p>
        <Link href="/products">
          <Button className="rounded-lg">Continuer mes achats</Button>
        </Link>
      </div>
    </section>
  );
}
